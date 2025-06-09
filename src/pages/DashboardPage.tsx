import React, { useState, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { exportToCSV, exportToJSON, exportToExcel } from '../utils/exportUtils';
import { mockFetchDashboardData } from '../services/mockData';
import { DashboardData, AuditEntry } from '../types/dashboard';
import BiasDistributionChart from '../components/dashboard/BiasDistributionChart';
import PerformanceMetricsChart from '../components/dashboard/PerformanceMetricsChart';
import DataFilter from '../components/dashboard/DataFilter';
import RefreshButton from '../components/dashboard/RefreshButton';
import SearchBar from '../components/dashboard/SearchBar';
import TrendAnalysisChart from '../components/dashboard/TrendAnalysisChart';
import AuditDetailsPanel from '../components/dashboard/AuditDetailsPanel';
import NotificationSystem from '../components/dashboard/NotificationSystem';
import DataComparisonPanel from '../components/dashboard/DataComparisonPanel';
import SettingsPanel, { DashboardSettings } from '../components/dashboard/SettingsPanel';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DEFAULT_SETTINGS: DashboardSettings = {
  theme: 'light',
  refreshInterval: 5,
  defaultTimeRange: 'week',
  defaultMetric: 'riskScore',
  notifications: {
    enabled: true,
    sound: true,
    desktop: false,
  },
  display: {
    showTrends: true,
    showDistribution: true,
    showMetrics: true,
    showRecommendations: true,
  },
};

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [filteredData, setFilteredData] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<AuditEntry | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'riskScore' | 'fairnessScore' | 'biasCount'>('riskScore');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const { notifications, addNotification, removeNotification } = useNotifications();
  const [showSettings, setShowSettings] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [settings, setSettings] = useState<DashboardSettings>(() => {
    const saved = localStorage.getItem('dashboardSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboardSettings', JSON.stringify(settings));
  }, [settings]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await mockFetchDashboardData();
      setDashboardData(data);
      setFilteredData(data.auditHistory);
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        message: 'Dashboard data loaded successfully',
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: 'Failed to load dashboard data',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const handleFilterChange = (filters: {
    dateRange: { start: Date; end: Date };
    riskLevels: string[];
    categories: string[];
  }) => {
    if (!dashboardData) return;

    const filtered = dashboardData.auditHistory.filter((entry) => {
      const dateInRange =
        entry.timestamp >= filters.dateRange.start &&
        entry.timestamp <= filters.dateRange.end;

      const riskLevelMatch =
        filters.riskLevels.length === 0 ||
        filters.riskLevels.includes(entry.riskLevel);

      const categoryMatch =
        filters.categories.length === 0 ||
        filters.categories.includes(entry.category);

      return dateInRange && riskLevelMatch && categoryMatch;
    });

    setFilteredData(filtered);
    addNotification({
      id: Date.now().toString(),
      type: 'info',
      message: `Filtered ${filtered.length} audit entries`,
    });
  };

  const handleSearch = (results: AuditEntry[]) => {
    setFilteredData(results);
    addNotification({
      id: Date.now().toString(),
      type: 'info',
      message: `Found ${results.length} matching entries`,
    });
  };

  const handleExport = (format: 'csv' | 'json' | 'excel') => {
    if (!filteredData.length) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: 'No data to export',
      });
      return;
    }

    try {
      switch (format) {
        case 'csv':
          exportToCSV(filteredData, 'audit-data');
          break;
        case 'json':
          exportToJSON(filteredData, 'audit-data');
          break;
        case 'excel':
          exportToExcel(filteredData, 'audit-data');
          break;
      }
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        message: `Data exported successfully in ${format.toUpperCase()} format`,
      });
    } catch (err) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: `Failed to export data in ${format.toUpperCase()} format`,
      });
    }
  };

  const handleDownloadReport = async () => {
    const input = document.getElementById('dashboard-report');
    if (!input) return;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('transparency-report.pdf');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5', fontFamily: 'Roboto, sans-serif' }}>
      <NotificationSystem
        notifications={notifications}
        onRemove={removeNotification}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="dashboard-report">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#2A5C8A', fontFamily: 'Roboto, sans-serif' }}>Bias Audit Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowComparison(true)}
              className="px-4 py-2 rounded text-white" style={{ backgroundColor: '#2EC4B6' }}
              aria-label="Compare Data"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowComparison(true);
                }
              }}
            >
              Compare Data
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 rounded text-white" style={{ backgroundColor: '#2A5C8A' }}
              aria-label="Dashboard Settings"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowSettings(true);
                }
              }}
            >
              Settings
            </button>
            <RefreshButton
              onRefresh={handleRefresh}
              isLoading={isRefreshing}
              aria-label="Refresh Dashboard"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('csv')}
                className="px-4 py-2 rounded text-white" style={{ backgroundColor: '#2EC4B6' }}
                aria-label="Export CSV"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleExport('csv');
                  }
                }}
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                className="px-4 py-2 rounded text-white" style={{ backgroundColor: '#2A5C8A' }}
                aria-label="Export JSON"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleExport('json');
                  }
                }}
              >
                Export JSON
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="px-4 py-2 rounded text-white" style={{ backgroundColor: '#2EC4B6' }}
                aria-label="Export Excel"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleExport('excel');
                  }
                }}
              >
                Export Excel
              </button>
              <button
                onClick={handleDownloadReport}
                className="px-4 py-2 rounded text-white" style={{ backgroundColor: '#FFD700' }}
                aria-label="Download Transparency Report"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleDownloadReport();
                  }
                }}
              >
                Download Transparency Report
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {settings.display.showTrends && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Trend Analysis</h2>
                  <div className="flex space-x-4">
                    <select
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value as any)}
                      className="rounded border-gray-300"
                    >
                      <option value="riskScore">Risk Score</option>
                      <option value="fairnessScore">Fairness Score</option>
                      <option value="biasCount">Bias Count</option>
                    </select>
                    <select
                      value={selectedTimeRange}
                      onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                      className="rounded border-gray-300"
                    >
                      <option value="day">Last 24 Hours</option>
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                      <option value="year">Last Year</option>
                    </select>
                  </div>
                </div>
                <TrendAnalysisChart
                  data={filteredData}
                  metric={selectedMetric}
                  timeRange={selectedTimeRange}
                />
              </div>
            )}
          </div>

          <div>
            {settings.display.showDistribution && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Bias Distribution</h2>
                <BiasDistributionChart data={dashboardData.biasDistribution} />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {settings.display.showMetrics && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
              <PerformanceMetricsChart data={dashboardData.performanceMetrics} />
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Filter</h2>
            <DataFilter
              onFilterChange={handleFilterChange}
              initialFilters={{
                dateRange: {
                  start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                  end: new Date(),
                },
                riskLevels: [],
                categories: [],
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Audit History</h2>
              <SearchBar
                data={dashboardData.auditHistory}
                onSearch={handleSearch}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" aria-label="Timestamp">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" aria-label="Category">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" aria-label="Risk Level">Risk Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" aria-label="Risk Score">Risk Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" aria-label="Fairness Score">Fairness Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" aria-label="Bias Count">Bias Count</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" aria-label="Actions">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50" aria-label={`Audit entry for ${entry.category} with risk level ${entry.riskLevel}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(entry.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{entry.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          entry.riskLevel === 'high'
                            ? 'bg-red-100 text-red-800'
                            : entry.riskLevel === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {entry.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(entry.riskScore * 100).toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(entry.fairnessScore * 100).toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.biasCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedAudit(entry)}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label={`View details for audit entry ${entry.id}`}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setSelectedAudit(entry);
                            }
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedAudit && (
        <AuditDetailsPanel
          audit={selectedAudit}
          onClose={() => setSelectedAudit(null)}
        />
      )}
      {showComparison && (
        <DataComparisonPanel
          data={dashboardData.auditHistory}
          onClose={() => setShowComparison(false)}
        />
      )}
      {showSettings && (
        <SettingsPanel
          initialSettings={settings}
          onClose={() => setShowSettings(false)}
          onSave={setSettings}
        />
      )}
    </div>
  );
};

export default DashboardPage; 