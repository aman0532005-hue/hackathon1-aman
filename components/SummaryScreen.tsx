
import React from 'react';
import { FinalSummary } from '../types';
import Button from './common/Button';
import Card from './common/Card';

interface SummaryScreenProps {
  summary: FinalSummary;
  onRestart: () => void;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-green-400 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const ImprovementIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-yellow-400 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);


const SummaryScreen: React.FC<SummaryScreenProps> = ({ summary, onRestart }) => {
  const scoreColor = summary.overallScore > 7 ? 'text-green-400' : summary.overallScore > 4 ? 'text-yellow-400' : 'text-red-400';
  const scoreStrokeColor = summary.overallScore > 7 ? 'stroke-green-400' : summary.overallScore > 4 ? 'stroke-yellow-400' : 'stroke-red-400';

  return (
    <Card className="opacity-0 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-cyan-400">Interview Report</h2>
        <p className="text-slate-400 mt-2">Here's your performance summary.</p>
      </div>

      <div className="flex justify-center items-center mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className={`relative w-40 h-40 rounded-full flex justify-center items-center bg-slate-800`}>
          <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-700" strokeWidth="3" stroke="currentColor" fill="none"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className={`${scoreStrokeColor} animate-fill-progress`} strokeWidth="3" strokeDasharray={`100, 100`} strokeLinecap="round" stroke="currentColor" fill="none"
                  style={{ strokeDashoffset: 100 - summary.overallScore * 10 }}
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div className="text-center opacity-0 animate-pop-in" style={{ animationDelay: '1000ms' }}>
            <span className={`text-4xl font-bold ${scoreColor}`}>{summary.overallScore}</span>
            <span className="text-slate-400">/10</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <h3 className="text-xl font-semibold text-slate-200 mb-3">Overall Feedback</h3>
        <p className="text-slate-300 bg-slate-800 p-4 rounded-lg">{summary.overallFeedback}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="group opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <h3 className="text-xl font-semibold text-slate-200 mb-3 flex items-center"><CheckIcon /> Strengths</h3>
          <ul className="space-y-2 list-inside">
            {summary.strengths.map((item, index) => (
              <li key={index} className="bg-slate-800 p-3 rounded-md text-slate-300 opacity-0 animate-fade-in-up" style={{ animationDelay: `${700 + index * 100}ms` }}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="group opacity-0 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          <h3 className="text-xl font-semibold text-slate-200 mb-3 flex items-center"><ImprovementIcon /> Areas for Improvement</h3>
          <ul className="space-y-2 list-inside">
            {summary.areasToImprove.map((item, index) => (
              <li key={index} className="bg-slate-800 p-3 rounded-md text-slate-300 opacity-0 animate-fade-in-up" style={{ animationDelay: `${800 + index * 100}ms` }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
        <Button onClick={onRestart}>Start New Interview</Button>
      </div>
    </Card>
  );
};

export default SummaryScreen;