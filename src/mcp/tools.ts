import { BiasBusterResponse, AnalysisOptions, BiasInstance } from '../types/biasbuster';

// Bias types and their descriptions
const BIAS_TYPES = {
    POLITICAL: 'Political bias in presenting partisan viewpoints',
    GENDER: 'Gender-based stereotypes or discrimination',
    RACIAL: 'Racial prejudice or stereotyping',
    CULTURAL: 'Cultural insensitivity or ethnocentrism',
    SOCIOECONOMIC: 'Class-based prejudice or economic bias',
    RELIGIOUS: 'Religious prejudice or sectarian bias',
    AGEISM: 'Age-based discrimination or stereotyping',
    CONFIRMATION: 'Selective use of information to confirm existing beliefs'
};

// AI prompt templates (commented out to avoid unused variable warning)
/* const PROMPT_TEMPLATES = {
    BIAS_DETECTION: `
        Analyze the following text for potential bias:
        TEXT: {{text}}
        
        Consider these aspects:
        1. Type of bias (political, gender, racial, etc.)
        2. Severity of bias (1-5 scale)
        3. Impact on readers
        4. Supporting evidence
        5. Suggested improvements
    `,
    MITIGATION: `
        Provide an unbiased alternative to the following text:
        BIASED TEXT: {{text}}
        BIAS TYPE: {{biasType}}
        
        Requirements:
        1. Maintain core message
        2. Remove identified bias
        3. Use neutral language
        4. Preserve factual content
    `
}; */

// Helper function to detect sentence-level bias
function detectSentenceBias(sentence: string, _options?: AnalysisOptions): BiasInstance | null {
    // TODO: Integrate with actual AI model
    // For now, using mock implementation
    const biasTypes = Object.keys(BIAS_TYPES);
    const randomBias = Math.random() > 0.7;

    if (randomBias) {
        const biasType = biasTypes[Math.floor(Math.random() * biasTypes.length)];
        return {
            Sentence: sentence,
            BiasType: biasType,
            Explanation: `Detected ${biasType.toLowerCase()} bias in the text.`,
            Severity: Math.ceil(Math.random() * 5).toString(),
            Justification: `The text shows characteristics of ${biasType.toLowerCase()} bias.`,
            Mitigation: `Consider rephrasing to remove ${biasType.toLowerCase()} bias.`
        };
    }

    return null;
}

// Main analysis function
export async function analyzeBias(text: string, options?: AnalysisOptions): Promise<BiasBusterResponse> {
    // Split text into sentences (basic implementation)
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    // Analyze each sentence
    const biasInstances: BiasInstance[] = [];
    
    for (const sentence of sentences) {
        const bias = detectSentenceBias(sentence.trim(), options);
        if (bias) {
            biasInstances.push(bias);
        }
    }

    // Generate educational content based on found biases
    const uniqueBiasTypes = [...new Set(biasInstances.map(b => b.BiasType))];
    const educationalContent = uniqueBiasTypes
        .map(type => BIAS_TYPES[type as keyof typeof BIAS_TYPES])
        .join('\n\n');

    // Calculate overall bias severity
    const averageSeverity = biasInstances.length > 0
        ? biasInstances.reduce((acc, curr) => acc + parseInt(curr.Severity), 0) / biasInstances.length
        : 0;

    return {
        MainTopic: detectMainTopic(text),
        BiasDetected: biasInstances.length > 0 ? "yes" : "no",
        BiasInstances: biasInstances,
        BiasSummary: generateBiasSummary(biasInstances, averageSeverity),
        TrustedSources: generateTrustedSources([]),
        EducationalContent: educationalContent
    };
}

// Helper function to detect main topic
function detectMainTopic(_text: string): string {
    // TODO: Implement topic detection with AI
    return "General Analysis";
}

// Helper function to generate bias summary
function generateBiasSummary(instances: BiasInstance[], averageSeverity: number): string {
    if (instances.length === 0) {
        return "No significant bias detected in the text.";
    }

    const biasTypes = [...new Set(instances.map(i => i.BiasType))];
    return `Detected ${instances.length} instance(s) of bias, primarily ${biasTypes.join(', ')}. ` +
           `Average severity: ${averageSeverity.toFixed(1)}/5.`;
}

// Helper function to generate trusted sources
function generateTrustedSources(_biasTypes: string[]): string[] {
    // TODO: Implement dynamic trusted sources based on bias types
    return [
        "https://www.mediabiasfactcheck.com/",
        "https://www.allsides.com/unbiased-balanced-news",
        "https://www.poynter.org/media-news/fact-checking/"
    ];
}

export async function analyzeBiasWithFeedback(
    text: string,
    options?: AnalysisOptions,
    _previousFeedback?: any
): Promise<BiasBusterResponse> {
    // TODO: Implement feedback-aware analysis
    return analyzeBias(text, options);
}
