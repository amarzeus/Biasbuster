# Biasbuster API Documentation

## Overview

The Biasbuster API provides endpoints for bias detection, analysis, and management. This documentation covers all available endpoints, authentication, and usage examples.

## Base URL

```
https://api.biasbuster.com/v1
```

## Authentication

All API requests require authentication using an API key. Include your API key in the `Authorization` header:

```
Authorization: Bearer YOUR_API_KEY
```

## Rate Limits

- Free tier: 100 requests/hour
- Pro tier: 1000 requests/hour
- Enterprise tier: Custom limits

## Endpoints

### Bias Detection

#### Analyze Text

```http
POST /analyze
```

Analyzes text for potential bias and returns detailed results.

**Request Body:**
```json
{
  "text": "string",
  "options": {
    "sensitivity": 0.7,
    "enabledBiasTypes": ["gender", "racial", "political"],
    "language": "en"
  }
}
```

**Response:**
```json
{
  "text": "string",
  "analysis": {
    "biasTypes": ["string"],
    "severity": 0.8,
    "explanation": "string",
    "highlightedText": "string"
  },
  "timestamp": "string",
  "confidence": 0.9,
  "suggestions": ["string"]
}
```

### Model Management

#### Get Model Status

```http
GET /models/status
```

Returns the current status and metrics of the bias detection model.

**Response:**
```json
{
  "version": "string",
  "status": "active",
  "metrics": {
    "accuracy": 0.95,
    "precision": 0.94,
    "recall": 0.93,
    "f1Score": 0.94
  },
  "lastUpdated": "string"
}
```

### Analytics

#### Get Analytics

```http
GET /analytics
```

Retrieves analytics data for your account.

**Query Parameters:**
- `startDate`: Start date for analytics (ISO 8601)
- `endDate`: End date for analytics (ISO 8601)
- `metrics`: Comma-separated list of metrics to include

**Response:**
```json
{
  "totalAnalyses": 1000,
  "biasDistribution": {
    "gender": 0.3,
    "racial": 0.2,
    "political": 0.5
  },
  "averageConfidence": 0.85,
  "timeSeries": [
    {
      "date": "string",
      "analyses": 100,
      "averageSeverity": 0.7
    }
  ]
}
```

## Error Handling

All errors follow this format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

Common error codes:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `429`: Too Many Requests
- `500`: Internal Server Error

## SDKs

Official SDKs are available for:
- [JavaScript/TypeScript](https://github.com/biasbuster/js-sdk)
- [Python](https://github.com/biasbuster/python-sdk)
- [Java](https://github.com/biasbuster/java-sdk)

## Webhooks

Configure webhooks to receive real-time notifications about bias detection events.

**Webhook Events:**
- `bias.detected`: When bias is detected in analyzed text
- `model.updated`: When the model is updated
- `analytics.ready`: When new analytics data is available

## Support

For API support:
- Email: api@biasbuster.com
- Documentation: https://docs.biasbuster.com
- Status: https://status.biasbuster.com 