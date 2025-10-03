export class GoogleGenAI {
  constructor(apiKey: string) {
    // Mock constructor
  }

  models = {
    generateContentStream: jest.fn().mockReturnValue({
      [Symbol.asyncIterator]: async function* () {
        yield { text: 'mock response' };
      },
    }),
  };
}
