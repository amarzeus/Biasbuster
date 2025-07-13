import React, { useMemo } from 'react';
import { HistoryItem } from '../types';
import { ChartBarIcon, CalculatorIcon, TargetIcon, DownloadIcon } from './icons/Icons';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md flex items-center space-x-4 border border-neutral-200 dark:border-neutral-700">
        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-trust-blue/10 dark:bg-ai-teal/20 text-trust-blue dark:text-ai-teal">
            {icon}
        </div>
        <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{label}</p>
            <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{value}</p>
        </div>
    </div>
);

interface DashboardProps {
    history: HistoryItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ history }) => {
    const { totalAnalyses, avgFindings, feedbackAccuracy, biasTypeBreakdown, totalFeedbackCount } = useMemo(() => {
        const totalAnalyses = history.length;
        if (totalAnalyses === 0) {
            return { totalAnalyses: 0, avgFindings: 0, feedbackAccuracy: 0, biasTypeBreakdown: [], totalFeedbackCount: 0 };
        }

        const totalFindings = history.reduce((sum, item) => sum + (item.result?.findings?.length || 0), 0);
        const avgFindingsCalc = totalFindings > 0 ? totalFindings / totalAnalyses : 0;

        const allFeedback = history.flatMap(item => item.feedback ? Object.values(item.feedback) : []);
        const totalFeedbackCount = allFeedback.length;
        const upVotes = allFeedback.filter(vote => vote === 'up').length;
        const feedbackAccuracyCalc = totalFeedbackCount > 0 ? (upVotes / totalFeedbackCount) * 100 : 0;

        const breakdown = history
            .flatMap(item => item.result?.findings || [])
            .reduce((acc, finding) => {
                const type = finding.biasType || 'Uncategorized';
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        const biasTypeBreakdownCalc = Object.entries(breakdown)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        return { 
            totalAnalyses,
            avgFindings: avgFindingsCalc,
            feedbackAccuracy: feedbackAccuracyCalc,
            biasTypeBreakdown: biasTypeBreakdownCalc,
            totalFeedbackCount
        };
    }, [history]);

    const handleDownloadReport = () => {
        let reportContent = `Biasbuster - Personal Analytics Report\n`;
        reportContent += `Generated on: ${new Date().toLocaleString()}\n`;
        reportContent += `=======================================\n\n`;

        reportContent += `--- SUMMARY STATS ---\n`;
        reportContent += `Total Analyses Performed: ${totalAnalyses.toLocaleString()}\n`;
        reportContent += `Average Findings per Analysis: ${totalAnalyses > 0 ? avgFindings.toFixed(1) : '0.0'}\n`;
        reportContent += `Helpful Feedback Rate: ${totalFeedbackCount > 0 ? `${feedbackAccuracy.toFixed(0)}%` : 'N/A'}`;
        if (totalFeedbackCount > 0) {
            reportContent += ` (based on ${totalFeedbackCount} total vote${totalFeedbackCount !== 1 ? 's' : ''})\n\n`;
        } else {
            reportContent += `\n\n`;
        }

        reportContent += `--- BIAS TYPE FREQUENCY ---\n`;
        if (biasTypeBreakdown.length > 0) {
            biasTypeBreakdown.forEach(item => {
                reportContent += `${item.name}: ${item.count}\n`;
            });
        } else {
            reportContent += `No findings recorded yet.\n`;
        }

        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Biasbuster_Dashboard_Report_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const maxCount = biasTypeBreakdown.length > 0 ? Math.max(...biasTypeBreakdown.map(item => item.count)) : 1;

    return (
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-neutral-800 dark:text-white md:text-4xl">
                    Platform Analytics
                </h2>
                <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                    A personalized look at your analysis activity. All data is stored locally on your device.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard 
                    icon={<ChartBarIcon className="h-6 w-6" />} 
                    label="Total Analyses Performed" 
                    value={totalAnalyses.toLocaleString()} 
                />
                <StatCard 
                    icon={<CalculatorIcon className="h-6 w-6" />} 
                    label="Average Findings / Analysis" 
                    value={totalAnalyses > 0 ? avgFindings.toFixed(1) : '0.0'} 
                />
                <StatCard 
                    icon={<TargetIcon className="h-6 w-6" />} 
                    label="Helpful Feedback" 
                    value={totalFeedbackCount > 0 ? `${feedbackAccuracy.toFixed(0)}%` : 'N/A'}
                />
            </div>

            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">Your Bias Type Frequency</h3>
                    <button
                        onClick={handleDownloadReport}
                        disabled={history.length === 0}
                        className="flex items-center px-3 py-1.5 bg-transparent border-2 border-trust-blue dark:border-ai-teal text-trust-blue dark:text-ai-teal font-semibold rounded-md text-sm hover:bg-trust-blue/10 dark:hover:bg-ai-teal/10 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Download analytics report"
                    >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Download Report
                    </button>
                </div>

                {biasTypeBreakdown.length > 0 ? (
                    <div className="space-y-4">
                        {biasTypeBreakdown.map(item => (
                            <div key={item.name} className="flex items-center group">
                                <p className="w-1/4 text-sm font-medium text-neutral-600 dark:text-neutral-300 pr-4 text-right">{item.name}</p>
                                <div className="w-3/4 flex items-center">
                                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-6 relative overflow-hidden">
                                        <div 
                                            className="bg-trust-blue dark:bg-ai-teal h-6 rounded-full flex items-center justify-end px-2 transition-all duration-500 ease-out"
                                            style={{ width: `${(item.count / maxCount) * 100}%` }}
                                        >
                                          <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">{item.count.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <span className="w-12 text-right text-sm font-semibold text-neutral-700 dark:text-neutral-200 pl-4">{item.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">
                        No analysis data yet. Perform an analysis to see your personalized stats here.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;