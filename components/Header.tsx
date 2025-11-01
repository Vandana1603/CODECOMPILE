import React from 'react';

interface HeaderProps {
    onTitleClick: () => void;
    isHome: boolean;
}

const Header: React.FC<HeaderProps> = ({ onTitleClick, isHome }) => {
  return (
    <header className="py-4 px-4 md:px-8 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <h1 
            className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500 ${!isHome && 'cursor-pointer'}`}
            onClick={isHome ? undefined : onTitleClick}
        >
          CODECOMPILE
        </h1>
      </div>
    </header>
  );
};

export default Header;