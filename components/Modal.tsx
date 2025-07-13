import React, { useEffect, useRef } from 'react';
import { XIcon, FileTextIcon } from './icons/Icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        const focusableElementsString = 'a[href], button:not([disabled]), textarea, input, select';
        
        const handleFocusTrap = (event: KeyboardEvent) => {
            if (event.key === 'Tab' && modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(focusableElementsString);
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        event.preventDefault();
                    }
                }
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keydown', handleFocusTrap);
            modalRef.current?.querySelector<HTMLElement>(focusableElementsString)?.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keydown', handleFocusTrap);
        };
    }, [isOpen, onClose]);


    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                ref={modalRef}
                className="relative bg-white dark:bg-neutral-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col m-4 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 id="modal-title" className="text-lg font-bold text-neutral-800 dark:text-neutral-100 flex items-center">
                        <FileTextIcon className="h-5 w-5 mr-3 text-trust-blue dark:text-ai-teal" />
                        {title}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors"
                        aria-label="Close modal"
                    >
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto prose prose-neutral dark:prose-invert max-w-none">
                   {children}
                </div>
                 <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 text-right">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-trust-blue hover:bg-trust-blue-light dark:bg-ai-teal dark:hover:bg-ai-teal-light text-white font-semibold rounded-md shadow-sm transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translate3d(0, 1rem, 0) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Modal;