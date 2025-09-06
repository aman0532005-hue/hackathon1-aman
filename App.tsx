import React, { useState, useCallback } from 'react';
import { AppState, InterviewConfig, InterviewTurn, FinalSummary } from './types';
import { generateInterviewQuestions, evaluateAnswer, generateFinalSummary } from './services/geminiService';
import SetupScreen from './components/SetupScreen';
import InterviewScreen from './components/InterviewScreen';
import SummaryScreen from './components/SummaryScreen';
import Header from './components/common/Header';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  const [interviewTurns, setInterviewTurns] = useState<InterviewTurn[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [finalSummary, setFinalSummary] = useState<FinalSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartInterview = useCallback(async (config: InterviewConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      const questionsText = await generateInterviewQuestions(config);
      const turns: InterviewTurn[] = questionsText.map((text, index) => ({
        question: { id: index, text },
      }));
      setInterviewConfig(config);
      setInterviewTurns(turns);
      setCurrentQuestionIndex(0);
      setAppState(AppState.INTERVIEW);
    } catch (err) {
      setError('Failed to generate interview questions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEndInterview = useCallback(async (finalTurns: InterviewTurn[]) => {
    if (!interviewConfig) return;
    setIsLoading(true);
    setError(null);
    try {
      const summary = await generateFinalSummary(finalTurns, interviewConfig);
      setFinalSummary(summary);
      setAppState(AppState.SUMMARY);
    } catch (err) {
      setError('Failed to generate the final summary. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [interviewConfig]);

  const handleSubmitAnswer = useCallback(async (answer: string) => {
    if (!interviewConfig) return;
    setIsLoading(true);
    setError(null);

    const currentTurn = interviewTurns[currentQuestionIndex];
    const updatedTurn: InterviewTurn = { ...currentTurn, answer };
    
    try {
      const feedback = await evaluateAnswer(currentTurn.question.text, answer, interviewConfig);
      updatedTurn.feedback = feedback;

      const updatedTurns = [...interviewTurns];
      updatedTurns[currentQuestionIndex] = updatedTurn;
      setInterviewTurns(updatedTurns);

      if (currentQuestionIndex < interviewTurns.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        await handleEndInterview(updatedTurns);
      }
    } catch (err) {
      setError('Failed to evaluate your answer. Please try submitting again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentQuestionIndex, interviewConfig, interviewTurns, handleEndInterview]);

  const handleSkipQuestion = useCallback(() => {
    if (isLoading) return;
    if (currentQuestionIndex < interviewTurns.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleEndInterview(interviewTurns);
    }
  }, [currentQuestionIndex, interviewTurns.length, isLoading, handleEndInterview]);

  const handleRestart = () => {
    setAppState(AppState.SETUP);
    setInterviewConfig(null);
    setInterviewTurns([]);
    setCurrentQuestionIndex(0);
    setFinalSummary(null);
    setError(null);
    setIsLoading(false);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.SETUP:
        return <SetupScreen onStart={handleStartInterview} isLoading={isLoading} />;
      case AppState.INTERVIEW:
        return (
          <InterviewScreen
            interviewConfig={interviewConfig!}
            interviewTurns={interviewTurns}
            currentQuestionIndex={currentQuestionIndex}
            onSubmit={handleSubmitAnswer}
            onSkip={handleSkipQuestion}
            isLoading={isLoading}
            error={error}
          />
        );
      case AppState.SUMMARY:
        return finalSummary ? <SummaryScreen summary={finalSummary} onRestart={handleRestart} /> : null;
      default:
        return <SetupScreen onStart={handleStartInterview} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-4xl mt-8">
        <div key={appState}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;