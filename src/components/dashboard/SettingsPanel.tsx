import React, { useState } from 'react';

interface SettingsPanelProps {
  onClose: () => void;
  onSave: (settings: DashboardSettings) => void;
  initialSettings: DashboardSettings;
}

export interface DashboardSettings {
  theme: 'light' | 'dark' | 'system';
  refreshInterval: number;
  defaultTimeRange: 'day' | 'week' | 'month' | 'year';
  defaultMetric: 'riskScore' | 'fairnessScore' | 'biasCount';
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
  display: {
    showTrends: boolean;
    showDistribution: boolean;
    showMetrics: boolean;
    showRecommendations: boolean;
  };
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onClose,
  onSave,
  initialSettings,
}) => {
  const [settings, setSettings] = useState<DashboardSettings>(initialSettings);

  const handleChange = (
    section: keyof DashboardSettings,
    key: string,
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Dashboard Settings
              </h2>
              <p className="text-sm text-gray-500">
                Configure your dashboard preferences
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

          <div className="space-y-6">
            {/* Theme Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {(['light', 'dark', 'system'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSettings(prev => ({ ...prev, theme }))}
                    className={`p-4 rounded-lg border ${
                      settings.theme === theme
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {theme}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Refresh Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Data Refresh</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="refreshInterval" className="block text-sm font-medium text-gray-700">
                    Refresh Interval (minutes)
                  </label>
                  <select
                    id="refreshInterval"
                    value={settings.refreshInterval}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      refreshInterval: Number(e.target.value),
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="1">1 minute</option>
                    <option value="5">5 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Default View Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Default View</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="defaultTimeRange" className="block text-sm font-medium text-gray-700">
                    Default Time Range
                  </label>
                  <select
                    id="defaultTimeRange"
                    value={settings.defaultTimeRange}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      defaultTimeRange: e.target.value as any,
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="day">Last 24 Hours</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="defaultMetric" className="block text-sm font-medium text-gray-700">
                    Default Metric
                  </label>
                  <select
                    id="defaultMetric"
                    value={settings.defaultMetric}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      defaultMetric: e.target.value as any,
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="riskScore">Risk Score</option>
                    <option value="fairnessScore">Fairness Score</option>
                    <option value="biasCount">Bias Count</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notificationsEnabled"
                    checked={settings.notifications.enabled}
                    onChange={(e) => handleChange('notifications', 'enabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notificationsEnabled" className="ml-2 block text-sm text-gray-900">
                    Enable Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notificationSound"
                    checked={settings.notifications.sound}
                    onChange={(e) => handleChange('notifications', 'sound', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notificationSound" className="ml-2 block text-sm text-gray-900">
                    Enable Sound
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="desktopNotifications"
                    checked={settings.notifications.desktop}
                    onChange={(e) => handleChange('notifications', 'desktop', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="desktopNotifications" className="ml-2 block text-sm text-gray-900">
                    Enable Desktop Notifications
                  </label>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Display Options</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showTrends"
                    checked={settings.display.showTrends}
                    onChange={(e) => handleChange('display', 'showTrends', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showTrends" className="ml-2 block text-sm text-gray-900">
                    Show Trends Chart
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showDistribution"
                    checked={settings.display.showDistribution}
                    onChange={(e) => handleChange('display', 'showDistribution', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showDistribution" className="ml-2 block text-sm text-gray-900">
                    Show Distribution Chart
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showMetrics"
                    checked={settings.display.showMetrics}
                    onChange={(e) => handleChange('display', 'showMetrics', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showMetrics" className="ml-2 block text-sm text-gray-900">
                    Show Performance Metrics
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showRecommendations"
                    checked={settings.display.showRecommendations}
                    onChange={(e) => handleChange('display', 'showRecommendations', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showRecommendations" className="ml-2 block text-sm text-gray-900">
                    Show Recommendations
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 