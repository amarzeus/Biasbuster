import { DataSample } from './dataService';
import { BiasType } from '../types/bias';
import * as tf from '@tensorflow/tfjs-node';
import * as sharp from 'sharp';
import * as natural from 'natural';
import * as translate from '@google-cloud/translate';

interface AugmentationConfig {
  text?: {
    synonymReplacement: boolean;
    backTranslation: boolean;
    wordDropout: boolean;
    sentenceShuffling: boolean;
  };
  image?: {
    rotation: boolean;
    flip: boolean;
    brightness: boolean;
    contrast: boolean;
    noise: boolean;
  };
}

export class DataAugmentationService {
  private readonly tokenizer: natural.WordTokenizer;
  private readonly stemmer: natural.PorterStemmer;
  private readonly translator: translate.TranslationServiceClient;

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    this.translator = new translate.TranslationServiceClient();
  }

  /**
   * Augments data samples
   */
  async augmentSamples(
    samples: DataSample[],
    config: AugmentationConfig
  ): Promise<DataSample[]> {
    try {
      const augmentedSamples: DataSample[] = [];

      for (const sample of samples) {
        // Add original sample
        augmentedSamples.push(sample);

        // Apply text augmentation
        if (typeof sample.content === 'string' && config.text) {
          if (config.text.synonymReplacement) {
            augmentedSamples.push(
              await this.applySynonymReplacement(sample)
            );
          }
          if (config.text.backTranslation) {
            augmentedSamples.push(
              await this.applyBackTranslation(sample)
            );
          }
          if (config.text.wordDropout) {
            augmentedSamples.push(
              await this.applyWordDropout(sample)
            );
          }
          if (config.text.sentenceShuffling) {
            augmentedSamples.push(
              await this.applySentenceShuffling(sample)
            );
          }
        }

        // Apply image augmentation
        if (Buffer.isBuffer(sample.content) && config.image) {
          if (config.image.rotation) {
            augmentedSamples.push(
              await this.applyImageRotation(sample)
            );
          }
          if (config.image.flip) {
            augmentedSamples.push(
              await this.applyImageFlip(sample)
            );
          }
          if (config.image.brightness) {
            augmentedSamples.push(
              await this.applyImageBrightness(sample)
            );
          }
          if (config.image.contrast) {
            augmentedSamples.push(
              await this.applyImageContrast(sample)
            );
          }
          if (config.image.noise) {
            augmentedSamples.push(
              await this.applyImageNoise(sample)
            );
          }
        }
      }

      return augmentedSamples;
    } catch (error) {
      console.error('Error augmenting samples:', error);
      throw new Error('Failed to augment samples');
    }
  }

  /**
   * Applies synonym replacement
   */
  private async applySynonymReplacement(sample: DataSample): Promise<DataSample> {
    try {
      const words = this.tokenizer.tokenize(sample.content as string);
      const augmentedWords = await Promise.all(
        words.map(async word => {
          const stem = this.stemmer.stem(word);
          const synonyms = await this.getSynonyms(stem);
          return synonyms.length > 0
            ? synonyms[Math.floor(Math.random() * synonyms.length)]
            : word;
        })
      );

      return {
        ...sample,
        id: `${sample.id}-synonym`,
        content: augmentedWords.join(' '),
        metadata: {
          ...sample.metadata,
          confidence: sample.metadata.confidence * 0.9
        }
      };
    } catch (error) {
      console.error('Error applying synonym replacement:', error);
      return sample;
    }
  }

  /**
   * Applies back translation
   */
  private async applyBackTranslation(sample: DataSample): Promise<DataSample> {
    try {
      // Translate to intermediate language
      const intermediateLang = this.getIntermediateLanguage(sample.metadata.language);
      const intermediateTranslation = await this.translateText(
        sample.content as string,
        sample.metadata.language,
        intermediateLang
      );

      // Translate back to original language
      const backTranslation = await this.translateText(
        intermediateTranslation,
        intermediateLang,
        sample.metadata.language
      );

      return {
        ...sample,
        id: `${sample.id}-backtrans`,
        content: backTranslation,
        metadata: {
          ...sample.metadata,
          confidence: sample.metadata.confidence * 0.85
        }
      };
    } catch (error) {
      console.error('Error applying back translation:', error);
      return sample;
    }
  }

  /**
   * Applies word dropout
   */
  private async applyWordDropout(sample: DataSample): Promise<DataSample> {
    try {
      const words = this.tokenizer.tokenize(sample.content as string);
      const dropoutRate = 0.1;
      const augmentedWords = words.filter(
        () => Math.random() > dropoutRate
      );

      return {
        ...sample,
        id: `${sample.id}-dropout`,
        content: augmentedWords.join(' '),
        metadata: {
          ...sample.metadata,
          confidence: sample.metadata.confidence * 0.95
        }
      };
    } catch (error) {
      console.error('Error applying word dropout:', error);
      return sample;
    }
  }

  /**
   * Applies sentence shuffling
   */
  private async applySentenceShuffling(sample: DataSample): Promise<DataSample> {
    try {
      const sentences = (sample.content as string).split(/[.!?]+/);
      const shuffledSentences = this.shuffleArray(sentences);

      return {
        ...sample,
        id: `${sample.id}-shuffle`,
        content: shuffledSentences.join('. '),
        metadata: {
          ...sample.metadata,
          confidence: sample.metadata.confidence * 0.8
        }
      };
    } catch (error) {
      console.error('Error applying sentence shuffling:', error);
      return sample;
    }
  }

  /**
   * Applies image rotation
   */
  private async applyImageRotation(sample: DataSample): Promise<DataSample> {
    try {
      const angle = Math.random() * 30 - 15; // Random angle between -15 and 15 degrees
      const rotatedImage = await sharp(sample.content as Buffer)
        .rotate(angle)
        .toBuffer();

      return {
        ...sample,
        id: `${sample.id}-rotate`,
        content: rotatedImage,
        metadata: {
          ...sample.metadata,
          confidence: sample.metadata.confidence * 0.9
        }
      };
    } catch (error) {
      console.error('Error applying image rotation:', error);
      return sample;
    }
  }

  /**
   * Applies image flip
   */
  private async applyImageFlip(sample: DataSample): Promise<DataSample> {
    try {
      const flippedImage = await sharp(sample.content as Buffer)
        .flip()
        .toBuffer();

      return {
        ...sample,
        id: `${sample.id}-flip`,
        content: flippedImage,
        metadata: {
          ...sample.metadata,
          confidence: sample.metadata.confidence * 0.9
        }
      };
    } catch (error) {
      console.error('Error applying image flip:', error);
      return sample;
    }
  }

  /**
   * Applies image brightness
   */
  private async applyImageBrightness(sample: DataSample): Promise<DataSample> {
    try {
      const factor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
      const brightenedImage = await sharp(sample.content as Buffer)
        .modulate({ brightness: factor })
        .toBuffer();

      return {
        ...sample,
        id: `${sample.id}-bright`,
        content: brightenedImage,
        metadata: {
          ...sample.metadata,
          confidence: sample.metadata.confidence * 0.9
        }
      };
    } catch (error) {
      console.error('Error applying image brightness:', error);
      return sample;
    }
  }

  /**
   * Applies image contrast
   */
  private async applyImageContrast(sample: DataSample): Promise<DataSample> {
    try {
      const factor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
      const contrastedImage = await sharp(sample.content as Buffer)
        .modulate({ contrast: factor })
        .toBuffer();

      return {
        ...sample,
        id: `${sample.id}-contrast`,
        content: contrastedImage,
        metadata: {
          ...sample.metadata,
          confidence: sample.metadata.confidence * 0.9
        }
      };
    } catch (error) {
      console.error('Error applying image contrast:', error);
      return sample;
    }
  }

  /**
   * Applies image noise
   */
  private async applyImageNoise(sample: DataSample): Promise<DataSample> {
    try {
      const tensor = tf.node.decodeImage(sample.content as Buffer);
      const noise = tf.randomNormal(tensor.shape, 0, 0.1);
      const noisyTensor = tensor.add(noise);
      const noisyImage = await tf.node.encodeJpeg(noisyTensor);

      return {
        ...sample,
        id: `${sample.id}-noise`,
        content: noisyImage,
        metadata: {
          ...sample.metadata,
          confidence: sample.metadata.confidence * 0.9
        }
      };
    } catch (error) {
      console.error('Error applying image noise:', error);
      return sample;
    }
  }

  /**
   * Gets synonyms for a word
   */
  private async getSynonyms(word: string): Promise<string[]> {
    // TODO: Implement synonym lookup using a thesaurus API or local database
    return [];
  }

  /**
   * Translates text
   */
  private async translateText(
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<string> {
    try {
      const [translation] = await this.translator.translateText({
        parent: `projects/${process.env.GOOGLE_CLOUD_PROJECT}/locations/global`,
        contents: [text],
        mimeType: 'text/plain',
        sourceLanguageCode: sourceLang,
        targetLanguageCode: targetLang
      });

      return translation.translations[0].translatedText;
    } catch (error) {
      console.error('Error translating text:', error);
      throw new Error('Failed to translate text');
    }
  }

  /**
   * Gets intermediate language for back translation
   */
  private getIntermediateLanguage(sourceLang: string): string {
    const languages = ['es', 'fr', 'de', 'it', 'pt', 'nl', 'ru', 'zh', 'ja', 'ko'];
    const filtered = languages.filter(lang => lang !== sourceLang);
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  /**
   * Shuffles array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
} 