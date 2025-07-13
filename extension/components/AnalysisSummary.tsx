
import React from 'react';
import { BiasFinding } from '../types';
import { ChartPieIcon } from '../icons';

interface AnalysisSummaryProps {
    findings: BiasFinding[];
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ findings }) => {
    const count = findings.length;

    const score = {
        label: 'Low',
        color: 'text-green-600 dark:text-green-400',
    };

    if (count > 3 && count <= 6) {
        score.label = 'Moderate';
        score.color = 'text-yellow-600 dark:text-yellow-400';
    } else if (count > 6) {
        score.label = 'High';
        score.color = 'text-red-600 dark:text-red-400';
    }

    const typeCounts = findings.reduce((acc, finding) => {
        acc[finding.biasType] = (acc[finding.biasType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Overall Score</h4>
                    <p className={`text-xl font-bold ${score.color}`}>{score.label}</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300">{count} finding{count !== 1 ? 's' : ''}</p>
                </div>
                <div className="text-right pl-2">
                     <h4 className="flex items-center justify-end text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                        <ChartPieIcon className="h-4 w-4 mr-1" />
                        Breakdown
                    </h4>
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 justify-end">
                        {Object.keys(typeCounts).length > 0 ? (
                            Object.entries(typeCounts).map(([type, num]) => (
                                <span key={type} className="text-xs text-neutral-700 dark:text-neutral-200">
                                    <span className="font-bold">{num}</span> {type}
                                </span>
                            ))
                        ) : (
                             <span className="text-xs text-neutral-700 dark:text-neutral-200">None</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisSummary;
