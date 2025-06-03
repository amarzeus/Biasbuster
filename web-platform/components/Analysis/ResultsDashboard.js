class ResultsDashboard {
    constructor() {
        this.metrics = {
            totalAnalyses: 0,
            averageScore: 0,
            biasDistribution: {},
            commonBiases: []
        };
        this.charts = {};
        this.historyLimit = 50;
        this.init();
    }

    init() {
        this.loadHistory();
        this.setupEventListeners();
        this.initializeCharts();
    }

    loadHistory() {
        const history = JSON.parse(localStorage.getItem('analysis-history') || '[]');
        this.updateMetricsFromHistory(history);
    }

    setupEventListeners() {
        // Listen for new analysis results
        document.addEventListener('analysisComplete', (e) => {
            this.updateMetrics(e.detail);
        });

        // Time range selector
        document.getElementById('time-range')?.addEventListener('change', (e) => {
            this.updateTimeRange(e.target.value);
        });

        // Category filters
        document.getElementById('category-filters')?.addEventListener('change', (e) => {
            this.updateCategoryFilters(e.target.checked, e.target.value);
        });

        // Export button
        document.getElementById('export-results')?.addEventListener('click', () => {
            this.exportResults();
        });
    }

    initializeCharts() {
        // Trend Chart
        const trendCtx = document.getElementById('trend-chart')?.getContext('2d');
        if (trendCtx) {
            this.charts.trend = new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Bias Score Trend',
                        data: [],
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 1
                        }
                    }
                }
            });
        }

        // Category Distribution Chart
        const categoryCtx = document.getElementById('category-chart')?.getContext('2d');
        if (categoryCtx) {
            this.charts.category = new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right'
                        }
                    }
                }
            });
        }
    }

    updateMetrics(result) {
        // Update history
        const history = JSON.parse(localStorage.getItem('analysis-history') || '[]');
        history.unshift(result);
        if (history.length > this.historyLimit) {
            history.pop();
        }
        localStorage.setItem('analysis-history', JSON.stringify(history));

        // Update metrics
        this.updateMetricsFromHistory(history);
        this.updateCharts(history);
        this.updateDashboardUI();
    }

    updateMetricsFromHistory(history) {
        // Calculate basic metrics
        this.metrics.totalAnalyses = history.length;
        this.metrics.averageScore = history.reduce((sum, item) => sum + item.overallScore, 0) / history.length || 0;

        // Calculate bias distribution
        const distribution = {};
        const biasCount = {};

        history.forEach(analysis => {
            analysis.BiasInstances.forEach(instance => {
                distribution[instance.type] = (distribution[instance.type] || 0) + 1;
                biasCount[instance.biasedText] = (biasCount[instance.biasedText] || 0) + 1;
            });
        });

        this.metrics.biasDistribution = distribution;
        this.metrics.commonBiases = Object.entries(biasCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([word, count]) => ({ word, count }));
    }

    updateCharts(history) {
        // Update trend chart
        if (this.charts.trend) {
            const trendData = history.slice().reverse();
            this.charts.trend.data.labels = trendData.map(item => 
                new Date(item.timestamp).toLocaleDateString()
            );
            this.charts.trend.data.datasets[0].data = trendData.map(item => 
                item.overallScore
            );
            this.charts.trend.update();
        }

        // Update category distribution chart
        if (this.charts.category) {
            const distribution = this.metrics.biasDistribution;
            this.charts.category.data.labels = Object.keys(distribution);
            this.charts.category.data.datasets[0].data = Object.values(distribution);
            this.charts.category.update();
        }
    }

    updateDashboardUI() {
        // Update summary metrics
        document.getElementById('total-analyses')?.textContent = this.metrics.totalAnalyses;
        document.getElementById('average-score')?.textContent = 
            (this.metrics.averageScore * 100).toFixed(1) + '%';

        // Update common biases list
        const commonBiasesList = document.getElementById('common-biases');
        if (commonBiasesList) {
            commonBiasesList.innerHTML = this.metrics.commonBiases
                .map(({ word, count }) => `
                    <li class="bias-item">
                        <span class="bias-word">${word}</span>
                        <span class="bias-count">${count}</span>
                    </li>
                `).join('');
        }

        // Update category distribution
        const categoryList = document.getElementById('category-distribution');
        if (categoryList) {
            categoryList.innerHTML = Object.entries(this.metrics.biasDistribution)
                .map(([category, count]) => `
                    <li class="category-item">
                        <span class="category-name">${category}</span>
                        <span class="category-count">${count}</span>
                        <div class="category-bar" style="width: ${(count / this.metrics.totalAnalyses * 100)}%"></div>
                    </li>
                `).join('');
        }
    }

    updateTimeRange(range) {
        const history = JSON.parse(localStorage.getItem('analysis-history') || '[]');
        let filteredHistory;

        const now = new Date();
        switch (range) {
            case 'day':
                filteredHistory = history.filter(item => 
                    new Date(item.timestamp) > new Date(now - 24 * 60 * 60 * 1000)
                );
                break;
            case 'week':
                filteredHistory = history.filter(item =>
                    new Date(item.timestamp) > new Date(now - 7 * 24 * 60 * 60 * 1000)
                );
                break;
            case 'month':
                filteredHistory = history.filter(item =>
                    new Date(item.timestamp) > new Date(now - 30 * 24 * 60 * 60 * 1000)
                );
                break;
            default:
                filteredHistory = history;
        }

        this.updateMetricsFromHistory(filteredHistory);
        this.updateCharts(filteredHistory);
        this.updateDashboardUI();
    }

    updateCategoryFilters(checked, category) {
        const history = JSON.parse(localStorage.getItem('analysis-history') || '[]');
        let filteredHistory = history;

        if (checked) {
            filteredHistory = history.filter(item =>
                item.BiasInstances.some(instance => instance.type === category)
            );
        }

        this.updateMetricsFromHistory(filteredHistory);
        this.updateCharts(filteredHistory);
        this.updateDashboardUI();
    }

    exportResults() {
        const history = JSON.parse(localStorage.getItem('analysis-history') || '[]');
        const csvContent = this.convertToCSV(history);
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `bias-analysis-${new Date().toISOString()}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    convertToCSV(history) {
        const headers = ['Timestamp', 'Overall Score', 'Bias Types', 'Biased Words', 'Suggestions'];
        const rows = history.map(item => [
            new Date(item.timestamp).toISOString(),
            item.overallScore,
            [...new Set(item.BiasInstances.map(i => i.type))].join(';'),
            item.BiasInstances.map(i => i.biasedText).join(';'),
            item.suggestions.join(';')
        ]);

        return [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
    }
}

// Export for use in other files
window.ResultsDashboard = ResultsDashboard;
