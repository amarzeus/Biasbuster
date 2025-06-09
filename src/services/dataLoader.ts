import { DataSample, DataSource } from './dataService';
import { BiasType } from '../types/bias';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as csv from 'csv-parse';
import * as tf from '@tensorflow/tfjs-node';
import * as sharp from 'sharp';

export class DataLoader {
  /**
   * Loads JSON data
   */
  async loadJsonData(source: DataSource): Promise<DataSample[]> {
    try {
      const data = await fs.readFile(source.path, 'utf-8');
      const jsonData = JSON.parse(data);

      return this.parseJsonData(jsonData, source);
    } catch (error) {
      console.error('Error loading JSON data:', error);
      throw new Error('Failed to load JSON data');
    }
  }

  /**
   * Loads CSV data
   */
  async loadCsvData(source: DataSource): Promise<DataSample[]> {
    try {
      const data = await fs.readFile(source.path, 'utf-8');
      const records: any[] = await new Promise((resolve, reject) => {
        csv.parse(data, {
          columns: true,
          skip_empty_lines: true
        }, (err, records) => {
          if (err) reject(err);
          else resolve(records);
        });
      });

      return this.parseCsvData(records, source);
    } catch (error) {
      console.error('Error loading CSV data:', error);
      throw new Error('Failed to load CSV data');
    }
  }

  /**
   * Loads text data
   */
  async loadTextData(source: DataSource): Promise<DataSample[]> {
    try {
      const data = await fs.readFile(source.path, 'utf-8');
      const lines = data.split('\n').filter(line => line.trim());

      return this.parseTextData(lines, source);
    } catch (error) {
      console.error('Error loading text data:', error);
      throw new Error('Failed to load text data');
    }
  }

  /**
   * Loads image data
   */
  async loadImageData(source: DataSource): Promise<DataSample[]> {
    try {
      const files = await fs.readdir(source.path);
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|bmp)$/i.test(file)
      );

      const samples: DataSample[] = [];
      for (const file of imageFiles) {
        const imagePath = path.join(source.path, file);
        const imageBuffer = await fs.readFile(imagePath);
        
        // Process image
        const processedImage = await this.processImage(imageBuffer);

        samples.push({
          id: path.parse(file).name,
          content: processedImage,
          metadata: {
            source: source.path,
            language: 'en', // Default for images
            domain: source.metadata?.domain || 'general',
            demographics: {},
            biasTypes: [],
            confidence: 1.0,
            timestamp: new Date().toISOString()
          }
        });
      }

      return samples;
    } catch (error) {
      console.error('Error loading image data:', error);
      throw new Error('Failed to load image data');
    }
  }

  /**
   * Loads dataset data
   */
  async loadDatasetData(source: DataSource): Promise<DataSample[]> {
    try {
      // Check if it's a TensorFlow dataset
      if (await this.isTensorFlowDataset(source.path)) {
        return await this.loadTensorFlowDataset(source);
      }

      // Check if it's a HuggingFace dataset
      if (await this.isHuggingFaceDataset(source.path)) {
        return await this.loadHuggingFaceDataset(source);
      }

      throw new Error('Unsupported dataset format');
    } catch (error) {
      console.error('Error loading dataset data:', error);
      throw new Error('Failed to load dataset data');
    }
  }

  /**
   * Parses JSON data
   */
  private parseJsonData(data: any, source: DataSource): DataSample[] {
    const samples: DataSample[] = [];

    if (Array.isArray(data)) {
      // Array of samples
      data.forEach((item, index) => {
        samples.push(this.createSample(item, source, index.toString()));
      });
    } else if (typeof data === 'object') {
      // Single sample or object with samples
      if (data.samples && Array.isArray(data.samples)) {
        data.samples.forEach((item: any, index: number) => {
          samples.push(this.createSample(item, source, index.toString()));
        });
      } else {
        samples.push(this.createSample(data, source, '0'));
      }
    }

    return samples;
  }

  /**
   * Parses CSV data
   */
  private parseCsvData(records: any[], source: DataSource): DataSample[] {
    return records.map((record, index) => 
      this.createSample(record, source, index.toString())
    );
  }

  /**
   * Parses text data
   */
  private parseTextData(lines: string[], source: DataSource): DataSample[] {
    return lines.map((line, index) => ({
      id: index.toString(),
      content: line,
      metadata: {
        source: source.path,
        language: source.metadata?.language || 'en',
        domain: source.metadata?.domain || 'general',
        demographics: source.metadata?.demographics || {},
        biasTypes: [],
        confidence: 1.0,
        timestamp: new Date().toISOString()
      }
    }));
  }

  /**
   * Creates a data sample
   */
  private createSample(data: any, source: DataSource, id: string): DataSample {
    return {
      id: data.id || id,
      content: data.content || data.text || data.image || '',
      metadata: {
        source: source.path,
        language: data.language || source.metadata?.language || 'en',
        domain: data.domain || source.metadata?.domain || 'general',
        demographics: data.demographics || source.metadata?.demographics || {},
        biasTypes: this.parseBiasTypes(data.biasTypes || []),
        confidence: data.confidence || 1.0,
        timestamp: data.timestamp || new Date().toISOString()
      },
      annotations: data.annotations?.map((annotation: any) => ({
        biasType: this.parseBiasType(annotation.biasType),
        confidence: annotation.confidence || 1.0,
        explanation: annotation.explanation || ''
      }))
    };
  }

  /**
   * Parses bias types
   */
  private parseBiasTypes(types: any[]): BiasType[] {
    return types
      .map(type => this.parseBiasType(type))
      .filter((type): type is BiasType => type !== null);
  }

  /**
   * Parses a single bias type
   */
  private parseBiasType(type: any): BiasType | null {
    if (typeof type === 'string' && Object.values(BiasType).includes(type as BiasType)) {
      return type as BiasType;
    }
    return null;
  }

  /**
   * Processes an image
   */
  private async processImage(buffer: Buffer): Promise<Buffer> {
    try {
      // Resize image
      const resized = await sharp(buffer)
        .resize(224, 224, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toBuffer();

      // Convert to RGB
      const rgb = await sharp(resized)
        .ensureAlpha()
        .toBuffer();

      return rgb;
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  }

  /**
   * Checks if path is a TensorFlow dataset
   */
  private async isTensorFlowDataset(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      const files = await fs.readdir(path);
      return files.some(file => file.endsWith('.tfrecord'));
    } catch {
      return false;
    }
  }

  /**
   * Checks if path is a HuggingFace dataset
   */
  private async isHuggingFaceDataset(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      const files = await fs.readdir(path);
      return files.some(file => file.endsWith('.arrow'));
    } catch {
      return false;
    }
  }

  /**
   * Loads TensorFlow dataset
   */
  private async loadTensorFlowDataset(source: DataSource): Promise<DataSample[]> {
    // TODO: Implement TensorFlow dataset loading
    return [];
  }

  /**
   * Loads HuggingFace dataset
   */
  private async loadHuggingFaceDataset(source: DataSource): Promise<DataSample[]> {
    // TODO: Implement HuggingFace dataset loading
    return [];
  }
} 