
import React from 'react';
import { CompilationResult } from '../types';

interface OutputDisplayProps {
  result: CompilationResult | null;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 h-full shadow-lg">
        <h2 className="text-xl font-semibold mb-3 text-gray-400">Output</h2>
        <pre className="text-gray-500 whitespace-pre-wrap font-mono">
          Click "Run Code" to see the output here.
        </pre>
      </div>
    );
  }

  const isError = result.type === 'error';

  return (
    <div className={`bg-gray-800 rounded-lg p-4 h-full shadow-lg border-l-4 ${isError ? 'border-red-500' : 'border-green-500'}`}>
        <h2 className={`text-xl font-semibold mb-3 ${isError ? 'text-red-400' : 'text-green-400'}`}>
            {isError ? 'Error' : 'Success'}
        </h2>
        <pre className={`text-sm whitespace-pre-wrap font-mono ${isError ? 'text-red-300' : 'text-gray-200'}`}>
            {result.message}
        </pre>
    </div>
  );
};

export default OutputDisplay;
