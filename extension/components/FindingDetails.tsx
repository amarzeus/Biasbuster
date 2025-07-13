
import React from 'react';
import { BiasFinding } from '../types';
import { BookOpenIcon, InfoIcon } from '../icons';

interface FindingDetailsProps {
    finding: BiasFinding | null;
}

const FindingDetails: React.FC<FindingDetailsProps> = ({ finding }) => {
    if (!finding) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-4 h-full text-neutral-500 dark:text-neutral-400">
                <InfoIcon className="h-10 w-10 mb-3 text-trust-blue dark:text-ai-teal" />
                <p className="font-semibold text-sm">Click a finding</p>
                <p className="text-xs">Select a highlighted phrase on the left to see details.</p>
            </div>
        );
    }
    
    return (
        <div className="p-3">
            <h4 className="flex items-center font-bold text-base text-neutral-800 dark:text-neutral-100 mb-2">
                <BookOpenIcon className="h-4 w-4 mr-2 text-trust-blue dark:text-ai-teal"/>
                Finding Details
            </h4>
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-md p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-ai-teal mb-1">{finding.biasType}</p>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 mb-2">{finding.explanation}</p>
                <hr className="border-neutral-200 dark:border-neutral-700 my-2"/>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Suggested Revision:</p>
                <p className="text-xs font-medium text-neutral-800 dark:text-neutral-100 italic bg-neutral-200 dark:bg-neutral-700/50 p-2 rounded-md">"{finding.suggestion}"</p>
            </div>
        </div>
    );
};

export default FindingDetails;
