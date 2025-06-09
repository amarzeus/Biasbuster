import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { FairnessAuditResult, FairnessMetrics } from '../../services/fairnessAudit';
import BiasDistributionChart from './BiasDistributionChart';
import PerformanceMetricsChart from './PerformanceMetricsChart';
import AuditHistoryTable from './AuditHistoryTable';
import RiskLevelIndicator from './RiskLevelIndicator';
import RecommendationsList from './RecommendationsList';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const FairnessDashboard: React.FC = () => {
  const [latestAudit, setLatestAudit] = useState<FairnessAuditResult | null>(null);
  const [auditHistory, setAuditHistory] = useState<FairnessAuditResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [latestResponse, historyResponse] = await Promise.all([
          fetch('/api/fairness-audit/latest'),
          fetch('/api/fairness-audit/history')
        ]);

        if (!latestResponse.ok || !historyResponse.ok) {
          throw new Error('Failed to fetch audit data');
        }

        const latest = await latestResponse.json();
        const history = await historyResponse.json();

        setLatestAudit(latest);
        setAuditHistory(history);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!latestAudit) {
    return <div className="p-4">No audit data available</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Fairness & Bias Analytics Dashboard</h1>

      {/* Risk Level and Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <RiskLevelIndicator riskLevel={latestAudit.riskLevel} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Statistical Parity"
              value={latestAudit.metrics.statisticalParity}
              format="percentage"
            />
            <MetricCard
              title="Equal Opportunity"
              value={latestAudit.metrics.equalOpportunity}
              format="percentage"
            />
            <MetricCard
              title="Accuracy"
              value={latestAudit.metrics.accuracy}
              format="percentage"
            />
            <MetricCard
              title="F1 Score"
              value={latestAudit.metrics.f1Score}
              format="percentage"
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Bias Distribution</h2>
          <BiasDistributionChart distribution={latestAudit.biasDistribution} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Performance by Category</h2>
          <PerformanceMetricsChart performance={latestAudit.performanceByCategory} />
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
        <RecommendationsList recommendations={latestAudit.recommendations} />
      </div>

      {/* Audit History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Audit History</h2>
        <AuditHistoryTable history={auditHistory} />
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  format: 'percentage' | 'number';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, format }) => {
  const formattedValue = format === 'percentage' 
    ? `${(value * 100).toFixed(1)}%`
    : value.toFixed(2);

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-semibold mt-1">{formattedValue}</p>
    </div>
  );
};

export default FairnessDashboard; 