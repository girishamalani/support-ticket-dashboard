// components/Header.tsx
import React from 'react';
import { useDarkMode } from './DarkModeContext';
import './Header.css';

const Header = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="header">
      <h1>Support Ticket Dashboard</h1>
      <button onClick={toggleDarkMode} className="dark-toggle">
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </header>
  );
};

export default Header;
