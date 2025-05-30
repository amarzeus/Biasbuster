/**
 * JavaScript-based analysis service for Biasbuster
 * This service provides bias analysis without any external dependencies
 */
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Interface for bias analysis results
 */
export interface BiasAnalysisResult {
  MainTopic: string;
  BiasDetected: string;
  BiasInstances: Array<{
    Sentence: string;
    BiasType: string;
    Explanation: string;
    Severity: string;
    Justification: string;
    Mitigation: string;
  }>;
  BiasSummary: string;
  TrustedSources: string[];
  EducationalContent: string;
  Visualizations?: {
    BiasDistribution?: {
      categories: string[];
      values: number[];
    };
    SentimentOverTime?: {
      sections: string[];
      sentiment: number[];
    };
    TopBiasedPhrases?: string[];
  };
}

/**
 * Service to perform bias analysis
 */
export class BiasAnalysisService {
  private customBiasPatterns: Map<string, { 
    regex: RegExp, 
    biasType: string,
    severity: string,
    explanation: string 
  }> = new Map();

  /**
   * Create a new instance of the analysis service
   */
  constructor() {
    console.log('JavaScript-based analysis service initialized');
    this.initializeDefaultBiasPatterns();
  }
  
  /**
   * Initialize default bias detection patterns
   */
  private initializeDefaultBiasPatterns() {
    // Loaded language
    this.addBiasPattern(
      'loaded_language_extreme',
      /\b(outrageous|scandalous|shocking|radical|disgraceful|catastrophic|devastating|disastrous)\b/i,
      'loaded_language',
      '3',
      'Uses extreme, emotionally charged language that may unduly influence the reader'
    );
    
    this.addBiasPattern(
      'loaded_language_moderate',
      /\b(controversial|concerning|problematic|troubling|disturbing|alarming)\b/i,
      'loaded_language',
      '2',
      'Uses moderately charged language that may influence reader perception'
    );
    
    // Political bias indicators
    this.addBiasPattern(
      'political_bias_left',
      /\b(progressive agenda|social justice|economic equality|climate crisis)\b/i,
      'political_bias',
      '2',
      'Uses terminology commonly associated with progressive or left-leaning perspectives'
    );
    
    this.addBiasPattern(
      'political_bias_right',
      /\b(fiscal responsibility|traditional values|government overreach|job creators)\b/i,
      'political_bias',
      '2',
      'Uses terminology commonly associated with conservative or right-leaning perspectives'
    );
    
    // Framing bias
    this.addBiasPattern(
      'framing_bias',
      /\b(allegedly|claimed|purported|so-called)\b/i,
      'framing_bias',
      '1',
      'Uses language that frames information in a way that questions credibility'
    );
    
    // Appeal to emotion
    this.addBiasPattern(
      'appeal_to_emotion',
      /\b(heartbreaking|inspiring|devastating|tragic|touching|uplifting)\b/i,
      'emotional_appeal',
      '2',
      'Appeals to emotions rather than facts or logic'
    );
    
    // Generalization
    this.addBiasPattern(
      'generalization',
      /\b(all|every|always|never|nobody|everybody|undoubtedly|certainly|definitely)\b/i,
      'generalization',
      '2',
      'Uses absolute terms that oversimplify complex issues'
    );
  }
  
  /**
   * Add a custom bias detection pattern
   * @param id Unique identifier for this pattern
   * @param regex Regular expression to match
   * @param biasType Classification of bias type
   * @param severity Severity level (1-3)
   * @param explanation Description of why this indicates bias
   */
  public addBiasPattern(
    id: string, 
    regex: RegExp, 
    biasType: string, 
    severity: string, 
    explanation: string
  ) {
    this.customBiasPatterns.set(id, {
      regex,
      biasType,
      severity,
      explanation
    });
  }
  
  /**
   * Remove a custom bias pattern by ID
   * @param id The pattern ID to remove
   * @returns true if pattern was removed, false if not found
   */
  public removeBiasPattern(id: string): boolean {
    return this.customBiasPatterns.delete(id);
  }
  
  /**
   * Get all custom bias patterns
   * @returns The map of custom patterns
   */
  public getCustomPatterns(): Map<string, { 
    regex: RegExp, 
    biasType: string,
    severity: string,
    explanation: string 
  }> {
    return this.customBiasPatterns;
  }
  
  /**
   * Reset all custom patterns to defaults
   */
  public resetToDefaultPatterns() {
    this.customBiasPatterns.clear();
    this.initializeDefaultBiasPatterns();
  }
  
  /**
   * Check if the service is available
   * @returns Promise resolving to true as service is always available
   */
  public async checkHealth(): Promise<boolean> {
    return true;
  }
  
