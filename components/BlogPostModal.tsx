import React, { useEffect, useRef } from 'react';
import { BlogPost } from '../types';
import { XIcon, RssIcon } from './icons/Icons';

interface BlogPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: BlogPost | null;
}

const BlogPostModal: React.FC<BlogPostModalProps> = ({ isOpen, onClose, post }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Focus the modal container itself when it opens
            setTimeout(() => modalRef.current?.focus(), 0);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !post) return null;

    // A simple parser for the content
    const renderContent = (content: string) => {
        return content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-bold mt-6 mb-2">{paragraph.substring(4)}</h3>;
            }
            if (paragraph.startsWith('*   ')) {
                 const items = paragraph.split('\n').map((item, i) => <li key={i}>{item.substring(4)}</li>);
                 return <ul key={index} className="list-disc list-inside space-y-2 my-4">{items}</ul>
            }
            return <p key={index}>{paragraph}</p>;
        });
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="blog-post-title"
        >
            <div
                ref={modalRef}
                tabIndex={-1} // Make the div focusable
                className="relative bg-white dark:bg-neutral-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col m-4 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 p-4 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700">
                     <h2 id="blog-post-title" className="text-lg font-bold text-neutral-800 dark:text-neutral-100 flex items-center">
                        <RssIcon className="h-5 w-5 mr-3 text-trust-blue dark:text-ai-teal" />
                        From the Blog
                    </h2>
                     <button 
                        onClick={onClose} 
                        className="p-2 rounded-full text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        aria-label="Close post"
                    >
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto">
                    <img src={post.image} alt={post.title} className="w-full h-64 object-cover" />
                    <div className="p-8">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-3">{post.title}</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                            By {post.author} on {post.date}
                        </p>
                        <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
                            {renderContent(post.content)}
                        </div>
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translate3d(0, 1rem, 0) scale(0.95); }
                    to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default BlogPostModal;