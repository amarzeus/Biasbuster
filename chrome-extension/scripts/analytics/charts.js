// Chart creation and management module
export const ChartManager = {
    createBiasTypesChart() {
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
    },

    createBiasScoreTrendChart() {
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
    },

    createCommonPhrasesChart() {
        const ctx = document.getElementById('commonPhrasesChart').getContext('2d');
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Phrase A', 'Phrase B', 'Phrase C', 'Phrase D', 'Phrase E'],
                datasets: [{
                    label: 'Occurrences',
                    data: [12, 19, 3, 5, 2],
                    backgroundColor: '#ff6384'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    },

    createActivityChart() {
        const ctx = document.getElementById('activityChart').getContext('2d');
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Analyses',
                    data: [150, 200, 180, 220],
                    backgroundColor: '#36a2eb'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    },

    updateCharts(data) {
        Object.keys(data).forEach(chartKey => {
            const chart = window.dashboardCharts[chartKey];
            if (chart && data[chartKey]) {
                chart.data.datasets[0].data = data[chartKey];
                chart.update();
            }
        });
    }
};
