<template>
  <div class="performance-visualization">
    <!-- Performance Score Gauge -->
    <div class="gauge-container">
      <div class="gauge">
        <div class="gauge-body">
          <div class="gauge-cover">
            <div class="gauge-value">{{ Math.round(score) }}%</div>
            <div class="gauge-label">Performance Score</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Metrics Chart -->
    <div class="metrics-chart">
      <canvas ref="metricsChart"></canvas>
    </div>

    <!-- Performance Timeline -->
    <div class="timeline-chart">
      <canvas ref="timelineChart"></canvas>
    </div>

    <!-- Performance Distribution -->
    <div class="distribution-chart">
      <canvas ref="distributionChart"></canvas>
    </div>

    <!-- Performance Recommendations -->
    <div class="recommendations">
      <h3>Optimization Recommendations</h3>
      <div v-for="rec in recommendations" :key="rec.id" class="recommendation-card">
        <div class="recommendation-header">
          <h4>{{ rec.title }}</h4>
          <span :class="['impact-badge', rec.impact]">{{ rec.impact }}</span>
        </div>
        <p>{{ rec.description }}</p>
        <div class="recommendation-metrics">
          <span v-for="metric in rec.metrics" :key="metric" class="metric-badge">
            {{ metric }}
          </span>
        </div>
        <div class="recommendation-solution">
          <h5>Solution:</h5>
          <pre><code>{{ rec.codeExample }}</code></pre>
        </div>
        <div class="recommendation-resources">
          <h5>Resources:</h5>
          <ul>
            <li v-for="resource in rec.resources" :key="resource">
              <a :href="resource" target="_blank" rel="noopener">{{ resource }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import { performanceMonitor } from '@/services/performance-monitor';
import { performanceOptimizer } from '@/services/performance-optimizer';
import { PERFORMANCE_METRICS, PERFORMANCE_CATEGORIES } from '@/config/performance-metrics';

const props = defineProps<{
  score: number;
  metrics: Record<string, number>;
  timeline: any[];
}>();

const metricsChart = ref<HTMLCanvasElement | null>(null);
const timelineChart = ref<HTMLCanvasElement | null>(null);
const distributionChart = ref<HTMLCanvasElement | null>(null);
const recommendations = ref<any[]>([]);

let metricsChartInstance: Chart | null = null;
let timelineChartInstance: Chart | null = null;
let distributionChartInstance: Chart | null = null;

const initializeCharts = () => {
  if (metricsChart.value) {
    metricsChartInstance = new Chart(metricsChart.value, {
      type: 'radar',
      data: {
        labels: PERFORMANCE_METRICS.map(m => m.name),
        datasets: [{
          label: 'Current Performance',
          data: PERFORMANCE_METRICS.map(m => props.metrics[m.name] || 0),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }

  if (timelineChart.value) {
    timelineChartInstance = new Chart(timelineChart.value, {
      type: 'line',
      data: {
        labels: props.timeline.map(t => new Date(t.timestamp).toLocaleTimeString()),
        datasets: [{
          label: 'Performance Score',
          data: props.timeline.map(t => t.overall),
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }

  if (distributionChart.value) {
    const categories = Object.keys(PERFORMANCE_CATEGORIES);
    distributionChartInstance = new Chart(distributionChart.value, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Category Scores',
          data: categories.map(c => props.metrics[c] || 0),
          backgroundColor: categories.map(c => 
            `hsl(${(categories.indexOf(c) * 360) / categories.length}, 70%, 50%)`
          )
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }
};

const updateCharts = () => {
  if (metricsChartInstance) {
    metricsChartInstance.data.datasets[0].data = PERFORMANCE_METRICS.map(m => 
      props.metrics[m.name] || 0
    );
    metricsChartInstance.update();
  }

  if (timelineChartInstance) {
    timelineChartInstance.data.labels = props.timeline.map(t => 
      new Date(t.timestamp).toLocaleTimeString()
    );
    timelineChartInstance.data.datasets[0].data = props.timeline.map(t => t.overall);
    timelineChartInstance.update();
  }

  if (distributionChartInstance) {
    const categories = Object.keys(PERFORMANCE_CATEGORIES);
    distributionChartInstance.data.datasets[0].data = categories.map(c => 
      props.metrics[c] || 0
    );
    distributionChartInstance.update();
  }
};

const updateRecommendations = () => {
  recommendations.value = performanceOptimizer.getRecommendations(props.metrics);
};

watch(() => props.metrics, () => {
  updateCharts();
  updateRecommendations();
}, { deep: true });

onMounted(() => {
  initializeCharts();
  updateRecommendations();
});

onUnmounted(() => {
  metricsChartInstance?.destroy();
  timelineChartInstance?.destroy();
  distributionChartInstance?.destroy();
});
</script>

<style scoped>
.performance-visualization {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.gauge-container {
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
}

.gauge {
  width: 100%;
  height: 100%;
  position: relative;
}

.gauge-body {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 10px solid #f3f3f3;
  border-top-color: #3498db;
  transform: rotate(45deg);
}

.gauge-cover {
  width: 75%;
  height: 75%;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 12.5%;
  left: 12.5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: rotate(-45deg);
}

.gauge-value {
  font-size: 24px;
  font-weight: bold;
}

.gauge-label {
  font-size: 12px;
  color: #666;
}

.metrics-chart,
.timeline-chart,
.distribution-chart {
  margin: 20px 0;
  height: 300px;
}

.recommendations {
  margin-top: 20px;
}

.recommendation-card {
  background: #f8f9fa;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.impact-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.impact-badge.high {
  background: #dc3545;
  color: white;
}

.impact-badge.medium {
  background: #ffc107;
  color: black;
}

.impact-badge.low {
  background: #28a745;
  color: white;
}

.metric-badge {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 5px;
}

.recommendation-solution pre {
  background: #f1f1f1;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

.recommendation-resources ul {
  list-style: none;
  padding: 0;
}

.recommendation-resources li {
  margin: 5px 0;
}

.recommendation-resources a {
  color: #007bff;
  text-decoration: none;
}

.recommendation-resources a:hover {
  text-decoration: underline;
}
</style> 