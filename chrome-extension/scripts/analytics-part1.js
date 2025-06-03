// Analytics Dashboard Script - Part 1
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize charts
    initializeCharts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial data
    await loadAnalyticsData();
    
    // Set up auto-refresh
    setInterval(loadAnalyticsData, 60000); // Refresh every minute
});

// Initialize all charts
function initializeCharts() {
    const charts = {
        biasTypes: createBiasTypesChart(),
        biasScoreTrend: createBiasScoreTrendChart(),
        commonPhrases: createCommonPhrasesChart(),
        activity: createActivityChart()
    };
    
    window.dashboardCharts = charts;
    
    return charts;
}

// Create Bias Types Distribution Chart
function createBiasTypesChart() {
    const ctx = document.getElementById('biasTypesChart').getContext('2d');
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Gender', 'Racial', 'Political', 'Cultural'],
            datasets: [{
                data: [30, 25, 20, 25],
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// Create Bias Score Trend Chart
function createBiasScoreTrendChart() {
    const ctx = document.getElementById('biasScoreTrendChart').getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Bias Score',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: '#2196F3',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });
}
