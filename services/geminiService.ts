
import { GoogleGenAI, Type } from "@google/genai";
import { InterviewConfig, AnswerFeedback, FinalSummary, InterviewTurn } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

export const generateInterviewQuestions = async (config: InterviewConfig): Promise<string[]> => {
  const prompt = `You are an expert interviewer. Generate ${config.questionCount} ${config.mode} interview questions for a ${config.role} role, specializing in ${config.domain || 'general aspects'}. Return the response as a JSON array of strings. Do not include any introductory text, markdown formatting, or code block syntax. Just the raw JSON array.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
      },
    },
  });

  try {
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse questions JSON:", response.text);
    throw new Error("Received malformed data from AI for questions.");
  }
};

export const evaluateAnswer = async (question: string, answer: string, config: InterviewConfig): Promise<AnswerFeedback> => {
  const prompt = `You are an expert interviewer evaluating a candidate's response. The candidate is applying for a ${config.role} role.

Question: "${question}"

Candidate's Answer: "${answer}"

Evaluate the answer for clarity, correctness, and completeness. Provide constructive feedback and a score from 1 to 10. Return your evaluation as a JSON object with two keys: "feedback" (a string) and "score" (an integer). Do not include any introductory text, markdown formatting, or code block syntax. Just the raw JSON object.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          feedback: { type: Type.STRING },
          score: { type: Type.INTEGER },
        },
        required: ["feedback", "score"],
      },
    },
  });

  try {
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse feedback JSON:", response.text);
    throw new Error("Received malformed data from AI for feedback.");
  }
};

export const generateFinalSummary = async (interviewTurns: InterviewTurn[], config: InterviewConfig): Promise<FinalSummary> => {
  const transcript = interviewTurns
    .map((turn, index) => `Question ${index + 1}: ${turn.question.text}\nAnswer: ${turn.answer || "Skipped"}\nFeedback: ${turn.feedback?.feedback || "N/A"}\nScore: ${turn.feedback?.score || "N/A"}\n---`)
    .join('\n');

  const prompt = `You are an expert career coach summarizing an interview performance for a ${config.role} candidate. Here is the full transcript of the interview:

${transcript}

Based on the entire interview, provide a final summary. Identify key strengths and areas for improvement. Give overall constructive feedback and an overall score out of 10. Return your analysis as a JSON object with keys: "strengths" (an array of strings), "areasToImprove" (an array of strings), "overallFeedback" (a string), and "overallScore" (an integer). Do not include any introductory text, markdown formatting, or code block syntax. Just the raw JSON object.`;
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          areasToImprove: { type: Type.ARRAY, items: { type: Type.STRING } },
          overallFeedback: { type: Type.STRING },
          overallScore: { type: Type.INTEGER },
        },
        required: ["strengths", "areasToImprove", "overallFeedback", "overallScore"],
      },
    },
  });

  try {
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse summary JSON:", response.text);
    throw new Error("Received malformed data from AI for summary.");
  }
};
