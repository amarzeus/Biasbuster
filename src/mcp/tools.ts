import { BiasBusterResponse } from '../services/aiService';
import { analyzeBias } from '../tools/analyzeBias';

/**
 * MCP Tool Context type
 */
interface ToolContext {
  userId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}

/**
 * Base Tool Request type
 */
interface BaseToolRequest {
  [key: string]: any;
}

/**
 * Base Tool Response type
 */
interface BaseToolResponse {
  success: boolean;
  message: string;
  metadata?: Record<string, any>;
  [key: string]: any;
}

/**
 * Bias Analysis Tool Request
 */
interface BiasAnalysisRequest extends BaseToolRequest {
  articleText: string;
  options?: {
    includeSentiment?: boolean;
    includeCredibility?: boolean;
    preferredModel?: string;
    language?: string;
    maxTokens?: number;
  };
}

/**
 * Bias Analysis Tool Response
 */
interface BiasAnalysisResponse extends BaseToolResponse {
  analysis: BiasBusterResponse;
}

/**
 * Perspective Analysis Tool Request
 */
interface PerspectiveAnalysisRequest extends BaseToolRequest {
  articleText: string;
  topic?: string;
  viewpoints?: string[];
}

/**
 * Perspective Analysis Tool Response
 */
interface PerspectiveAnalysisResponse extends BaseToolResponse {
  perspectives: Array<{
    viewpoint: string;
    summary: string;
    keyPoints: string[];
    potentialBiases: string[];
  }>;
}

/**
 * Code Analysis Tool Request
 */
interface CodeAnalysisRequest extends BaseToolRequest {
  codeText: string;
  language: string;
  checkForBias?: boolean;
}

/**
 * Code Analysis Tool Response
 */
interface CodeAnalysisResponse extends BaseToolResponse {
  analysis: {
    biasDetected: boolean;
    biasInstances: Array<{
      line: number;
      code: string;
      biasType: string;
      explanation: string;
      recommendation: string;
    }>;
    summary: string;
    bestPractices: string[];
  };
}

/**
 * Document Annotation Tool Request
 */
interface DocumentAnnotationRequest extends BaseToolRequest {
  documentText: string;
  annotationType: 'bias' | 'sentiment' | 'claims' | 'sources';
}

/**
 * Document Annotation Tool Response
 */
interface DocumentAnnotationResponse extends BaseToolResponse {
  annotations: Array<{
    startIndex: number;
    endIndex: number;
    type: string;
    text: string;
    notes: string;
  }>;
}

/**
 * Analyze article text for bias
 */
export async function biasAnalysisTool(
  context: ToolContext,
  request: BiasAnalysisRequest
): Promise<BiasAnalysisResponse> {
  try {
    const { articleText, options } = request;
    
    if (!articleText) {
      return {
        success: false,
        message: "Missing required field: articleText",
        analysis: {} as BiasBusterResponse
      };
    }
    
    // Call the analyzeBias function
    const result = await analyzeBias(articleText, options);
    
    return {
      success: true,
      message: "Bias analysis complete",
      analysis: result,
      metadata: {
        requestId: context.requestId,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error: any) {
    console.error('Error in bias analysis tool:', error);
    return {
      success: false,
      message: `Analysis failed: ${error.message}`,
      analysis: {} as BiasBusterResponse,
      metadata: {
        requestId: context.requestId,
        timestamp: new Date().toISOString(),
        error: error.message
      }
    };
  }
}

/**
 * Analyze code for potential bias in variable names, comments, or algorithms
 */
export async function codeAnalysisTool(
  context: ToolContext,
  request: CodeAnalysisRequest
): Promise<CodeAnalysisResponse> {
  try {
    const { codeText, language, checkForBias = true } = request;
    
    if (!codeText) {
      return {
        success: false,
        message: "Missing required field: codeText",
        analysis: {
          biasDetected: false,
          biasInstances: [],
          summary: "",
          bestPractices: []
        }
      };
    }
    
    // This is a placeholder - in a real implementation, we would analyze the code
    // using specialized algorithms or AI models trained for code analysis
    const mockAnalysis = {
      biasDetected: false,
      biasInstances: [],
      summary: "Code analysis complete. No bias detected in the provided code.",
      bestPractices: [
        "Use inclusive variable naming",
        "Consider accessibility in UI components",
        "Document assumptions in algorithms"
      ]
    };
    
    // For demo purposes, if checkForBias is true and the code contains certain keywords,
    // we'll simulate finding bias
    if (checkForBias) {
      const biasKeywords = [
        'blacklist', 'whitelist', 'master', 'slave', 'guys', 'manpower',
        'mankind', 'manmade', 'chairman', 'policeman', 'fireman'
      ];
      
      const lines = codeText.split('\n');
      let lineNumber = 0;
      
      for (const line of lines) {
        lineNumber++;
        for (const keyword of biasKeywords) {
          if (line.toLowerCase().includes(keyword)) {
            mockAnalysis.biasDetected = true;
            mockAnalysis.biasInstances.push({
              line: lineNumber,
              code: line.trim(),
              biasType: "Terminology bias",
              explanation: `The term '${keyword}' may be considered non-inclusive language.`,
              recommendation: `Consider using more inclusive alternatives.`
            });
          }
        }
      }
      
      if (mockAnalysis.biasDetected) {
        mockAnalysis.summary = "Potential bias detected in code terminology. See recommendations for more inclusive alternatives.";
      }
    }
    
    return {
      success: true,
      message: "Code analysis complete",
      analysis: mockAnalysis,
      metadata: {
        requestId: context.requestId,
        timestamp: new Date().toISOString(),
        language
      }
    };
  } catch (error: any) {
    console.error('Error in code analysis tool:', error);
    return {
      success: false,
      message: `Code analysis failed: ${error.message}`,
      analysis: {
        biasDetected: false,
        biasInstances: [],
        summary: "",
        bestPractices: []
      },
      metadata: {
        requestId: context.requestId,
        timestamp: new Date().toISOString(),
        error: error.message
      }
    };
  }
}

/**
 * Analyze text from multiple perspectives or viewpoints
 */
export async function perspectiveAnalysisTool(
  context: ToolContext,
  request: PerspectiveAnalysisRequest
): Promise<PerspectiveAnalysisResponse> {
  try {
    const { articleText, topic, viewpoints = ['liberal', 'conservative', 'neutral'] } = request;
    
    if (!articleText) {
      return {
        success: false,
        message: "Missing required field: articleText",
        perspectives: []
      };
    }
    
    // This is a placeholder - in a real implementation, we would analyze the text
    // from different perspectives using specialized AI models
    const mockPerspectives = viewpoints.map(viewpoint => {
      return {
        viewpoint,
        summary: `Analysis from ${viewpoint} perspective: This is a placeholder summary.`,
        keyPoints: [
          "Key point 1 from this perspective",
          "Key point 2 from this perspective",
          "Key point 3 from this perspective"
        ],
        potentialBiases: [
          "Potential bias 1 from this perspective",
          "Potential bias 2 from this perspective"
        ]
      };
    });
    
    return {
      success: true,
      message: "Perspective analysis complete",
      perspectives: mockPerspectives,
      metadata: {
        requestId: context.requestId,
        timestamp: new Date().toISOString(),
        topic: topic || "Not specified"
      }
    };
  } catch (error: any) {
    console.error('Error in perspective analysis tool:', error);
    return {
      success: false,
      message: `Perspective analysis failed: ${error.message}`,
      perspectives: [],
      metadata: {
        requestId: context.requestId,
        timestamp: new Date().toISOString(),
        error: error.message
      }
    };
  }
}

/**
 * Annotate a document with bias, sentiment, or source information
 */
export async function documentAnnotationTool(
  context: ToolContext,
  request: DocumentAnnotationRequest
): Promise<DocumentAnnotationResponse> {
  try {
    const { documentText, annotationType } = request;
    
    if (!documentText) {
      return {
        success: false,
        message: "Missing required field: documentText",
        annotations: []
      };
    }
    
    // This is a placeholder - in a real implementation, we would analyze the document
    // and create appropriate annotations based on the requested type
    const mockAnnotations = [];
    
    // Create some example annotations based on the type
    if (annotationType === 'bias') {
      // Find some sentences and create bias annotations
      const sentences = documentText.match(/[^.!?]+[.!?]+/g) || [];
      for (let i = 0; i < Math.min(3, sentences.length); i++) {
        const sentence = sentences[i];
        const startIndex = documentText.indexOf(sentence);
        mockAnnotations.push({
          startIndex,
          endIndex: startIndex + sentence.length,
          type: 'bias',
          text: sentence.trim(),
          notes: `Example bias annotation ${i+1}`
        });
      }
    } else if (annotationType === 'sentiment') {
      // Create sentiment annotations
      const paragraphs = documentText.split('\n\n');
      for (let i = 0; i < Math.min(2, paragraphs.length); i++) {
        const paragraph = paragraphs[i];
        const startIndex = documentText.indexOf(paragraph);
        mockAnnotations.push({
          startIndex,
          endIndex: startIndex + paragraph.length,
          type: 'sentiment',
          text: paragraph.trim(),
          notes: `Example sentiment annotation: ${Math.random() > 0.5 ? 'Positive' : 'Negative'}`
        });
      }
    } else if (annotationType === 'claims' || annotationType === 'sources') {
      // Find quoted text or numbers as potential claims or sources
      const regex = annotationType === 'claims' 
        ? /([^.!?]+with[^.!?]*claim[^.!?]*[.!?]+)/gi 
        : /([^.!?]+according to[^.!?]*[.!?]+)/gi;
      
      let match;
      while ((match = regex.exec(documentText)) !== null) {
        mockAnnotations.push({
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          type: annotationType,
          text: match[0].trim(),
          notes: `Example ${annotationType} annotation`
        });
      }
    }
    
    return {
      success: true,
      message: `Document annotation (${annotationType}) complete`,
      annotations: mockAnnotations,
      metadata: {
        requestId: context.requestId,
        timestamp: new Date().toISOString(),
        annotationType
      }
    };
  } catch (error: any) {
    console.error('Error in document annotation tool:', error);
    return {
      success: false,
      message: `Document annotation failed: ${error.message}`,
      annotations: [],
      metadata: {
        requestId: context.requestId,
        timestamp: new Date().toISOString(),
        error: error.message
      }
    };
  }
} 