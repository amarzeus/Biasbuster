import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceMetricsChartProps {
  performance: Record<string, {
    accuracy: number;
    precision: number;
    recall: number;
  }>;
}

const PerformanceMetricsChart: React.FC<PerformanceMetricsChartProps> = ({ performance }) => {
  const categories = Object.keys(performance);
  
  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Accuracy',
        data: categories.map(cat => performance[cat].accuracy),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
      {
        label: 'Precision',
        data: categories.map(cat => performance[cat].precision),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
      {
        label: 'Recall',
        data: categories.map(cat => performance[cat].recall),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance Metrics by Category',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            const percentage = (value * 100).toFixed(1);
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          callback: (value: number) => `${(value * 100).toFixed(0)}%`,
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar data={data} options={options} />
    </div>
  );
};

export default PerformanceMetricsChart; 