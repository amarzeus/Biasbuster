import { ChartManager } from './charts.js';
import { DataManager } from './data.js';
import { ExportManager } from './export.js';

// Initialize analytics dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize charts
    window.dashboardCharts = {
        biasTypes: ChartManager.createBiasTypesChart(),
        biasScoreTrend: ChartManager.createBiasScoreTrendChart(),
        commonPhrases: ChartManager.createCommonPhrasesChart(),
        activity: ChartManager.createActivityChart()
    };

    // Set up event listeners
    setupEventListeners();

    // Load initial data
    await DataManager.loadAnalyticsData();

    // Set up auto-refresh
    setInterval(() => DataManager.loadAnalyticsData(), 60000); // Refresh every minute
});

// Set up event listeners
function setupEventListeners() {
    // Time range selector
    const timeRange = document.getElementById('timeRange');
    if (timeRange) {
        timeRange.addEventListener('change', async (e) => {
            await DataManager.loadAnalyticsData(e.target.value);
        });
    }

    // Export buttons
    const exportButtons = {
        csv: document.getElementById('exportCSV'),
        pdf: document.getElementById('exportPDF'),
        json: document.getElementById('exportJSON')
    };

    if (exportButtons.csv) {
        exportButtons.csv.addEventListener('click', () => ExportManager.exportToCSV());
    }
    if (exportButtons.pdf) {
        exportButtons.pdf.addEventListener('click', () => ExportManager.exportToPDF());
    }
    if (exportButtons.json) {
        exportButtons.json.addEventListener('click', () => ExportManager.exportToJSON());
    }

    // Refresh button
    const refreshButton = document.getElementById('refreshData');
    if (refreshButton) {
        refreshButton.addEventListener('click', async () => {
            refreshButton.disabled = true;
            try {
                await DataManager.loadAnalyticsData();
                showToast('Data refreshed successfully!');
            } catch (error) {
                showToast('Failed to refresh data', 'error');
            } finally {
                refreshButton.disabled = false;
            }
        });
    }
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Add toast styles
const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 4px;
        color: white;
        opacity: 0;
        transform: translateY(100%);
        transition: all 0.3s ease;
    }

    .toast.show {
        opacity: 1;
        transform: translateY(0);
    }

    .toast.success {
        background-color: #00C851;
    }

    .toast.error {
        background-color: #ff4444;
    }
`;
document.head.appendChild(style);
