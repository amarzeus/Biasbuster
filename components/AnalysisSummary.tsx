import React from 'react';
import { BiasFinding } from '../types';
import { ChartPieIcon } from './icons/Icons';

interface AnalysisSummaryProps {
    findings: BiasFinding[];
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ findings }) => {
    const count = findings.length;

    const score = {
        label: 'Low',
        color: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50',
    };

    if (count > 3 && count <= 6) {
        score.label = 'Moderate';
        score.color = 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50';
    } else if (count > 6) {
        score.label = 'High';
        score.color = 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50';
    }

    const typeCounts = findings.reduce((acc, finding) => {
        acc[finding.biasType] = (acc[finding.biasType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                    <h4 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Overall Bias Score</h4>
                    <p className={`text-2xl font-bold ${score.color.split(' ')[0]} ${score.color.split(' ')[1]}`}>{score.label}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{count} finding{count !== 1 ? 's' : ''} detected.</p>
                </div>
                <div className="sm:text-right">
                     <h4 className="flex items-center sm:justify-end text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                        <ChartPieIcon className="h-4 w-4 mr-1.5" />
                        Breakdown
                    </h4>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 sm:justify-end">
                        {Object.entries(typeCounts).map(([type, num]) => (
                            <span key={type} className="text-sm text-neutral-700 dark:text-neutral-200">
                                <span className="font-bold">{num}</span> {type}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisSummary;