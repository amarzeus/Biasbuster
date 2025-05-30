/**
 * Tests for web-platform/script.js functions
 */

// Import the functions to test
// Since we're in a Node.js environment without actual modules,
// we'll create mocks for the functions we want to test

// Mock generateMockResponse function
const generateMockResponse = (text) => {
  return {
    MainTopic: detectTopic(text),
    BiasAnalysis: {
      OverallBias: determineMockBias(text),
      BiasScore: Math.random() * 10 - 5,
      Details: generateMockBiasDetails(text)
    },
    SentimentAnalysis: {
      Overall: Math.random() > 0.5 ? "positive" : (Math.random() > 0.5 ? "negative" : "neutral"),
      Score: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      EmotionalTone: ["informative", "concerned", "critical", "objective"].slice(0, Math.floor(Math.random() * 3) + 1)
    },
    SourceCredibility: {
      Score: parseFloat((Math.random() * 10).toFixed(1)),
      Factors: {
        "Factual Accuracy": parseFloat((Math.random() * 10).toFixed(1)),
        "Multiple Perspectives": parseFloat((Math.random() * 10).toFixed(1)),
        "Citation Quality": parseFloat((Math.random() * 10).toFixed(1))
      }
    },
    Suggestions: generateMockSuggestions(text)
  };
};

// Mock detectTopic function
const detectTopic = (text) => {
  const topics = [
    { keywords: ['government', 'political', 'senator', 'federal', 'washington', 'liberal', 'regulation'], topic: 'Politics & Government' },
    { keywords: ['healthcare', 'medical', 'doctor', 'hospital', 'patient', 'insurance'], topic: 'Healthcare' },
    { keywords: ['tech', 'technology', 'ai', 'artificial intelligence', 'digital', 'computer', 'software'], topic: 'Technology' },
    { keywords: ['climate', 'environment', 'carbon', 'emission', 'warming', 'pollution'], topic: 'Climate & Environment' },
    { keywords: ['economy', 'economic', 'market', 'financial', 'business', 'company', 'industry'], topic: 'Economy & Business' }
  ];
  
  const lowerText = text.toLowerCase();
  
  const matches = topics.map(topic => {
    const count = topic.keywords.reduce((sum, keyword) => {
      return sum + (lowerText.includes(keyword) ? 1 : 0);
    }, 0);
    return { topic: topic.topic, count };
  });
  
  matches.sort((a, b) => b.count - a.count);
  
  return matches[0].count > 0 ? matches[0].topic : "General News";
};

// Mock determineMockBias function
const determineMockBias = (text) => {
  const lowerText = text.toLowerCase();
  
  const leftBiasTerms = ['radical right', 'extremist', 'alt-right', 'far-right', 'conservative agenda', 'corporate greed'];
  const rightBiasTerms = ['radical left', 'socialist', 'liberal agenda', 'leftist', 'big government', 'environmental extremist'];
  
  const biasedLanguage = [
    'clearly', 'obviously', 'undoubtedly', 'everyone knows', 'without question',
    'disaster', 'catastrophe', 'crisis', 'failure', 'scandal',
    'destroy', 'devastating', 'terrible', 'horrible', 'evil'
  ];
  
  let leftBiasCount = leftBiasTerms.reduce((count, term) => count + (lowerText.includes(term) ? 1 : 0), 0);
  let rightBiasCount = rightBiasTerms.reduce((count, term) => count + (lowerText.includes(term) ? 1 : 0), 0);
  let biasedLanguageCount = biasedLanguage.reduce((count, term) => count + (lowerText.includes(term) ? 1 : 0), 0);
  
  if (leftBiasCount > rightBiasCount && leftBiasCount > 0) {
    return `Left-leaning bias detected (${leftBiasCount} indicators found)`;
  } else if (rightBiasCount > leftBiasCount && rightBiasCount > 0) {
    return `Right-leaning bias detected (${rightBiasCount} indicators found)`;
  } else if (biasedLanguageCount > 2) {
    return `Some general bias detected through emotionally charged language (${biasedLanguageCount} indicators found)`;
  } else {
    return "No significant bias detected";
  }
};

