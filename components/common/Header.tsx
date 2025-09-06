
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="w-full max-w-4xl text-center">
            <div className="opacity-0 animate-fade-in-up">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    Interview Prep Bot
                </h1>
            </div>
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <p className="mt-3 text-lg text-slate-400">
                    Sharpen your skills with an AI-powered mock interviewer.
                </p>
            </div>
        </header>
    );
};

export default Header;