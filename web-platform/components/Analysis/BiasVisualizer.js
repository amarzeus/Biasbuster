class BiasVisualizer {
    constructor(options = {}) {
        this.container = options.container || document.getElementById('analysis-results');
        this.colors = {
            political: '#FF6B6B',
            gender: '#4ECDC4',
            racial: '#45B7D1',
            cultural: '#96CEB4',
            socioeconomic: '#FFEEAD',
            religious: '#D4A5A5'
        };
        this.charts = {};
        this.currentData = null;
    }

    displayResults(data) {
        this.currentData = data;
        if (!this.container) return;

        // Show loading state
        this.showLoading();

        // Clear previous results
        this.container.innerHTML = '';

        // Create main sections
        const scoreSection = this.createScoreSection(data.overallScore);
        const biasSection = this.createBiasSection(data.BiasInstances);
        const chartsSection = this.createChartsSection(data);

        // Add sections to container
        this.container.appendChild(scoreSection);
        this.container.appendChild(biasSection);
        this.container.appendChild(chartsSection);

        // Initialize charts after DOM elements are created
        this.initializeCharts(data);

        // Add fade-in animation
        requestAnimationFrame(() => {
            Array.from(this.container.children).forEach(element => {
                element.classList.add('fade-in', 'show');
            });
        });
    }

    showLoading() {
        if (window.LoadingSpinner) {
            const spinner = new window.LoadingSpinner({
                message: 'Analyzing text for bias...'
            });
            spinner.show(this.container);
            return spinner;
        }
        return null;
    }

    createScoreSection(score) {
        const section = document.createElement('div');
        section.className = 'score-section fade-in';

        const scoreValue = Math.round((1 - score) * 100);
        const scoreCategory = this.getScoreCategory(scoreValue);

        section.innerHTML = `
            <div class="score-container">
                <div class="score-circle">
                    <svg class="score-chart" viewBox="0 0 36 36">
                        <path d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="var(--border-color)"
                            stroke-width="2"
                        />
                        <path d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="var(--${scoreCategory.color}-color)"
                            stroke-width="2"
                            stroke-dasharray="${scoreValue}, 100"
                        />
                    </svg>
                    <div class="score-value">${scoreValue}</div>
                </div>
                <div class="score-label">${scoreCategory.label}</div>
                <div class="score-description">${scoreCategory.description}</div>
            </div>
        `;

        return section;
    }

    getScoreCategory(score) {
        if (score >= 80) {
            return {
                label: 'Excellent',
                color: 'success',
                description: 'The text shows minimal bias and maintains a neutral perspective.'
            };
        } else if (score >= 60) {
            return {
                label: 'Good',
                color: 'success',
                description: 'The text contains some biased language but generally maintains neutrality.'
            };
        } else if (score >= 40) {
            return {
                label: 'Fair',
                color: 'warning',
                description: 'Several instances of bias detected. Consider revising highlighted sections.'
            };
        } else {
            return {
                label: 'Needs Improvement',
                color: 'error',
                description: 'Significant bias detected. Review and revise the highlighted sections.'
            };
        }
    }

    createBiasSection(biasInstances) {
        const section = document.createElement('div');
        section.className = 'bias-section fade-in';

        if (biasInstances.length === 0) {
            section.innerHTML = `
                <div class="no-bias-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>No Bias Detected</h3>
                    <p>The text appears to be neutral and free from significant bias.</p>
                </div>
            `;
            return section;
        }

        section.innerHTML = `
            <h3>Detected Bias Instances</h3>
            <div class="bias-cards-container">
                ${biasInstances.map(instance => this.createBiasCard(instance)).join('')}
            </div>
        `;

        return section;
    }

    createBiasCard(instance) {
        const color = this.colors[instance.type] || 'var(--primary-color)';
        return `
            <div class="bias-card" style="border-left-color: ${color}">
                <div class="bias-type">${instance.type}</div>
                <div class="bias-context">${this.highlightBiasedText(instance.context, instance.biasedText)}</div>
                <div class="bias-explanation">
                    <h4>Explanation</h4>
                    <p>${instance.explanation}</p>
                </div>
                <div class="bias-suggestion">
                    <h4>Suggestion</h4>
                    <p>${instance.suggestion}</p>
                </div>
                <div class="bias-severity ${instance.severity.toLowerCase()}">
                    Severity: ${instance.severity}
                </div>
            </div>
        `;
    }

    highlightBiasedText(context, biasedText) {
        const regex = new RegExp(`(${biasedText})`, 'gi');
        return context.replace(regex, '<span class="bias-highlight">$1</span>');
    }

    createChartsSection(data) {
        const section = document.createElement('div');
        section.className = 'charts-section fade-in';

        section.innerHTML = `
            <h3>Bias Analysis Overview</h3>
            <div class="charts-grid">
                <div class="chart-container">
                    <canvas id="categoryDistributionChart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="severityDistributionChart"></canvas>
                </div>
            </div>
        `;

        return section;
    }

    initializeCharts(data) {
        this.initializeCategoryDistributionChart(data);
        this.initializeSeverityDistributionChart(data);
    }

    initializeCategoryDistributionChart(data) {
        const ctx = document.getElementById('categoryDistributionChart')?.getContext('2d');
        if (!ctx) return;

        const categoryData = this.aggregateBiasByCategory(data.BiasInstances);

        this.charts.categoryDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    data: Object.values(categoryData),
                    backgroundColor: Object.keys(categoryData).map(category => this.colors[category]),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: 'var(--text-primary)'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Bias Distribution by Category',
                        color: 'var(--text-primary)'
                    }
                }
            }
        });
    }

    initializeSeverityDistributionChart(data) {
        const ctx = document.getElementById('severityDistributionChart')?.getContext('2d');
        if (!ctx) return;

        const severityData = this.aggregateBiasBySeverity(data.BiasInstances);

        this.charts.severityDistribution = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(severityData),
                datasets: [{
                    label: 'Number of Instances',
                    data: Object.values(severityData),
                    backgroundColor: [
                        'var(--success-color)',
                        'var(--warning-color)',
                        'var(--error-color)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'var(--text-primary)'
                        },
                        grid: {
                            color: 'var(--border-color)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'var(--text-primary)'
                        },
                        grid: {
                            color: 'var(--border-color)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Bias Severity Distribution',
                        color: 'var(--text-primary)'
                    }
                }
            }
        });
    }

    aggregateBiasByCategory(biasInstances) {
        return biasInstances.reduce((acc, instance) => {
            acc[instance.type] = (acc[instance.type] || 0) + 1;
            return acc;
        }, {});
    }

    aggregateBiasBySeverity(biasInstances) {
        return biasInstances.reduce((acc, instance) => {
            acc[instance.severity] = (acc[instance.severity] || 0) + 1;
            return acc;
        }, {});
    }

    updateCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.update === 'function') {
                chart.update();
            }
        });
    }

    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Export for use in other files
window.BiasVisualizer = BiasVisualizer;
