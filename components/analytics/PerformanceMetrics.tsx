import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PerformanceData {
  metric: string;
  value: number;
  target: number;
  unit: string;
}

interface PerformanceMetricsProps {
  data: PerformanceData[];
  title?: string;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  data,
  title = "Performance Metrics"
}) => {
  const chartData = data.map(item => ({
    name: item.metric,
    value: item.value,
    target: item.target,
    fill: item.value >= item.target ? '#059669' : '#dc2626'
  }));

  const pieData = [
    { name: 'Above Target', value: data.filter(d => d.value >= d.target).length, color: '#059669' },
    { name: 'Below Target', value: data.filter(d => d.value < d.target).length, color: '#dc2626' }
  ];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
      <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">{title}</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div>
          <h4 className="text-md font-medium text-neutral-700 dark:text-neutral-300 mb-3">Metrics Overview</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-300 dark:stroke-neutral-600" />
                <XAxis
                  dataKey="name"
                  className="text-neutral-600 dark:text-neutral-400"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
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
                  formatter={(value: number, name: string) => [
                    `${value}${data.find(d => d.metric === name)?.unit || ''}`,
                    name === 'value' ? 'Current' : 'Target'
                  ]}
                />
                <Bar dataKey="value" fill="#1e40af" name="value" />
                <Bar dataKey="target" fill="#e5e7eb" name="target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div>
          <h4 className="text-md font-medium text-neutral-700 dark:text-neutral-300 mb-3">Target Achievement</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(255 255 255)',
                    border: '1px solid rgb(229 231 235)',
                    borderRadius: '0.5rem',
                    color: 'rgb(31 41 55)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
              <span className="text-neutral-600 dark:text-neutral-400">
                Above Target: {pieData[0].value}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
              <span className="text-neutral-600 dark:text-neutral-400">
                Below Target: {pieData[1].value}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="mt-6">
        <h4 className="text-md font-medium text-neutral-700 dark:text-neutral-300 mb-3">Detailed Metrics</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <thead className="bg-neutral-50 dark:bg-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Current
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">
                    {item.metric}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                    {item.value}{item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                    {item.target}{item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.value >= item.target
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {item.value >= item.target ? '✓ On Target' : '⚠ Below Target'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
