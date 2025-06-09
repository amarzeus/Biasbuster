# BiasBuster Fairness & Analytics Dashboard

A comprehensive dashboard for monitoring and analyzing bias detection results, fairness metrics, and audit history.

## Features

- Real-time bias detection monitoring
- Visual representation of bias distribution
- Performance metrics by category
- Risk level indicators
- Audit history tracking
- Data export functionality (CSV/JSON)
- Responsive design

## Components

### FairnessDashboard

The main dashboard component that integrates all other components. It displays:
- Risk level indicator
- Key metrics
- Bias distribution chart
- Performance metrics chart
- Recommendations list
- Audit history table

### BiasDistributionChart

A pie chart component that visualizes the distribution of different types of bias detected in the content.

### PerformanceMetricsChart

A bar chart component that displays performance metrics (accuracy, precision, recall) across different categories.

### AuditHistoryTable

A table component that shows the history of bias audits, including:
- Timestamp
- Risk level
- Bias count
- Fairness score
- Recommendations

### RiskLevelIndicator

A component that displays the current risk level with:
- Visual indicator
- Risk score
- Descriptive message

### RecommendationsList

A component that displays actionable recommendations based on the audit results.

### ExportButton

A component that allows users to export dashboard data in:
- CSV format
- JSON format

## Usage

```tsx
import FairnessDashboard from './components/dashboard/FairnessDashboard';

const App = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      const data = await auditService.getAuditData();
      setDashboardData(data);
    };
    fetchData();
  }, []);

  return (
    <FairnessDashboard
      latestAudit={dashboardData.latestAudit}
      auditHistory={dashboardData.auditHistory}
    />
  );
};
```

## API Integration

The dashboard expects the following data structure:

```typescript
interface AuditData {
  latestAudit: {
    id: string;
    timestamp: string;
    riskLevel: 'low' | 'medium' | 'high';
    riskScore: number;
    biasDistribution: Record<string, number>;
    performance: Record<string, {
      accuracy: number;
      precision: number;
      recall: number;
    }>;
    recommendations: string[];
  };
  auditHistory: Array<{
    id: string;
    timestamp: string;
    riskLevel: 'low' | 'medium' | 'high';
    biasCount: number;
    fairnessScore: number;
    recommendations: string[];
  }>;
}
```

## Development

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

### Testing

Run the test suite:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details 