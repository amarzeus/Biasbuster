import React from 'react';
import { MockAuditData } from '../../services/mockDataService';
import { exportToCSV, exportToJSON, downloadFile } from '../../utils/exportUtils';

interface ExportButtonProps {
  data: MockAuditData;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data }) => {
  const handleExport = (format: 'csv' | 'json') => {
    const content = format === 'csv' ? exportToCSV(data) : exportToJSON(data);
    const filename = `bias-audit-${new Date().toISOString().split('T')[0]}.${format}`;
    const type = format === 'csv' ? 'text/csv' : 'application/json';
    downloadFile(content, filename, type);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => handleExport('csv')}
      >
        <svg
          className="-ml-1 mr-2 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        Export
      </button>
      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
        <div className="py-1" role="menu" aria-orientation="vertical">
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleExport('csv')}
          >
            Export as CSV
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleExport('json')}
          >
            Export as JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportButton; 