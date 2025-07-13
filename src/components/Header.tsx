
import React, { useState } from 'react';
import { SunIcon, MoonIcon, ShieldCheckIcon, MenuIcon, XIcon } from './icons/Icons';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: '#analyser', label: 'Analyser' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#extension', label: 'Extension' },
    { href: '#dashboard', label: 'Dashboard' },
    { href: '#education', label: 'Education' },
    { href: '#about', label: 'About' },
    { href: '#transparency', label: 'Transparency' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#knowledge-base', label: 'Knowledge Base' },
    { href: '#blog', label: 'Blog' },
    { href: '#judges-corner', label: 'For Judges' },
  ];

  return (
    <header className="bg-white dark:bg-neutral-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#" className="flex items-center space-x-3 cursor-pointer" onClick={handleLinkClick}>
          <ShieldCheckIcon className="h-8 w-8 text-trust-blue" />
          <h1 className="text-2xl font-bold text-trust-blue dark:text-ai-teal-light">
            Biasbuster
          </h1>
        </a>
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="text-neutral-600 dark:text-neutral-300 hover:text-trust-blue dark:hover:text-ai-teal transition-colors font-medium">{link.label}</a>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
            <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                aria-label="Toggle dark mode"
            >
                {isDarkMode ? <SunIcon className="h-6 w-6 text-gold-accent" /> : <MoonIcon className="h-6 w-6 text-trust-blue" />}
            </button>
            <button 
                className="md:hidden p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle mobile menu"
                aria-expanded={isMenuOpen}
            >
                {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-neutral-800 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col p-4 space-y-2">
           {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={handleLinkClick} className="text-neutral-600 dark:text-neutral-300 hover:text-trust-blue dark:hover:text-ai-teal transition-colors font-medium p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700">{link.label}</a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
