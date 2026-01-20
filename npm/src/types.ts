/**
 * Type definitions for NeuraLex API
 */

/**
 * Input data for embedding generation - text is required, embedding is optional
 */
export interface EmbeddingInputData {
  /** Text to embed (required) */
  text: string;
  /** Pre-computed embedding vector (optional, for BYOE mode) */
  embedding?: number[];
}

export interface EmbeddingRequest {
  inputs: EmbeddingInputData[];
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
