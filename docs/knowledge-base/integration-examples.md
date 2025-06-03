# Knowledge Base Integration Examples

This guide provides practical examples and starter templates for integrating the Biasbuster Knowledge Base into various applications and platforms.

## Quick Start Templates

### 1. React Web Application

```typescript
// src/components/KnowledgeBase/Search.tsx
import React, { useState } from 'react';
import { BiasbusterKB } from '@biasbuster/kb-sdk';

const kb = new BiasbusterKB({
  apiKey: process.env.REACT_APP_KB_API_KEY
});

export const KBSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const searchResults = await kb.search(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kb-search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search knowledge base..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      <div className="results">
        {results.map((result) => (
          <div key={result.id} className="result-item">
            <h3>{result.title}</h3>
            <p>{result.content}</p>
            <div className="tags">
              {result.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 2. AI Chatbot Integration

```typescript
// src/services/chatbot.ts
import { BiasbusterKB } from '@biasbuster/kb-sdk';
import { OpenAI } from 'openai';

export class KBChatbot {
  private kb: BiasbusterKB;
  private openai: OpenAI;

  constructor() {
    this.kb = new BiasbusterKB({
      apiKey: process.env.KB_API_KEY
    });
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async handleMessage(message: string): Promise<string> {
    // Search knowledge base
    const kbResults = await this.kb.search(message);
    
    // Generate context from results
    const context = kbResults
      .map(r => r.content)
      .join('\n\n')
      .slice(0, 2000); // Limit context length
    
    // Generate response using GPT-4
    const completion = await this.openai.createCompletion({
      model: 'gpt-4',
      prompt: `
        Context from knowledge base:
        ${context}
        
        User question:
        ${message}
        
        Please provide a helpful response based on the context:
      `,
      max_tokens: 500,
      temperature: 0.7
    });
    
    return completion.choices[0].text;
  }
}
```

### 3. Slack Integration

```typescript
// src/integrations/slack.ts
import { App } from '@slack/bolt';
import { BiasbusterKB } from '@biasbuster/kb-sdk';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const kb = new BiasbusterKB({
  apiKey: process.env.KB_API_KEY
});

// Handle /kb-search command
app.command('/kb-search', async ({ command, ack, say }) => {
  await ack();
  
  try {
    const results = await kb.search(command.text);
    
    const blocks = results.map(result => ({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${result.title}*\n${result.content}`
      }
    }));
    
    await say({
      blocks,
      text: `Search results for "${command.text}"`
    });
  } catch (error) {
    await say(`Error: ${error.message}`);
  }
});

// Handle /kb-ask command
app.command('/kb-ask', async ({ command, ack, say }) => {
  await ack();
  
  try {
    const answer = await kb.ask(command.text);
    
    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: answer
          }
        }
      ],
      text: answer
    });
  } catch (error) {
    await say(`Error: ${error.message}`);
  }
});
```

### 4. Chrome Extension

```typescript
// src/background.ts
import { BiasbusterKB } from '@biasbuster/kb-sdk';

const kb = new BiasbusterKB({
  apiKey: process.env.KB_API_KEY
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'KB_SEARCH') {
    kb.search(request.query)
      .then(results => sendResponse({ results }))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Keep the message channel open
  }
});

// popup.tsx
import React, { useState } from 'react';

export const Popup: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    chrome.runtime.sendMessage(
      { type: 'KB_SEARCH', query },
      (response) => {
        if (response.results) {
          setResults(response.results);
        }
      }
    );
  };

  return (
    <div className="popup">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search KB</button>
      <div className="results">
        {results.map(result => (
          <div key={result.id}>{result.title}</div>
        ))}
      </div>
    </div>
  );
};
```

### 5. API Webhook Handler

```typescript
// src/webhooks/kb-handler.ts
import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// Verify webhook signature
const verifySignature = (
  signature: string,
  body: string,
  secret: string
): boolean => {
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return signature === hmac;
};

router.post('/kb-webhook', (req, res) => {
  const signature = req.headers['x-kb-signature'];
  
  if (!verifySignature(signature, JSON.stringify(req.body), process.env.KB_WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const { event, data } = req.body;
  
  switch (event) {
    case 'article.created':
      handleNewArticle(data);
      break;
    case 'article.updated':
      handleArticleUpdate(data);
      break;
    default:
      console.log(`Unhandled event type: ${event}`);
  }
  
  res.json({ status: 'ok' });
});

async function handleNewArticle(data: any) {
  // Process new article
  console.log('New article created:', data.article_id);
  // Add to search index, notify users, etc.
}

async function handleArticleUpdate(data: any) {
  // Process article update
  console.log('Article updated:', data.article_id);
  // Update search index, notify subscribers, etc.
}

export default router;
```

### 6. Next.js Integration

```typescript
// pages/kb/search.tsx
import { GetServerSideProps } from 'next';
import { BiasbusterKB } from '@biasbuster/kb-sdk';

interface Props {
  results: any[];
  query: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { query } = context.query;
  
  if (!query) {
    return {
      props: {
        results: [],
        query: ''
      }
    };
  }
  
  const kb = new BiasbusterKB({
    apiKey: process.env.KB_API_KEY
  });
  
  try {
    const results = await kb.search(query as string);
    return {
      props: {
        results,
        query: query as string
      }
    };
  } catch (error) {
    console.error('KB search failed:', error);
    return {
      props: {
        results: [],
        query: query as string
      }
    };
  }
};

const SearchPage: React.FC<Props> = ({ results, query }) => {
  return (
    <div className="kb-search-page">
      <h1>Knowledge Base Search</h1>
      <form action="/kb/search" method="GET">
        <input
          type="text"
          name="query"
          defaultValue={query}
          placeholder="Search..."
        />
        <button type="submit">Search</button>
      </form>
      <div className="results">
        {results.map((result) => (
          <div key={result.id} className="result-card">
            <h2>{result.title}</h2>
            <p>{result.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
```

## Best Practices

### 1. Error Handling
```typescript
const handleKBError = (error: any) => {
  if (error.response) {
    switch (error.response.status) {
      case 429:
        // Handle rate limiting
        return new Error('Too many requests. Please try again later.');
      case 401:
        // Handle authentication errors
        return new Error('Authentication failed. Please check your API key.');
      default:
        return new Error('An unexpected error occurred.');
    }
  }
  return error;
};
```

### 2. Caching
```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

const getCachedResults = async (query: string) => {
  const cacheKey = `kb_search_${query}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // If not in cache, fetch from API
  const results = await kb.search(query);
  
  // Store in cache
  cache.set(cacheKey, results);
  
  return results;
};
```

### 3. Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const kbLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

app.use('/api/kb', kbLimiter);
```

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | [Date] | Initial examples |
| 1.1 | [Date] | Added Next.js integration |
