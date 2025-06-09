import React from 'react';
import { AuditEntry } from '../../types/dashboard';

interface AuditDetailsPanelProps {
  audit: AuditEntry;
  onClose: () => void;
}

const AuditDetailsPanel: React.FC<AuditDetailsPanelProps> = ({ audit, onClose }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Audit Details
              </h2>
              <p className="text-sm text-gray-500">
                {formatDate(audit.timestamp)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overview Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{audit.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Risk Level</dt>
                  <dd className={`mt-1 text-sm font-medium ${getRiskLevelColor(audit.riskLevel)}`}>
                    {audit.riskLevel}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Risk Score</dt>
                  <dd className="mt-1 text-sm text-gray-900">{(audit.riskScore * 100).toFixed(1)}%</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fairness Score</dt>
                  <dd className="mt-1 text-sm text-gray-900">{(audit.fairnessScore * 100).toFixed(1)}%</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Bias Count</dt>
                  <dd className="mt-1 text-sm text-gray-900">{audit.biasCount}</dd>
                </div>
              </dl>
            </div>

            {/* Metrics Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Accuracy</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {(audit.details.metrics.accuracy * 100).toFixed(1)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">F1 Score</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {(audit.details.metrics.f1Score * 100).toFixed(1)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">False Positive Rate</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {(audit.details.metrics.falsePositiveRate * 100).toFixed(1)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">False Negative Rate</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {(audit.details.metrics.falseNegativeRate * 100).toFixed(1)}%
                  </dd>
                </div>
              </dl>
            </div>

            {/* Detected Biases Section */}
            <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Biases</h3>
              <div className="space-y-4">
                {audit.details.detectedBiases.map((bias, index) => (
                  <div key={index} className="border-l-4 border-yellow-400 pl-4">
                    <h4 className="text-sm font-medium text-gray-900 capitalize">{bias.type} Bias</h4>
                    <p className="mt-1 text-sm text-gray-600">{bias.description}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Impact: <span className="font-medium capitalize">{bias.impact}</span>
                      </span>
                      <span className="text-sm text-gray-500">
                        Confidence: <span className="font-medium">{(bias.confidence * 100).toFixed(1)}%</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {audit.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditDetailsPanel; 