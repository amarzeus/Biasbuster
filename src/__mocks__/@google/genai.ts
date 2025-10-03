export class GoogleGenAI {
  constructor(apiKey: string) {
    // Mock constructor
  }

  models = {
    generateContent: jest.fn().mockResolvedValue({
      text: JSON.stringify({
        findings: [
          {
            biasedPhrase: "test",
            explanation: "Mock bias explanation",
            biasType: "framing",
            suggestion: "neutral alternative",
            severity: { level: "medium", confidence: 0.8, impact: "moderate" },
            context: "test context",
            alternatives: ["alternative 1"],
            sources: [{ web: { uri: "https://example.com", title: "Example" } }],
            tags: ["test"]
          }
        ]
      }),
      candidates: [{
        groundingMetadata: {
          groundingChunks: [{ web: { uri: "https://example.com", title: "Example" } }]
        }
      }]
    }),
    generateContentStream: jest.fn().mockReturnValue({
      [Symbol.asyncIterator]: async function* () {
        yield { text: 'mock response' };
      },
    }),
  };
}
