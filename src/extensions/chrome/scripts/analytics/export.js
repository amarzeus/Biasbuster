// Export functionality module
export const ExportManager = {
    async exportToCSV() {
        try {
            const data = await this.getAnalyticsData();
            const csv = this.convertToCSV(data);
            this.downloadFile(csv, 'biasbuster-analytics.csv', 'text/csv');
        } catch (error) {
            console.error('Failed to export CSV:', error);
        }
    },

    async exportToPDF() {
        try {
            const data = await this.getAnalyticsData();
            const pdf = await this.generatePDF(data);
            this.downloadFile(pdf, 'biasbuster-analytics.pdf', 'application/pdf');
        } catch (error) {
            console.error('Failed to export PDF:', error);
        }
    },

    async exportToJSON() {
        try {
            const data = await this.getAnalyticsData();
            const json = JSON.stringify(data, null, 2);
            this.downloadFile(json, 'biasbuster-analytics.json', 'application/json');
        } catch (error) {
            console.error('Failed to export JSON:', error);
        }
    },

    async getAnalyticsData() {
        const response = await chrome.storage.local.get('analyticsData');
        return response.analyticsData || {};
    },

    convertToCSV(data) {
        const rows = [
            ['Metric', 'Value'],
            ['Total Analyses', data.totalAnalyses],
            ['Total Biases', data.totalBiases],
            ['Average Bias Score', data.avgBiasScore],
            ['Suggestions Applied', data.suggestionsApplied],
            ['Content Improved', `${data.contentImproved}%`],
            ['Time Saved', `${data.timeSaved} hrs`],
            ['Accuracy Rate', `${data.accuracyRate}%`],
            ['Response Time', `${data.responseTime}ms`],
            ['Cache Hit Rate', `${data.cacheHitRate}%`]
        ];

        return rows.map(row => row.join(',')).join('\\n');
    },

    async generatePDF(data) {
        // In a real implementation, use a PDF library
        // For now, return a simple text representation
        const content = `
            Biasbuster Analytics Report
            Generated: ${new Date().toLocaleString()}

            Overview:
            - Total Analyses: ${data.totalAnalyses}
            - Total Biases: ${data.totalBiases}
            - Average Bias Score: ${data.avgBiasScore}%
            - Suggestions Applied: ${data.suggestionsApplied}

            Performance Metrics:
            - Content Improved: ${data.contentImproved}%
            - Time Saved: ${data.timeSaved} hrs
            - Accuracy Rate: ${data.accuracyRate}%
            - Response Time: ${data.responseTime}ms
            - Cache Hit Rate: ${data.cacheHitRate}%
        `;

        return content;
    },

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};
