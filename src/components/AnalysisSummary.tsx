import React from 'react';
import { BiasFinding } from '../types';

interface AnalysisSummaryProps {
  findings: BiasFinding[];
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ findings }) => {
  const totalFindings = findings.length;
  const biasTypes = [...new Set(findings.map(f => f.biasType))];

  return (
    <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
      <h4 className="font-medium text-neutral-800 dark:text-white mb-2">Analysis Summary</h4>
      <div className="text-sm text-neutral-600 dark:text-neutral-400">
        <p>Findings: {totalFindings}</p>
        <p>Bias Types: {biasTypes.join(', ')}</p>
      </div>
    </div>
  );
};

export default AnalysisSummary;
