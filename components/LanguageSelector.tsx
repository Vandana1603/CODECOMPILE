import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onSelectLanguage: (language: Language) => void;
}

const languages = [
    { id: Language.JavaScript, name: 'JavaScript', color: 'yellow' },
    { id: Language.Python, name: 'Python', color: 'blue' },
    { id: Language.Java, name: 'Java', color: 'red' },
    { id: Language.HTML, name: 'HTML', color: 'orange' },
    { id: Language.CSS, name: 'CSS', color: 'purple' },
    { id: Language.C, name: 'C', color: 'gray' },
    { id: Language.CPP, name: 'C++', color: 'indigo' },
    { id: Language.R, name: 'R', color: 'pink' },
]

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onSelectLanguage }) => {
  const colorVariants: { [key: string]: string } = {
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500',
  }
  
  return (
    <div className="flex flex-wrap gap-2 bg-gray-800 p-2 rounded-lg">
      {languages.map(lang => (
        <button
          key={lang.id}
          onClick={() => onSelectLanguage(lang.id)}
          className={`px-3 py-2 text-sm md:text-base font-semibold rounded-md transition-all duration-300 flex-grow
            ${selectedLanguage === lang.id 
                ? `${colorVariants[lang.color]} text-white shadow-lg` 
                : `bg-gray-700 text-gray-300 hover:bg-gray-600`
            }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;