
import React from 'react';
import { GroundingChunk } from '../types';
import { LinkIcon } from './icons/Icons';

const SourceList: React.FC<{ sources: GroundingChunk[] }> = ({ sources }) => {
    const webSources = sources.filter(s => s.web?.uri);

    if (webSources.length === 0) {
        return null;
    }

    return (
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
            <h4 className="flex items-center font-semibold text-sm text-neutral-600 dark:text-neutral-300 mb-2">
                <LinkIcon className="h-4 w-4 mr-2" />
                Sources from Google Search
            </h4>
            <ul className="text-xs space-y-1.5 pl-2">
                {webSources.map((source, index) => (
                    <li key={index} className="truncate">
                        <a href={source.web!.uri} target="_blank" rel="noopener noreferrer" className="text-trust-blue hover:underline dark:text-ai-teal flex items-start">
                            <span className="mr-2 mt-0.5">&#8226;</span>
                            <span className="flex-1">{source.web!.title || source.web!.uri}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SourceList;
