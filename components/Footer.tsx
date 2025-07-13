import React from 'react';
import { HeartIcon, CoffeeIcon, MailIcon, GithubIcon, LinkedinIcon } from './icons/Icons';

interface FooterProps {
    openModal: (modal: 'privacy' | 'terms' | 'accessibility') => void;
}

const Footer: React.FC<FooterProps> = ({ openModal }) => {
  return (
    <footer className="bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 py-6 text-center">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center space-x-4 mb-4">
            <a href="https://github.com/amarzeus/" target="_blank" rel="noopener noreferrer" className="hover:text-trust-blue dark:hover:text-ai-teal transition-colors"><GithubIcon className="h-6 w-6" /></a>
            <a href="https://www.linkedin.com/in/amarmahakal/" target="_blank" rel="noopener noreferrer" className="hover:text-trust-blue dark:hover:text-ai-teal transition-colors"><LinkedinIcon className="h-6 w-6" /></a>
            <a href="https://buymeacoffee.com/amarmahakal" target="_blank" rel="noopener noreferrer" className="hover:text-trust-blue dark:hover:text-ai-teal transition-colors"><CoffeeIcon className="h-6 w-6" /></a>
            <a href="mailto:amarmahakal92@gmail.com" className="hover:text-trust-blue dark:hover:text-ai-teal transition-colors"><MailIcon className="h-6 w-6" /></a>
        </div>
        <div className="text-sm space-x-4 my-4">
            <button onClick={() => openModal('privacy')} className="hover:text-trust-blue dark:hover:text-ai-teal transition-colors">Privacy Policy</button>
            <span>&bull;</span>
            <button onClick={() => openModal('terms')} className="hover:text-trust-blue dark:hover:text-ai-teal transition-colors">Terms of Service</button>
             <span>&bull;</span>
            <button onClick={() => openModal('accessibility')} className="hover:text-trust-blue dark:hover:text-ai-teal transition-colors">Accessibility</button>
        </div>
        <p className="flex justify-center items-center">
          Made with <HeartIcon className="h-5 w-5 mx-1 text-red-500" /> by Amar
        </p>
        <p className="text-sm mt-2">Biasbuster © {new Date().getFullYear()}. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;