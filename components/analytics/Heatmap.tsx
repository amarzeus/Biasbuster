import React from 'react';

interface HeatmapData {
  biasType: string;
  frequency: number;
  severity: number;
  contexts: string[];
}

interface HeatmapProps {
  data: HeatmapData[];
  title?: string;
}

const Heatmap: React.FC<HeatmapProps> = ({ data, title = "Bias Pattern Heatmap" }) => {
  const maxFrequency = Math.max(...data.map(d => d.frequency));
  const maxSeverity = Math.max(...data.map(d => d.severity));

  const getIntensity = (frequency: number, severity: number) => {
    const freqIntensity = frequency / maxFrequency;
    const sevIntensity = severity / maxSeverity;
    const combined = (freqIntensity + sevIntensity) / 2;
    return Math.min(combined, 1);
  };

  const getColor = (intensity: number) => {
    if (intensity < 0.2) return 'bg-green-100 dark:bg-green-900';
    if (intensity < 0.4) return 'bg-yellow-100 dark:bg-yellow-900';
    if (intensity < 0.6) return 'bg-orange-100 dark:bg-orange-900';
    if (intensity < 0.8) return 'bg-red-100 dark:bg-red-900';
    return 'bg-red-200 dark:bg-red-800';
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
      <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">{title}</h3>

      <div className="grid grid-cols-1 gap-3">
        {data.map((item, index) => {
          const intensity = getIntensity(item.frequency, item.severity);
          const colorClass = getColor(intensity);

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${colorClass} border-neutral-300 dark:border-neutral-600`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-neutral-800 dark:text-white capitalize">
                  {item.biasType.replace(/_/g, ' ')}
                </h4>
                <div className="text-right text-sm">
                  <div className="text-neutral-600 dark:text-neutral-400">
                    Frequency: {item.frequency}
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    Severity: {item.severity.toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div
                    className="bg-trust-blue dark:bg-ai-teal h-2 rounded-full transition-all duration-300"
                    style={{ width: `${intensity * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {(intensity * 100).toFixed(0)}%
                </span>
              </div>

              {item.contexts.length > 0 && (
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  <span className="font-medium">Common contexts:</span>{' '}
                  {item.contexts.slice(0, 3).join(', ')}
                  {item.contexts.length > 3 && ` +${item.contexts.length - 3} more`}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center">
        <div className="flex items-center space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded mr-2"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900 rounded mr-2"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-100 dark:bg-orange-900 rounded mr-2"></div>
            <span>High</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-200 dark:bg-red-800 rounded mr-2"></div>
            <span>Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
