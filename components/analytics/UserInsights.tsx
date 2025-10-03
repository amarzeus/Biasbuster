import React from 'react';
import { User } from '../../types';
import { ChartBarIcon, UsersIcon, ClockIcon, TargetIcon } from '../icons/Icons';

interface UserInsight {
  id: string;
  type: 'pattern' | 'improvement' | 'achievement' | 'recommendation';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
}

interface UserInsightsProps {
  user: User;
  insights: UserInsight[];
  title?: string;
}

const UserInsights: React.FC<UserInsightsProps> = ({
  user,
  insights,
  title = "Personalized Insights"
}) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern':
        return <ChartBarIcon className="h-5 w-5" />;
      case 'improvement':
        return <TargetIcon className="h-5 w-5" />;
      case 'achievement':
        return <UsersIcon className="h-5 w-5" />;
      case 'recommendation':
        return <ClockIcon className="h-5 w-5" />;
      default:
        return <ChartBarIcon className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900';
      case 'improvement':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
      case 'achievement':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900';
      case 'recommendation':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900';
      default:
        return 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-neutral-600 dark:text-neutral-400';
    }
  };

  const highImpactInsights = insights.filter(i => i.impact === 'high');
  const actionableInsights = insights.filter(i => i.actionable);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">{title}</h3>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          Welcome back, {user.name}!
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
          <div className="text-2xl font-bold text-trust-blue dark:text-ai-teal">
            {insights.length}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Insights</div>
        </div>
        <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {highImpactInsights.length}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">High Impact</div>
        </div>
        <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {actionableInsights.length}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">Actionable</div>
        </div>
        <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {insights.filter(i => i.type === 'achievement').length}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">Achievements</div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="flex items-start space-x-4 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
              {getInsightIcon(insight.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-neutral-800 dark:text-white">
                  {insight.title}
                </h4>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    insight.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {insight.impact} impact
                  </span>
                  {insight.actionable && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                      Actionable
                    </span>
                  )}
                </div>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                {insight.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {insights.length === 0 && (
        <div className="text-center py-8">
          <ChartBarIcon className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
          <p className="text-neutral-500 dark:text-neutral-400">
            Analyzing your usage patterns to provide personalized insights...
          </p>
        </div>
      )}
    </div>
  );
};

export default UserInsights;
