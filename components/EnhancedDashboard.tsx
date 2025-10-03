import React, { useState, useEffect } from 'react';
import { User } from '../types';
import TrendChart from './analytics/TrendChart';
import Heatmap from './analytics/Heatmap';
import PerformanceMetrics from './analytics/PerformanceMetrics';
import UserInsights from './analytics/UserInsights';
import { ChartBarIcon, UsersIcon, SparklesIcon, ServerCogIcon } from './icons/Icons';

interface EnhancedDashboardProps {
  currentUser: User;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'insights'>('overview');

  // Mock data - in real implementation, this would come from analytics service
  const trendData = [
    { date: '2024-01', biasCount: 45, accuracy: 87, userSatisfaction: 4.2 },
    { date: '2024-02', biasCount: 52, accuracy: 89, userSatisfaction: 4.3 },
    { date: '2024-03', biasCount: 38, accuracy: 91, userSatisfaction: 4.5 },
    { date: '2024-04', biasCount: 61, accuracy: 88, userSatisfaction: 4.1 },
    { date: '2024-05', biasCount: 49, accuracy: 92, userSatisfaction: 4.4 },
  ];

  const heatmapData = [
    {
      biasType: 'framing',
      frequency: 25,
      severity: 3.2,
      contexts: ['News articles', 'Social media', 'Political content']
    },
    {
      biasType: 'omission',
      frequency: 18,
      severity: 2.8,
      contexts: ['Research papers', 'Reports', 'Documentation']
    },
    {
      biasType: 'stereotyping',
      frequency: 32,
      severity: 4.1,
      contexts: ['Advertisements', 'Media content', 'Cultural references']
    },
    {
      biasType: 'confirmation_bias',
      frequency: 15,
      severity: 3.5,
      contexts: ['Personal opinions', 'Debates', 'Discussions']
    },
  ];

  const performanceData = [
    { metric: 'Response Time', value: 1.2, target: 2.0, unit: 's' },
    { metric: 'Accuracy', value: 91, target: 85, unit: '%' },
    { metric: 'User Satisfaction', value: 4.3, target: 4.0, unit: '/5' },
    { metric: 'Bias Detection Rate', value: 94, target: 90, unit: '%' },
    { metric: 'False Positive Rate', value: 3, target: 5, unit: '%' },
  ];

  const userInsights = [
    {
      id: '1',
      type: 'pattern' as const,
      title: 'Consistent Framing Bias Detection',
      description: 'You frequently identify framing bias in news content. Consider exploring advanced framing techniques.',
      impact: 'medium' as const,
      actionable: true,
    },
    {
      id: '2',
      type: 'improvement' as const,
      title: 'Accuracy Improvement',
      description: 'Your analysis accuracy has improved by 8% over the last month. Keep up the great work!',
      impact: 'low' as const,
      actionable: false,
    },
    {
      id: '3',
      type: 'achievement' as const,
      title: 'Bias Detection Milestone',
      description: 'Congratulations! You\'ve analyzed 500+ pieces of content and maintained high accuracy.',
      impact: 'low' as const,
      actionable: false,
    },
    {
      id: '4',
      type: 'recommendation' as const,
      title: 'Explore Collaborative Features',
      description: 'Try sharing your analyses in workspaces to collaborate with other users and learn from their insights.',
      impact: 'medium' as const,
      actionable: true,
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'analytics', label: 'Analytics', icon: SparklesIcon },
    { id: 'insights', label: 'Insights', icon: UsersIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Comprehensive insights into your bias detection patterns and performance
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-neutral-700 text-trust-blue dark:text-ai-teal shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TrendChart data={trendData} title="Bias Detection Trends" />
            <Heatmap data={heatmapData} title="Bias Pattern Heatmap" />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <PerformanceMetrics data={performanceData} title="Performance Metrics" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TrendChart data={trendData} title="Detailed Trends" />
              <Heatmap data={heatmapData} title="Pattern Analysis" />
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <UserInsights
            user={currentUser}
            insights={userInsights}
            title="Personalized Insights"
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-12 bg-gradient-to-r from-trust-blue to-ai-teal rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Ready to collaborate?</h3>
            <p className="text-blue-100 mb-4">
              Join workspaces to share analyses and learn from the community.
            </p>
            <button className="bg-white text-trust-blue px-6 py-2 rounded-lg font-medium hover:bg-neutral-50 transition-colors">
              Explore Workspaces
            </button>
          </div>
          <ServerCogIcon className="h-16 w-16 text-blue-200 opacity-50" />
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
