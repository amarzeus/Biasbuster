<template>
  <div class="performance-dashboard">
    <h2>Performance Dashboard</h2>
    
    <!-- Overall Score -->
    <div class="overall-score" :style="{ backgroundColor: gradeColor }">
      <div class="score">{{ overallScore }}%</div>
      <div class="grade">Grade {{ grade }}</div>
    </div>

    <!-- Category Scores -->
    <div class="category-scores">
      <div v-for="(score, category) in categoryScores" :key="category" class="category">
        <h3>{{ PERFORMANCE_CATEGORIES[category].name }}</h3>
        <div class="progress-bar">
          <div class="progress" :style="{ width: `${score}%`, backgroundColor: getScoreColor(score) }"></div>
        </div>
        <div class="score">{{ Math.round(score) }}%</div>
      </div>
    </div>

    <!-- Detailed Metrics -->
    <div class="detailed-metrics">
      <h3>Detailed Metrics</h3>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Threshold</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="metric in PERFORMANCE_METRICS" :key="metric.name">
            <td>{{ metric.name }}</td>
            <td>{{ formatMetricValue(metric, metrics[metric.name]) }}</td>
            <td>{{ formatMetricValue(metric, metric.threshold) }}</td>
            <td>
              <span :class="['status', getMetricStatus(metric, metrics[metric.name])]">
                {{ getMetricStatus(metric, metrics[metric.name]) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Performance Timeline -->
    <div class="performance-timeline">
      <h3>Performance Timeline</h3>
      <div class="timeline">
        <div v-for="(data, index) in timelineData" :key="index" class="timeline-point"
          :style="{ left: `${(index / (timelineData.length - 1)) * 100}%` }">
          <div class="point" :style="{ backgroundColor: getScoreColor(data.overall) }"></div>
          <div class="tooltip">
            <div>Score: {{ Math.round(data.overall) }}%</div>
            <div>Grade: {{ data.grade }}</div>
            <div>Time: {{ formatTimestamp(data.timestamp) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { PERFORMANCE_METRICS, PERFORMANCE_CATEGORIES, PERFORMANCE_GRADES } from '@/config/performance-metrics';
import { performanceMonitor } from '@/services/performance-monitor';

const metrics = ref<Record<string, number>>({});
const categoryScores = ref<Record<string, number>>({});
const overallScore = ref(0);
const grade = ref('F');
const timelineData = ref<any[]>([]);

const updatePerformanceData = (data: any) => {
  metrics.value = data.metrics;
  categoryScores.value = data.categories;
  overallScore.value = data.overall;
  grade.value = data.grade;
  timelineData.value.push(data);
  
  // Keep only last 10 data points
  if (timelineData.value.length > 10) {
    timelineData.value.shift();
  }
};

const getScoreColor = (score: number): string => {
  for (const [grade, { min, color }] of Object.entries(PERFORMANCE_GRADES)) {
    if (score >= min) {
      return color;
    }
  }
  return PERFORMANCE_GRADES.F.color;
};

const getMetricStatus = (metric: typeof PERFORMANCE_METRICS[0], value: number | undefined): string => {
  if (value === undefined) return 'N/A';
  return value <= metric.threshold ? 'Good' : 'Poor';
};

const formatMetricValue = (metric: typeof PERFORMANCE_METRICS[0], value: number | undefined): string => {
  if (value === undefined) return 'N/A';
  return `${value}${metric.unit}`;
};

const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString();
};

const gradeColor = computed(() => getScoreColor(overallScore.value));

onMounted(() => {
  window.addEventListener('performanceUpdate', (event: any) => {
    updatePerformanceData(event.detail);
  });
});

onUnmounted(() => {
  window.removeEventListener('performanceUpdate', updatePerformanceData);
});
</script>

<style scoped>
.performance-dashboard {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.overall-score {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  color: white;
  margin-bottom: 20px;
}

.score {
  font-size: 48px;
  font-weight: bold;
}

.grade {
  font-size: 24px;
}

.category-scores {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.category {
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
}

.progress-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin: 10px 0;
}

.progress {
  height: 100%;
  transition: width 0.3s ease;
}

.detailed-metrics table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.detailed-metrics th,
.detailed-metrics td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status.Good {
  background: #4CAF50;
  color: white;
}

.status.Poor {
  background: #F44336;
  color: white;
}

.performance-timeline {
  margin-top: 20px;
}

.timeline {
  position: relative;
  height: 60px;
  margin: 20px 0;
  padding: 0 20px;
}

.timeline-point {
  position: absolute;
  transform: translateX(-50%);
}

.point {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.timeline-point:hover .tooltip {
  opacity: 1;
}
</style> 