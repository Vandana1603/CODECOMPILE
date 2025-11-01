
import React from 'react';
import { Correction } from '../types';

interface AICorrectorProps {
  correction: Correction | null;
  isLoading: boolean;
  onApplyCorrection: (correctedCode: string) => void;
}

const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="mt-4 h-24 bg-gray-700 rounded"></div>
        <div className="h-10 bg-gray-700 rounded w-1/4"></div>
    </div>
);

const AICorrector: React.FC<AICorrectorProps> = ({ correction, isLoading, onApplyCorrection }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg border-l-4 border-cyan-500">
        <h2 className="text-xl font-semibold mb-3 text-cyan-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Correction
        </h2>
        {isLoading ? (
            <LoadingSkeleton />
        ) : correction ? (
            <div>
                <p className="text-gray-300 mb-4">{correction.explanation}</p>
                <div className="bg-gray-900 rounded-md p-3 mb-4">
                    <pre className="text-sm whitespace-pre-wrap font-mono text-green-300">
                        <code>
                            {correction.correctedCode}
                        </code>
                    </pre>
                </div>
                <button
                    onClick={() => onApplyCorrection(correction.correctedCode)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                    Apply Fix
                </button>
            </div>
        ) : null}
    </div>
  );
};

export default AICorrector;
