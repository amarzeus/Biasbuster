# Knowledge Base API Reference

## Overview

The Biasbuster Knowledge Base API provides programmatic access to our AI-powered knowledge management system. This RESTful API supports semantic search, content management, and AI-assisted operations.

## Base URL
```
https://api.biasbuster.com/v1/kb
```

## Authentication

All API requests require authentication using JWT tokens or API keys.

```bash
# Example using Bearer token
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.biasbuster.com/v1/kb/search
```

## Rate Limiting

- Free tier: 100 requests/hour
- Pro tier: 1000 requests/hour
- Enterprise tier: Custom limits

## Endpoints

### Search

#### Semantic Search
```http
GET /search
```

Search the knowledge base using natural language queries.

**Parameters:**
```json
{
  "query": "string",
  "filters": {
    "tags": ["string"],
    "category": "string",
    "date_range": {
      "start": "ISO8601",
      "end": "ISO8601"
    }
  },
  "limit": "number",
  "offset": "number"
}
```

**Response:**
```json
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "relevance_score": "number",
      "tags": ["string"],
      "category": "string",
      "last_updated": "ISO8601"
    }
  ],
  "total": "number",
  "page": "number"
}
```

**Example:**
```bash
curl -X GET "https://api.biasbuster.com/v1/kb/search?query=bias+detection" \
     -H "Authorization: Bearer YOUR_TOKEN"
```

#### Question Answering
```http
POST /ask
```

Get AI-generated answers to questions using the knowledge base.

**Request:**
```json
{
  "question": "string",
  "context": {
    "include_sources": "boolean",
    "max_tokens": "number"
  }
}
```

**Response:**
```json
{
  "answer": "string",
  "confidence": "number",
  "sources": [
    {
      "id": "string",
      "title": "string",
      "relevance": "number"
    }
  ]
}
```

**Example:**
```bash
curl -X POST "https://api.biasbuster.com/v1/kb/ask" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "question": "How does bias detection work?",
       "context": {
         "include_sources": true
       }
     }'
```

### Content Management

#### Create Article
```http
POST /articles
```

Create a new knowledge base article.

**Request:**
```json
{
  "title": "string",
  "content": "string",
  "category": "string",
  "tags": ["string"],
  "metadata": {
    "author": "string",
    "visibility": "string"
  }
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "category": "string",
  "tags": ["string"],
  "metadata": {
    "author": "string",
    "visibility": "string",
    "created_at": "ISO8601",
    "updated_at": "ISO8601"
  }
}
```

#### Update Article
```http
PUT /articles/{id}
```

Update an existing article.

**Request:**
```json
{
  "title": "string",
  "content": "string",
  "category": "string",
  "tags": ["string"],
  "metadata": {
    "visibility": "string"
  }
}
```

### AI Operations

#### Generate Content
```http
POST /generate
```

Generate article drafts using AI.

**Request:**
```json
{
  "topic": "string",
  "type": "article|summary|faq",
  "parameters": {
    "length": "short|medium|long",
    "style": "technical|casual|formal",
    "target_audience": "string"
  }
}
```

**Response:**
```json
{
  "content": "string",
  "metadata": {
    "generated_at": "ISO8601",
    "model_version": "string",
    "confidence_score": "number"
  },
  "suggestions": {
    "tags": ["string"],
    "category": "string",
    "related_topics": ["string"]
  }
}
```

#### Auto-tag Content
```http
POST /auto-tag
```

Generate tags for content using AI.

**Request:**
```json
{
  "content": "string",
  "parameters": {
    "max_tags": "number",
    "min_confidence": "number"
  }
}
```

**Response:**
```json
{
  "tags": [
    {
      "name": "string",
      "confidence": "number",
      "category": "string"
    }
  ]
}
```

### Analytics

#### Get Usage Stats
```http
GET /analytics/usage
```

Get knowledge base usage statistics.

**Parameters:**
```json
{
  "start_date": "ISO8601",
  "end_date": "ISO8601",
  "metrics": ["searches", "views", "questions"],
  "granularity": "hour|day|week|month"
}
```

**Response:**
```json
{
  "metrics": {
    "searches": {
      "total": "number",
      "timeline": [
        {
          "timestamp": "ISO8601",
          "value": "number"
        }
      ]
    },
    "popular_queries": [
      {
        "query": "string",
        "count": "number"
      }
    ]
  }
}
```

## Webhooks

### Configure Webhook
```http
POST /webhooks
```

Configure webhooks for real-time updates.

**Request:**
```json
{
  "url": "string",
  "events": ["article.created", "article.updated"],
  "secret": "string"
}
```

### Webhook Payload Example
```json
{
  "event": "article.created",
  "timestamp": "ISO8601",
  "data": {
    "article_id": "string",
    "title": "string",
    "category": "string"
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

### Common Error Codes
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## SDKs and Libraries

### JavaScript/TypeScript
```typescript
import { BiasbusterKB } from '@biasbuster/kb-sdk';

const kb = new BiasbusterKB({
  apiKey: 'YOUR_API_KEY'
});

// Semantic search
const results = await kb.search('bias detection methods');

// Ask questions
const answer = await kb.ask('How does bias detection work?');
```

### Python
```python
from biasbuster_kb import BiasbusterKB

kb = BiasbusterKB(api_key='YOUR_API_KEY')

# Semantic search
results = kb.search('bias detection methods')

# Ask questions
answer = kb.ask('How does bias detection work?')
```

## Best Practices

1. **Rate Limiting**
   - Implement exponential backoff
   - Cache frequently accessed content
   - Use bulk operations when possible

2. **Error Handling**
   - Implement retry logic
   - Log all API errors
   - Handle rate limits gracefully

3. **Security**
   - Rotate API keys regularly
   - Use environment variables
   - Validate webhook signatures

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | [Date] | Initial API | 
| 1.1 | [Date] | Added AI endpoints |
