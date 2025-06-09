import React, { useState, useEffect } from 'react';
import { AuditEntry } from '../../types/dashboard';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataComparisonPanelProps {
  data: AuditEntry[];
  onClose: () => void;
}

const DataComparisonPanel: React.FC<DataComparisonPanelProps> = ({ data, onClose }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [metric, setMetric] = useState<'riskScore' | 'fairnessScore' | 'biasCount'>('riskScore');
  const [comparisonData, setComparisonData] = useState<any>(null);

  useEffect(() => {
    const processData = () => {
      const now = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const filteredData = data.filter(entry => entry.timestamp >= startDate);
      const groupedData = groupDataByTimeRange(filteredData, timeRange);
      
      const labels = Object.keys(groupedData).sort();
      const currentPeriodData = labels.map(label => {
        const entries = groupedData[label];
        return calculateMetricAverage(entries, metric);
      });

      // Calculate previous period data
      const previousPeriodData = calculatePreviousPeriodData(data, timeRange, metric);

      setComparisonData({
        labels,
        datasets: [
          {
            label: 'Current Period',
            data: currentPeriodData,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.1,
          },
          {
            label: 'Previous Period',
            data: previousPeriodData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.1,
          },
        ],
      });
    };

    processData();
  }, [data, timeRange, metric]);

  const groupDataByTimeRange = (data: AuditEntry[], range: string) => {
    const grouped: { [key: string]: AuditEntry[] } = {};
    
    data.forEach(entry => {
      const date = new Date(entry.timestamp);
      let key: string;
      
      switch (range) {
        case 'week':
          key = date.toLocaleDateString('en-US', { weekday: 'short' });
          break;
        case 'month':
          key = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
          break;
        case 'quarter':
          key = date.toLocaleDateString('en-US', { month: 'short' });
          break;
        case 'year':
          key = date.toLocaleDateString('en-US', { month: 'short' });
          break;
        default:
          key = date.toLocaleDateString();
      }
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(entry);
    });
    
    return grouped;
  };

  const calculateMetricAverage = (entries: AuditEntry[], metric: string) => {
    if (entries.length === 0) return 0;
    
    const sum = entries.reduce((acc, entry) => {
      switch (metric) {
        case 'riskScore':
          return acc + entry.riskScore;
        case 'fairnessScore':
          return acc + entry.fairnessScore;
        case 'biasCount':
          return acc + entry.biasCount;
        default:
          return acc;
      }
    }, 0);
    
    return sum / entries.length;
  };

  const calculatePreviousPeriodData = (data: AuditEntry[], range: string, metric: string) => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;
    
    switch (range) {
      case 'week':
        startDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        endDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        endDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        endDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
        endDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        endDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filteredData = data.filter(entry => 
      entry.timestamp >= startDate && entry.timestamp <= endDate
    );
    
    const groupedData = groupDataByTimeRange(filteredData, range);
    const labels = Object.keys(groupedData).sort();
    
    return labels.map(label => {
      const entries = groupedData[label];
      return calculateMetricAverage(entries, metric);
    });
  };

  const getMetricLabel = () => {
    switch (metric) {
      case 'riskScore':
        return 'Risk Score';
      case 'fairnessScore':
        return 'Fairness Score';
      case 'biasCount':
        return 'Bias Count';
      default:
        return '';
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${getMetricLabel()} Comparison`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: metric === 'biasCount' ? undefined : 1,
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Data Comparison
              </h2>
              <p className="text-sm text-gray-500">
                Compare metrics across different time periods
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

          <div className="mb-6">
            <div className="flex space-x-4">
              <div>
                <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700">
                  Time Range
                </label>
                <select
                  id="timeRange"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
              </div>

              <div>
                <label htmlFor="metric" className="block text-sm font-medium text-gray-700">
                  Metric
                </label>
                <select
                  id="metric"
                  value={metric}
                  onChange={(e) => setMetric(e.target.value as any)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="riskScore">Risk Score</option>
                  <option value="fairnessScore">Fairness Score</option>
                  <option value="biasCount">Bias Count</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-96">
            {comparisonData && (
              <Line data={comparisonData} options={chartOptions} />
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500">Current Period</h4>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {comparisonData?.datasets[0].data.length > 0
                    ? (comparisonData.datasets[0].data.reduce((a: number, b: number) => a + b, 0) /
                        comparisonData.datasets[0].data.length).toFixed(2)
                    : '0.00'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500">Previous Period</h4>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {comparisonData?.datasets[1].data.length > 0
                    ? (comparisonData.datasets[1].data.reduce((a: number, b: number) => a + b, 0) /
                        comparisonData.datasets[1].data.length).toFixed(2)
                    : '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataComparisonPanel; 