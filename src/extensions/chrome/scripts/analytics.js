import Chart from './chart.min.js';

document.addEventListener('DOMContentLoaded', () => {
    const ctxBiasTypes = document.getElementById('biasTypesChart').getContext('2d');
    const ctxBiasScoreTrend = document.getElementById('biasScoreTrendChart').getContext('2d');
    const ctxCommonPhrases = document.getElementById('commonPhrasesChart').getContext('2d');
    const ctxActivity = document.getElementById('activityChart').getContext('2d');

    // Sample data - replace with real API calls
    const biasTypesData = {
        labels: ['Gender', 'Racial', 'Political', 'Cultural'],
        datasets: [{
            label: 'Bias Types Distribution',
            data: [30, 25, 20, 25],
            backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0']
        }]
    };

    const biasScoreTrendData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Bias Score',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: '#2196F3',
            tension: 0.1
        }]
    };

    const commonPhrasesData = {
        labels: ['Phrase A', 'Phrase B', 'Phrase C', 'Phrase D', 'Phrase E'],
        datasets: [{
            label: 'Occurrences',
            data: [12, 19, 3, 5, 2],
            backgroundColor: '#ff6384'
        }]
    };

    const activityData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Analyses',
            data: [150, 200, 180, 220],
            backgroundColor: '#36a2eb'
        }]
    };

    // Create charts
    new Chart(ctxBiasTypes, {
        type: 'doughnut',
        data: biasTypesData,
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    new Chart(ctxBiasScoreTrend, {
        type: 'line',
        data: biasScoreTrendData,
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });

    new Chart(ctxCommonPhrases, {
        type: 'bar',
        data: commonPhrasesData,
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    new Chart(ctxActivity, {
        type: 'bar',
        data: activityData,
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Fetch and update stats (placeholder)
    document.getElementById('totalAnalyses').textContent = '750';
    document.getElementById('totalBiases').textContent = '320';
    document.getElementById('avgBiasScore').textContent = '45%';
    document.getElementById('suggestionsApplied').textContent = '210';
    document.getElementById('lastUpdated').textContent = new Date().toLocaleString();

    // Add event listeners for export buttons and refresh
    document.getElementById('exportCSV').addEventListener('click', () => {
        alert('Export to CSV feature coming soon!');
    });
    document.getElementById('exportPDF').addEventListener('click', () => {
        alert('Export to PDF feature coming soon!');
    });
    document.getElementById('exportJSON').addEventListener('click', () => {
        alert('Export to JSON feature coming soon!');
    });
    document.getElementById('refreshData').addEventListener('click', () => {
        alert('Refreshing data...');
        // Implement data refresh logic here
    });
});