  /**
   * Analyze text for bias using JavaScript implementation
   * @param text The text to analyze
   * @returns Promise resolving to the analysis result
   */
  public async analyzeBias(text: string): Promise<BiasAnalysisResult> {
    try {
      // Split into sentences for analysis
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      
      const biasInstances: Array<{
        Sentence: string;
        BiasType: string;
        Explanation: string;
        Severity: string;
        Justification: string;
        Mitigation: string;
      }> = [];
      
      // Track bias types for visualization
      const biasTypeCount: Record<string, number> = {};
      
      // Analyze each sentence for bias patterns
      sentences.forEach((sentence, index) => {
        // Add period to make it a complete sentence again
        const completeSentence = sentence.trim() + '.';
        
        // Check against all bias patterns
        this.customBiasPatterns.forEach((pattern, id) => {
          if (pattern.regex.test(completeSentence)) {
            // Count bias types for visualization
            biasTypeCount[pattern.biasType] = (biasTypeCount[pattern.biasType] || 0) + 1;
            
            // Add to bias instances
            biasInstances.push({
              Sentence: completeSentence,
              BiasType: pattern.biasType,
              Explanation: pattern.explanation,
              Severity: pattern.severity,
              Justification: `Contains language patterns that suggest ${pattern.biasType}`,
              Mitigation: this.generateMitigation(pattern.biasType)
            });
          }
        });
      });
      
      // Extract main topic (simplified implementation)
      const mainTopic = this.extractMainTopic(text);
      
      // Generate visualizations
      const visualizations = this.generateVisualizations(biasInstances, biasTypeCount, text);
      
      // Create bias summary
      const biasSummary = this.generateBiasSummary(biasInstances, biasTypeCount);
      
      return {
        MainTopic: mainTopic,
        BiasDetected: biasInstances.length > 0 ? "yes" : "no",
        BiasInstances: biasInstances,
        BiasSummary: biasSummary,
        TrustedSources: [],
        EducationalContent: "Bias in media can influence perception. Being aware of biased language helps maintain critical thinking.",
        Visualizations: visualizations
      };
    } catch (error) {
      console.error('Error in bias analysis:', error);
      throw new Error('Failed to analyze text');
    }
  }
  
