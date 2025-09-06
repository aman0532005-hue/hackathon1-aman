export enum InterviewMode {
  TECHNICAL = 'Technical',
  BEHAVIORAL = 'Behavioral',
}

export enum AppState {
  SETUP,
  INTERVIEW,
  SUMMARY,
}

export interface InterviewConfig {
  role: string;
  domain: string;
  mode: InterviewMode;
  questionCount: number;
}

export interface Question {
  id: number;
  text: string;
}

export interface AnswerFeedback {
  feedback: string;
  score: number;
}

export interface InterviewTurn {
  question: Question;
  answer?: string;
  feedback?: AnswerFeedback;
}

export interface FinalSummary {
  strengths: string[];
  areasToImprove: string[];
  overallScore: number;
  overallFeedback: string;
}