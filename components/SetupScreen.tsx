import React, { useState, useEffect } from 'react';
import { InterviewConfig, InterviewMode } from '../types';
import { JOB_ROLES, DOMAINS } from '../constants';
import Button from './common/Button';
import Card from './common/Card';
import Spinner from './common/Spinner';

interface SetupScreenProps {
  onStart: (config: InterviewConfig) => void;
  isLoading: boolean;
}

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading }) => {
  const [role, setRole] = useState<string>(JOB_ROLES[0]);
  const [domain, setDomain] = useState<string>('');
  const [mode, setMode] = useState<InterviewMode>(InterviewMode.TECHNICAL);
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [availableDomains, setAvailableDomains] = useState<string[]>([]);

  useEffect(() => {
    const domainsForRole = DOMAINS[role] || [];
    setAvailableDomains(domainsForRole);
    setDomain(domainsForRole[0] || '');
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      role,
      domain,
      mode,
      questionCount,
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-2xl font-bold text-center text-cyan-400">Configure Your Mock Interview</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {/* Job Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">Job Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-slate-500"
            >
              {JOB_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Domain */}
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-slate-300 mb-2">Specialization / Domain</label>
            <select
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              disabled={availableDomains.length === 0}
              className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 hover:border-slate-500"
            >
              {availableDomains.length > 0 ? (
                availableDomains.map((d) => <option key={d} value={d}>{d}</option>)
              ) : (
                <option>N/A for this role</option>
              )}
            </select>
          </div>
        </div>
        
        {/* Interview Mode */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <label className="block text-sm font-medium text-slate-300 mb-2">Interview Mode</label>
            <div className="flex space-x-4 rounded-lg bg-slate-800 p-1">
                <button type="button" onClick={() => setMode(InterviewMode.TECHNICAL)} className={`w-full py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out transform ${mode === InterviewMode.TECHNICAL ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-300 hover:bg-slate-700 hover:-translate-y-0.5'}`}>
                    Technical
                </button>
                <button type="button" onClick={() => setMode(InterviewMode.BEHAVIORAL)} className={`w-full py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out transform ${mode === InterviewMode.BEHAVIORAL ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-300 hover:bg-slate-700 hover:-translate-y-0.5'}`}>
                    Behavioral
                </button>
            </div>
        </div>

        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          {/* Question Count */}
          <div>
            <label htmlFor="questionCount" className="block text-sm font-medium text-slate-300 mb-2">Number of Questions: <span className="font-bold text-cyan-400">{questionCount}</span></label>
            <input
              id="questionCount"
              type="range"
              min="1"
              max="5"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <Button type="submit" disabled={isLoading} fullWidth>
            {isLoading ? <Spinner /> : (
              <>
                Start Interview
                <ArrowRightIcon />
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SetupScreen;