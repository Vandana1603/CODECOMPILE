
import React, { useState } from 'react';
import { Language } from '../types';

interface CodeEditorProps {
  language: Language;
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // You could add user-facing error feedback here if desired
    }
  };

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden h-96 shadow-lg">
       <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 flex items-center"
        aria-label="Copy code to clipboard"
      >
        {isCopied ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Code
          </>
        )}
      </button>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full p-4 bg-transparent text-gray-200 font-mono resize-none focus:outline-none placeholder-gray-500"
        placeholder={`// Write your ${language} code here...`}
        spellCheck="false"
      />
    </div>
  );
};

export default CodeEditor;
