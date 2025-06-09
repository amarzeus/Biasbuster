import React, { useState, useEffect } from 'react';
import { AuditEntry } from '../../types/dashboard';

interface SearchBarProps {
  data: AuditEntry[];
  onSearch: (results: AuditEntry[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ data, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'all' | 'category' | 'riskLevel' | 'description'>('all');

  useEffect(() => {
    const searchData = () => {
      if (!searchTerm.trim()) {
        onSearch(data);
        return;
      }

      const results = data.filter((entry) => {
        const searchTermLower = searchTerm.toLowerCase();
        
        switch (searchField) {
          case 'category':
            return entry.category.toLowerCase().includes(searchTermLower);
          case 'riskLevel':
            return entry.riskLevel.toLowerCase().includes(searchTermLower);
          case 'description':
            return entry.details.detectedBiases.some(bias => 
              bias.description.toLowerCase().includes(searchTermLower)
            );
          default:
            return (
              entry.category.toLowerCase().includes(searchTermLower) ||
              entry.riskLevel.toLowerCase().includes(searchTermLower) ||
              entry.details.detectedBiases.some(bias => 
                bias.description.toLowerCase().includes(searchTermLower)
              ) ||
              entry.recommendations.some(rec => 
                rec.toLowerCase().includes(searchTermLower)
              )
            );
        }
      });

      onSearch(results);
    };

    const debounceTimer = setTimeout(searchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchField, data, onSearch]);

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audits..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Fields</option>
          <option value="category">Category</option>
          <option value="riskLevel">Risk Level</option>
          <option value="description">Description</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar; 