
import React, { useState, useCallback, useEffect } from 'react';
import { Language, CompilationResult, Correction } from './types';
import { executeCode } from '../services/compilerService';
import { getCodeCorrection } from '../services/geminiService';
import Header from '../components/Header';
import Hero from '../components/Hero';
import LanguageSelector from '../components/LanguageSelector';
import CodeEditor from '../components/CodeEditor';
import OutputDisplay from '../components/OutputDisplay';
import AICorrector from '../components/AICorrector';
import { sampleCode } from './constants';

const App: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<CompilationResult | null>(null);
  const [correction, setCorrection] = useState<Correction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [heroVisible, setHeroVisible] = useState<boolean>(true);

  useEffect(() => {
    if (selectedLanguage) {
      setCode(sampleCode[selectedLanguage]);
      setOutput(null);
      setCorrection(null);
      setHeroVisible(false);
    } else {
        setHeroVisible(true);
    }
  }, [selectedLanguage]);

  const handleRunCode = useCallback(async () => {
    if (!selectedLanguage) return;

    setIsLoading(true);
    setIsAiLoading(false);
    setOutput(null);
    setCorrection(null);

    const result = executeCode(code, selectedLanguage);
    setOutput(result);

    if (result.type === 'error') {
      setIsAiLoading(true);
      try {
        const aiCorrection = await getCodeCorrection(selectedLanguage, code, result.message);
        setCorrection(aiCorrection);
      } catch (error) {
        console.error("AI correction failed:", error);
        setCorrection({
          correctedCode: "Error: AI correction service is unavailable.",
          explanation: "Could not connect to the AI service. Please check your connection and API key."
        });
      } finally {
        setIsAiLoading(false);
      }
    }
    setIsLoading(false);
  }, [code, selectedLanguage]);

  const handleSelectLanguage = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleBackToHome = () => {
      setSelectedLanguage(null);
  }

  const applyCorrection = (correctedCode: string) => {
    setCode(correctedCode);
    setCorrection(null);
    setOutput(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header onTitleClick={handleBackToHome} isHome={!selectedLanguage}/>
      {heroVisible ? (
        <Hero onLanguageSelect={handleSelectLanguage}/>
      ) : (
        <main className="p-4 md:p-6 lg:p-8 animate-fade-in">
          {selectedLanguage && (
            <div className="max-w-7xl mx-auto">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onSelectLanguage={handleSelectLanguage}
              />
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-cyan-400">Code Editor</h2>
                  <CodeEditor language={selectedLanguage} value={code} onChange={setCode} />
                  <button
                    onClick={handleRunCode}
                    disabled={isLoading}
                    className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                  >
                    {isLoading ? (
                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                    Run Code
                  </button>
                </div>
                <div className="flex flex-col space-y-6">
                    <OutputDisplay result={output} />
                    {(isAiLoading || correction) && (
                      <AICorrector 
                        correction={correction} 
                        isLoading={isAiLoading} 
                        onApplyCorrection={applyCorrection}
                      />
                    )}
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default App;
