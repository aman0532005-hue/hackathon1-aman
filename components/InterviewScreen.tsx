import React, { useState, useEffect } from 'react';
import { InterviewConfig, InterviewTurn } from '../types';
import Button from './common/Button';
import Card from './common/Card';
import Spinner from './common/Spinner';

interface InterviewScreenProps {
  interviewConfig: InterviewConfig;
  interviewTurns: InterviewTurn[];
  currentQuestionIndex: number;
  onSubmit: (answer: string) => void;
  onSkip: () => void;
  isLoading: boolean;
  error: string | null;
}

const InterviewScreen: React.FC<InterviewScreenProps> = ({
  interviewTurns,
  currentQuestionIndex,
  onSubmit,
  onSkip,
  isLoading,
  error
}) => {
  const [answer, setAnswer] = useState('');
  
  const currentTurn = interviewTurns[currentQuestionIndex];
  const previousTurn = currentQuestionIndex > 0 ? interviewTurns[currentQuestionIndex - 1] : null;

  useEffect(() => {
    setAnswer('');
  }, [currentQuestionIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center opacity-0 animate-fade-in-up">
        <p className="text-slate-400">Question {currentQuestionIndex + 1} of {interviewTurns.length}</p>
      </div>
      
      {previousTurn?.feedback && (
         <Card animated={true}>
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Feedback for Previous Question</h3>
            <div className="flex justify-between items-center mb-2">
                <p className="text-slate-300 italic">"{previousTurn.question.text}"</p>
                <span className={`text-xl font-bold px-3 py-1 rounded-full ${previousTurn.feedback.score > 7 ? 'text-green-300 bg-green-900/50' : previousTurn.feedback.score > 4 ? 'text-yellow-300 bg-yellow-900/50' : 'text-red-300 bg-red-900/50'}`}>
                    {previousTurn.feedback.score}/10
                </span>
            </div>
            <p className="text-slate-200 whitespace-pre-wrap">{previousTurn.feedback.feedback}</p>
        </Card>
      )}

      <Card key={currentQuestionIndex} className="opacity-0 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-semibold text-slate-200 mb-3">{currentTurn.question.text}</label>
            <div className="relative w-full">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={8}
                className="w-full bg-slate-800 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-100 placeholder-slate-500 hover:border-slate-500 focus:shadow-lg focus:shadow-blue-500/20"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="h-6 text-center text-sm">
            {error && <p className="text-sm text-red-400 animate-pop-in">{error}</p>}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button type="submit" disabled={isLoading || !answer.trim()} fullWidth>
              {isLoading ? <Spinner /> : "Submit Answer"}
            </Button>
            <Button onClick={onSkip} variant="secondary" disabled={isLoading} fullWidth>
              Skip Question
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default InterviewScreen;