  /**
   * Extract the main topic from the text
   * @param text The text to analyze
   * @returns The extracted main topic
   */
  private extractMainTopic(text: string): string {
    // Simplified topic extraction - would be more sophisticated in production
    const commonTopics = [
      'Politics', 'Economy', 'Technology', 'Health', 'Environment', 
      'Education', 'Sports', 'Entertainment', 'Science', 'International'
    ];
    
    const topicKeywords: Record<string, string[]> = {
      'Politics': ['government', 'election', 'political', 'policy', 'president', 'congress', 'senate', 'democrat', 'republican'],
      'Economy': ['economy', 'economic', 'market', 'stock', 'financial', 'trade', 'budget', 'inflation', 'recession'],
      'Technology': ['technology', 'tech', 'digital', 'software', 'hardware', 'internet', 'ai', 'app', 'data'],
      'Health': ['health', 'medical', 'disease', 'patient', 'doctor', 'hospital', 'treatment', 'vaccine', 'medicine'],
      'Environment': ['environment', 'climate', 'environmental', 'pollution', 'carbon', 'renewable', 'sustainability'],
      'Education': ['education', 'school', 'student', 'teacher', 'university', 'college', 'academic', 'learning'],
      'Sports': ['sport', 'team', 'player', 'game', 'championship', 'tournament', 'coach', 'athlete', 'win'],
      'Entertainment': ['entertainment', 'movie', 'film', 'music', 'celebrity', 'actor', 'actress', 'television', 'tv'],
      'Science': ['science', 'scientific', 'research', 'discovery', 'study', 'experiment', 'researcher', 'laboratory'],
      'International': ['international', 'global', 'world', 'foreign', 'country', 'nation', 'treaty', 'diplomatic']
    };
    
    // Count keyword occurrences for each topic
    const topicScores: Record<string, number> = {};
    const lowerText = text.toLowerCase();
    
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      topicScores[topic] = keywords.reduce((score, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = lowerText.match(regex);
        return score + (matches ? matches.length : 0);
      }, 0);
    });
    
    // Find topic with highest score
    let highestScore = 0;
    let mainTopic = 'General';
    
    Object.entries(topicScores).forEach(([topic, score]) => {
      if (score > highestScore) {
        highestScore = score;
        mainTopic = topic;
      }
    });
    
    return mainTopic;
  }
  
  /**
   * Generate mitigation strategies based on bias type
   * @param biasType The type of bias detected
   * @returns Suggested mitigation strategy
   */
  private generateMitigation(biasType: string): string {
    const mitigations: Record<string, string> = {
      'loaded_language': 'Replace emotionally charged language with more neutral terms',
      'political_bias': 'Include diverse political perspectives or use more politically neutral language',
      'framing_bias': 'Present information without framing that implies a particular perspective',
      'emotional_appeal': 'Focus on facts and evidence rather than emotional appeals',
      'generalization': 'Avoid absolute statements and acknowledge exceptions or nuance'
    };
    
    return mitigations[biasType] || 'Consider using more balanced and neutral language';
  }
  
  /**
   * Generate bias summary based on detected instances
   * @param biasInstances Detected bias instances
   * @param biasTypeCount Count of each bias type
   * @returns Summary text
   */
  private generateBiasSummary(
    biasInstances: Array<any>,
    biasTypeCount: Record<string, number>
  ): string {
    if (biasInstances.length === 0) {
      return "No significant bias detected in the initial analysis.";
    }
    
    // Get the most common bias types
    const sortedBiasTypes = Object.entries(biasTypeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(entry => entry[0]);
    
    // Count high severity instances
    const highSeverityCount = biasInstances.filter(instance => 
      parseInt(instance.Severity) >= 3
    ).length;
    
    let severityLevel = 'minimal';
    if (biasInstances.length > 10 || highSeverityCount > 0) {
      severityLevel = 'significant';
    } else if (biasInstances.length > 5) {
      severityLevel = 'moderate';
    } else if (biasInstances.length > 0) {
      severityLevel = 'mild';
    }
    
    // Generate summary
    let summary = `The text contains ${severityLevel} bias, primarily in the form of `;
    
    if (sortedBiasTypes.length > 1) {
      summary += `${sortedBiasTypes[0]} and ${sortedBiasTypes[1]}.`;
    } else if (sortedBiasTypes.length === 1) {
      summary += `${sortedBiasTypes[0]}.`;
    } else {
      summary += 'various bias types.';
    }
    
    summary += ` ${biasInstances.length} instances of potentially biased language were identified.`;
    
    if (highSeverityCount > 0) {
      summary += ` ${highSeverityCount} of these are high severity instances that may significantly impact reader perception.`;
    }
    
    return summary;
  }
  
  /**
   * Generate visualizations for the analysis results
   * @param biasInstances Detected bias instances
   * @param biasTypeCount Count of each bias type
   * @param text Original text
   * @returns Visualization data
   */
  private generateVisualizations(
    biasInstances: Array<any>,
    biasTypeCount: Record<string, number>,
    text: string
  ): BiasAnalysisResult['Visualizations'] {
    // Bias distribution by type
    const categories = Object.keys(biasTypeCount);
    const values = categories.map(category => biasTypeCount[category]);
    
    // Simplified sentiment analysis over text sections
    const sections = ['Beginning', 'Middle', 'End'];
    const sentiment = this.calculateSentimentOverSections(text, 3);
    
    // Extract top biased phrases
    const topBiasedPhrases = biasInstances
      .sort((a, b) => parseInt(b.Severity) - parseInt(a.Severity))
      .slice(0, 5)
      .map(instance => {
        const phrase = instance.Sentence.length > 60 
          ? instance.Sentence.substring(0, 57) + '...' 
          : instance.Sentence;
        return phrase;
      });
    
    return {
      BiasDistribution: {
        categories,
        values
      },
      SentimentOverTime: {
        sections,
        sentiment
      },
      TopBiasedPhrases: topBiasedPhrases
    };
  }
  
  /**
   * Simple sentiment analysis over text sections
   * @param text Text to analyze
   * @param sectionCount Number of sections to divide text into
   * @returns Array of sentiment scores
   */
  private calculateSentimentOverSections(text: string, sectionCount: number): number[] {
    // This is a very simplified sentiment implementation
    // In production, would use a proper sentiment analysis library
    const positiveWords = [
      'good', 'great', 'excellent', 'positive', 'happy', 'best', 'better',
      'success', 'successful', 'benefit', 'beneficial', 'improve', 'improved'
    ];
    
    const negativeWords = [
      'bad', 'terrible', 'awful', 'negative', 'sad', 'worst', 'worse',
      'failure', 'failed', 'harm', 'harmful', 'damage', 'damaged'
    ];
    
    // Split text into sections
    const words = text.split(/\s+/);
    const sectionSize = Math.ceil(words.length / sectionCount);
    const sections = [];
    
    for (let i = 0; i < words.length; i += sectionSize) {
      sections.push(words.slice(i, i + sectionSize).join(' '));
    }
    
    // Calculate sentiment for each section
    return sections.map(section => {
      const lowerSection = section.toLowerCase();
      
      let positiveScore = 0;
      let negativeScore = 0;
      
      positiveWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = lowerSection.match(regex);
        if (matches) positiveScore += matches.length;
      });
      
      negativeWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = lowerSection.match(regex);
        if (matches) negativeScore += matches.length;
      });
      
      // Return sentiment score between -1 and 1
      if (positiveScore === 0 && negativeScore === 0) return 0;
      return (positiveScore - negativeScore) / (positiveScore + negativeScore);
    });
  }
}

// Export a singleton instance
export default new BiasAnalysisService(); 