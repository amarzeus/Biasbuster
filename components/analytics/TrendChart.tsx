import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendData {
  date: string;
  biasCount: number;
  accuracy: number;
  userSatisfaction: number;
}

interface TrendChartProps {
  data: TrendData[];
  title?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({ data, title = "Bias Detection Trends" }) => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
      <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-300 dark:stroke-neutral-600" />
            <XAxis
              dataKey="date"
              className="text-neutral-600 dark:text-neutral-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              className="text-neutral-600 dark:text-neutral-400"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(255 255 255)',
                border: '1px solid rgb(229 231 235)',
                borderRadius: '0.5rem',
                color: 'rgb(31 41 55)'
              }}
              labelStyle={{ color: 'rgb(31 41 55)' }}
            />
            <Line
              type="monotone"
              dataKey="biasCount"
              stroke="#1e40af"
              strokeWidth={2}
              name="Bias Findings"
              dot={{ fill: '#1e40af', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#059669"
              strokeWidth={2}
              name="Accuracy (%)"
              dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="userSatisfaction"
              stroke="#dc2626"
              strokeWidth={2}
              name="User Satisfaction"
              dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center space-x-6 mt-4 text-sm text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-trust-blue rounded-full mr-2"></div>
          <span>Bias Findings</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
          <span>Accuracy</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
          <span>User Satisfaction</span>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
