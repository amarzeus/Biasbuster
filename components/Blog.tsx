import React from 'react';
import { blogPosts } from '../data/blogData';
import { BlogPost } from '../types';
import { RssIcon } from './icons/Icons';

interface BlogProps {
    onPostSelect: (post: BlogPost) => void;
}

const BlogCard: React.FC<{ post: BlogPost; onSelect: () => void; }> = ({ post, onSelect }) => (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden flex flex-col group border border-neutral-200 dark:border-neutral-700 h-full">
        <div className="overflow-hidden">
             <img src={post.image} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{post.date} &bull; by {post.author}</p>
            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mt-2 mb-2 flex-grow">{post.title}</h3>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">{post.summary}</p>
            <button onClick={onSelect} className="mt-auto font-semibold text-trust-blue dark:text-ai-teal hover:underline self-start">
                Read More &rarr;
            </button>
        </div>
    </div>
);


const Blog: React.FC<BlogProps> = ({ onPostSelect }) => {
    return (
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-trust-blue/10 dark:bg-ai-teal/20 text-trust-blue dark:text-ai-teal mb-4">
                    <RssIcon className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-neutral-800 dark:text-white md:text-4xl">
                    From the Blog
                </h2>
                <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                    Explore our latest research, case studies, and thoughts on AI, ethics, and media literacy.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map(post => (
                    <BlogCard key={post.id} post={post} onSelect={() => onPostSelect(post)} />
                ))}
            </div>
        </div>
    );
};

export default Blog;