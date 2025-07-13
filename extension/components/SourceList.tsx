
import React from 'react';
import { GroundingChunk } from '../types';
import { LinkIcon } from '../icons';

interface SourceListProps {
    sources: GroundingChunk[];
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
    const webSources = sources.filter(s => s.web?.uri);
    if (webSources.length === 0) return null;

    return (
        <div className="p-3">
            <h4 className="flex items-center font-semibold text-xs text-neutral-700 dark:text-neutral-300 mb-2">
                <LinkIcon className="h-3 w-3 mr-2" />
                Sources
            </h4>
            <ul className="text-xs space-y-1 max-h-24 overflow-y-auto pr-1">
                {webSources.map((source, index) => (
                    <li key={index} className="truncate">
                        <a href={source.web!.uri} target="_blank" rel="noopener noreferrer" className="text-trust-blue hover:underline dark:text-ai-teal flex items-start">
                            <span className="mr-2 mt-0.5">&#8226;</span>
                            <span className="flex-1" title={source.web!.title || source.web!.uri}>{source.web!.title || source.web!.uri}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SourceList;