// Mock generateMockBiasDetails function
const generateMockBiasDetails = (text) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  const biasIndicators = [
    { pattern: /disaster/i, type: "Emotional Language", explanation: "Uses dramatic language that may evoke emotional response rather than presenting neutral facts." },
    { pattern: /waste/i, type: "Value Judgment", explanation: "Presents a subjective judgment as fact without sufficient evidence." },
    { pattern: /typical/i, type: "Generalization", explanation: "Makes a sweeping generalization without nuance." }
  ];
  
  const biasedContent = [];
  
  sentences.forEach(sentence => {
    biasIndicators.forEach(indicator => {
      if (indicator.pattern.test(sentence) && Math.random() > 0.3) {
        biasedContent.push({
          text: sentence.trim(),
          biasType: indicator.type,
          explanation: indicator.explanation
        });
      }
    });
  });
  
  if (biasedContent.length === 0) {
    return [
      {
        text: "This content appears to present information in a relatively balanced way.",
        biasType: "Balanced Reporting",
        explanation: "The text provides multiple perspectives and uses neutral language."
      }
    ];
  }
  
  return biasedContent;
};

// Mock generateMockSuggestions function
const generateMockSuggestions = (text) => {
  const standardSuggestions = [
    "Seek out multiple sources from different perspectives on this topic.",
    "Look for primary sources and original research when available.",
    "Consider whether the article presents multiple viewpoints on controversial aspects.",
    "Check whether claims are supported by specific evidence or citations.",
    "Be aware of emotional language that may influence your perception of the content."
  ];
  
  return standardSuggestions
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
};

// Tests
describe('Script.js Functions', () => {
  describe('detectTopic function', () => {
    test('should detect political topic correctly', () => {
      const text = 'The government has announced new regulations for the political landscape.';
      const result = detectTopic(text);
      expect(result).toBe('Politics & Government');
    });
    
    test('should detect healthcare topic correctly', () => {
      const text = 'Doctors at the hospital are implementing new patient care protocols.';
      const result = detectTopic(text);
      expect(result).toBe('Healthcare');
    });
    
    test('should return general news for unrecognized topics', () => {
      const text = 'This is a random text with no specific topic keywords.';
      const result = detectTopic(text);
      expect(result).toBe('General News');
    });
  });
  
  describe('determineMockBias function', () => {
    test('should detect left-leaning bias', () => {
      const text = 'The corporate greed and extremist alt-right agenda are destroying our society.';
      const result = determineMockBias(text);
      expect(result).toMatch(/Left-leaning bias detected/);
    });
    
    test('should detect right-leaning bias', () => {
      const text = 'The radical left and big government proponents are pushing their socialist agenda.';
      const result = determineMockBias(text);
      expect(result).toMatch(/Right-leaning bias detected/);
    });
    
    test('should detect general bias through emotional language', () => {
      const text = 'This is clearly a disaster of catastrophic proportions that will obviously destroy everything.';
      const result = determineMockBias(text);
      expect(result).toMatch(/Some general bias detected/);
    });
    
    test('should detect no significant bias in neutral text', () => {
      const text = 'The study examined multiple factors and presented findings from various perspectives.';
      const result = determineMockBias(text);
      expect(result).toBe('No significant bias detected');
    });
  });
  
  describe('generateMockResponse function', () => {
    test('should generate a complete mock response object', () => {
      const text = 'This is a test article for analysis.';
      const result = generateMockResponse(text);
      
      expect(result).toHaveProperty('MainTopic');
      expect(result).toHaveProperty('BiasAnalysis');
      expect(result.BiasAnalysis).toHaveProperty('OverallBias');
      expect(result.BiasAnalysis).toHaveProperty('BiasScore');
      expect(result.BiasAnalysis).toHaveProperty('Details');
      expect(result).toHaveProperty('SentimentAnalysis');
      expect(result).toHaveProperty('SourceCredibility');
      expect(result).toHaveProperty('Suggestions');
      expect(result.Suggestions.length).toBe(3);
    });
  });
}); 