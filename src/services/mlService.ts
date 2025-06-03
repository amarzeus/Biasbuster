import { IAnalysis } from '../models/Analysis';

interface BiasInstance {
    text: string;
    context: string;
    suggestion: string;
}

interface BiasTypeAnalysis {
    score: number;
    instances: BiasInstance[];
}

interface SuggestionMap {
    [category: string]: {
        [word: string]: string;
    };
}

export class MLService {
    private biasCategories = [
        'political',
        'gender',
        'racial',
        'cultural',
        'socioeconomic',
        'religious'
    ];

    private customBiasWords: Map<string, string[]> = new Map();
    
    constructor() {
        this.initializeDefaultBiasWords();
    }

    private initializeDefaultBiasWords() {
        this.customBiasWords.set('political', [
            'radical', 'extremist', 'leftist', 'rightist',
            'communist', 'socialist', 'fascist'
        ]);
        
        this.customBiasWords.set('gender', [
            'mankind', 'chairman', 'policeman', 'stewardess',
            'housewife', 'mailman', 'businessman'
        ]);
        
        this.customBiasWords.set('racial', [
            'colored', 'oriental', 'ethnic', 'urban',
            'ghetto', 'exotic', 'tribal'
        ]);
        
        this.customBiasWords.set('cultural', [
            'primitive', 'uncivilized', 'backward', 'third-world',
            'developing', 'underdeveloped'
        ]);
    }

    public async analyzeBias(text: string, sensitivity: number = 0.5): Promise<any> {
        // Simulate ML analysis with pattern matching
        const biasAnalysis = this.analyzeBiasTypes(text, sensitivity);
        const suggestions = this.generateSuggestionsFromAnalysis(biasAnalysis);
        
        return {
            text,
            overallScore: this.calculateOverallScore(biasAnalysis),
            BiasInstances: this.convertToLegacyFormat(biasAnalysis),
            suggestions,
            timestamp: new Date()
        };
    }

    private analyzeBiasTypes(text: string, sensitivity: number) {
        const biasTypes = new Map<string, BiasTypeAnalysis>();

        this.biasCategories.forEach((category) => {
            const instances = this.findBiasInstances(text, category);
            if (instances.length > 0) {
                const score = Math.min(instances.length * 0.2, 1.0);
                if (score >= sensitivity) {
                    biasTypes.set(category, {
                        score,
                        instances
                    });
                }
            }
        });

        return biasTypes;
    }

    private findBiasInstances(text: string, category: string): BiasInstance[] {
        const instances: BiasInstance[] = [];
        const biasWords = this.customBiasWords.get(category) || [];
        
        for (const word of biasWords) {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            let match;
            
            while ((match = regex.exec(text)) !== null) {
                const start = Math.max(0, match.index - 50);
                const end = Math.min(text.length, match.index + word.length + 50);
                
                instances.push({
                    text: word,
                    context: text.substring(start, end),
                    suggestion: this.getSuggestion(word, category)
                });
            }
        }
        
        return instances;
    }

    private getSuggestion(biasedWord: string, category: string): string {
        const suggestions: SuggestionMap = {
            political: {
                'radical': 'person with strong views',
                'extremist': 'person with extreme views',
                'leftist': 'person with progressive views',
                'rightist': 'person with conservative views',
                'communist': 'person with communist views',
                'socialist': 'person with socialist views',
                'fascist': 'person with authoritarian views'
            },
            gender: {
                'chairman': 'chairperson',
                'policeman': 'police officer',
                'stewardess': 'flight attendant',
                'businessman': 'businessperson',
                'housewife': 'homemaker',
                'mailman': 'mail carrier',
                'mankind': 'humanity'
            },
            racial: {
                'colored': 'person of color',
                'oriental': 'Asian',
                'ethnic': 'from diverse backgrounds',
                'urban': 'city-dwelling',
                'ghetto': 'low-income neighborhood',
                'exotic': 'unique',
                'tribal': 'indigenous'
            },
            cultural: {
                'primitive': 'traditional',
                'uncivilized': 'different cultural practices',
                'backward': 'developing',
                'third-world': 'developing nation',
                'developing': 'emerging economy',
                'underdeveloped': 'developing region'
            }
        };

        return suggestions[category]?.[biasedWord.toLowerCase()] || 
               `Consider using more neutral language instead of "${biasedWord}"`;
    }

    private generateSuggestionsFromAnalysis(biasAnalysis: Map<string, BiasTypeAnalysis>): string[] {
        const suggestions: string[] = [];
        
        biasAnalysis.forEach((analysis, category) => {
            analysis.instances.forEach(instance => {
                suggestions.push(instance.suggestion);
            });
        });
        
        return suggestions;
    }

    private convertToLegacyFormat(biasAnalysis: Map<string, BiasTypeAnalysis>) {
        const instances: any[] = [];
        
        biasAnalysis.forEach((analysis, category) => {
            analysis.instances.forEach(instance => {
                instances.push({
                    type: category,
                    biasedText: instance.text,
                    context: instance.context,
                    explanation: `This word may carry ${category} bias`,
                    suggestion: instance.suggestion,
                    severity: analysis.score > 0.7 ? 'High' : analysis.score > 0.4 ? 'Medium' : 'Low'
                });
            });
        });
        
        return instances;
    }

    private calculateOverallScore(biasAnalysis: Map<string, BiasTypeAnalysis>): number {
        if (biasAnalysis.size === 0) return 0;
        
        let totalScore = 0;
        biasAnalysis.forEach((analysis) => {
            totalScore += analysis.score;
        });
        
        return Math.min(totalScore / biasAnalysis.size, 1.0);
    }

    public updateCustomBiasWords(category: string, words: string[]) {
        this.customBiasWords.set(category, words);
    }

    public getCustomBiasWords(category: string): string[] {
        return this.customBiasWords.get(category) || [];
    }

    public getSupportedCategories(): string[] {
        return this.biasCategories;
    }
}

export const mlService = new MLService();
