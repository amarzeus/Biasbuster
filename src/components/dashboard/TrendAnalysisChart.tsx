import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { AuditEntry } from '../../types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TrendAnalysisChartProps {
  data: AuditEntry[];
  metric: 'riskScore' | 'fairnessScore' | 'biasCount';
  timeRange: 'day' | 'week' | 'month' | 'year';
}

const TrendAnalysisChart: React.FC<TrendAnalysisChartProps> = ({ data, metric, timeRange }) => {
  const getTimeLabel = (date: Date): string => {
    switch (timeRange) {
      case 'day':
        return date.toLocaleTimeString();
      case 'week':
        return date.toLocaleDateString();
      case 'month':
        return date.toLocaleDateString();
      case 'year':
        return date.toLocaleDateString();
      default:
        return date.toLocaleDateString();
    }
  };

  const getMetricLabel = (): string => {
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

  const getMetricValue = (entry: AuditEntry): number => {
    switch (metric) {
      case 'riskScore':
        return entry.riskScore;
      case 'fairnessScore':
        return entry.fairnessScore;
      case 'biasCount':
        return entry.biasCount;
      default:
        return 0;
    }
  };

  const chartData = {
    labels: data.map((entry) => getTimeLabel(entry.timestamp)),
    datasets: [
      {
        label: getMetricLabel(),
        data: data.map((entry) => getMetricValue(entry)),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${getMetricLabel()} Trend Analysis`,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return `${getMetricLabel()}: ${value.toFixed(2)}`;
          },
        },
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
    <div className="h-80">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TrendAnalysisChart; 