import React from 'react';

interface RiskLevelIndicatorProps {
  riskLevel: 'low' | 'medium' | 'high';
  score: number;
}

const RiskLevelIndicator: React.FC<RiskLevelIndicatorProps> = ({ riskLevel, score }) => {
  const getRiskLevelColor = () => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskLevelText = () => {
    switch (riskLevel) {
      case 'low':
        return 'Low Risk';
      case 'medium':
        return 'Medium Risk';
      case 'high':
        return 'High Risk';
      default:
        return 'Unknown Risk';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Risk Level</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getRiskLevelColor()}`}>
          {getRiskLevelText()}
        </span>
      </div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block text-gray-600">
              Risk Score
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-gray-600">
              {(score * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${score * 100}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getRiskLevelColor()}`}
          />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          {riskLevel === 'low' && 'The current bias levels are within acceptable ranges.'}
          {riskLevel === 'medium' && 'Some bias concerns have been detected. Review recommended.'}
          {riskLevel === 'high' && 'Significant bias issues detected. Immediate action required.'}
        </p>
      </div>
    </div>
  );
};

export default RiskLevelIndicator; 