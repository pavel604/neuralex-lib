/**
 * Type definitions for NeuraLex API
 */

export interface EmbeddingRequest {
  inputs: string[];
  model?: string;
  language?: string;
  semanticWeight?: number;
}

export interface Usage {
  totalTokens: number;
}

export interface EmbeddingData {
  text: string;
  embedding: number[];
  usage: Usage;
}

export interface EmbeddingResponse {
  payload: EmbeddingData[];
  model: string;
  totalUsage: Usage;
}

export interface NeuraLexClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: string;
}
