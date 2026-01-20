/**
 * NeuraLex API Client Implementation
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  EmbeddingInputData,
  EmbeddingRequest,
  EmbeddingResponse,
  NeuraLexClientConfig,
  ErrorResponse,
} from './types';
import {
  NeuraLexError,
  AuthenticationError,
  RateLimitError,
  APIError,
} from './errors';

/**
 * Input type for the embed method - can be a string, EmbeddingInputData, or arrays of either
 */
type EmbedInput = string | EmbeddingInputData | string[] | EmbeddingInputData[];

/**
 * Normalize various input formats to EmbeddingInputData[]
 */
function normalizeInputs(inputs: EmbedInput): EmbeddingInputData[] {
  // Handle single string
  if (typeof inputs === 'string') {
    return [{ text: inputs }];
  }

  // Handle single EmbeddingInputData
  if (!Array.isArray(inputs)) {
    return [inputs];
  }

  // Handle array
  return inputs.map((item) => {
    if (typeof item === 'string') {
      return { text: item };
    }
    return item;
  });
}

/**
 * Client for interacting with the NeuraLex Embedding API
 *
 * @example
 * ```typescript
 * const client = new NeuraLexClient({ apiKey: 'nlx_your_api_key' });
 * const response = await client.embed(['Hello, world!']);
 * console.log(response.payload[0].embedding.slice(0, 5));
 * ```
 */
export class NeuraLexClient {
  private client: AxiosInstance;
  private apiKey: string;

  /**
   * Create a new NeuraLex client
   *
   * @param config - Client configuration
   * @param config.apiKey - Your NeuraLex API key (starts with 'nlx_')
   * @param config.baseUrl - Base URL for the API (default: https://api.neuralex.ca)
   * @param config.timeout - Request timeout in milliseconds (default: 30000)
   */
  constructor(config: NeuraLexClientConfig) {
    const { apiKey, baseUrl = 'https://api.neuralex.ca', timeout = 30000 } = config;

    if (!apiKey) {
      throw new AuthenticationError('API key is required');
    }

    if (!apiKey.startsWith('nlx_')) {
      throw new AuthenticationError("Invalid API key format (should start with 'nlx_')");
    }

    this.apiKey = apiKey;

    this.client = axios.create({
      baseURL: baseUrl,
      timeout,
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Generate embeddings for the provided input text(s)
   *
   * @param inputs - Text string, EmbeddingInputData, or array of either (max 100).
   *                 For BYOE (Bring Your Own Embedding) mode, use EmbeddingInputData
   *                 with the embedding field populated.
   * @param options - Optional parameters
   * @param options.model - Model name (default: "public")
   * @param options.language - Language for lexeme extraction (default: "english")
   * @param options.semanticWeight - Balance between term-based (0.0) and semantic (1.0) (default: 0.5)
   * @returns Promise<EmbeddingResponse> - Embeddings and usage information
   *
   * @throws {AuthenticationError} Invalid or missing API key
   * @throws {RateLimitError} Rate limit exceeded
   * @throws {APIError} API returned an error response
   * @throws {NeuraLexError} Other errors
   *
   * @example
   * ```typescript
   * // Single text
   * const response = await client.embed('Hello, world!');
   *
   * // Multiple texts
   * const response = await client.embed(['Text 1', 'Text 2', 'Text 3']);
   *
   * // With options
   * const response = await client.embed('Python programming', {
   *   semanticWeight: 0.8,
   *   model: 'public'
   * });
   *
   * // BYOE mode with pre-computed embeddings
   * const response = await client.embed([
   *   { text: 'hello world', embedding: new Array(1024).fill(0.1) },
   *   { text: 'server-computed text' }
   * ]);
   * ```
   */
  async embed(
    inputs: EmbedInput,
    options: {
      model?: string;
      language?: string;
      semanticWeight?: number;
    } = {}
  ): Promise<EmbeddingResponse> {
    // Normalize inputs to EmbeddingInputData[]
    const normalizedInputs = normalizeInputs(inputs);

    // Validate inputs
    if (normalizedInputs.length === 0) {
      throw new Error('At least one input is required');
    }
    if (normalizedInputs.length > 100) {
      throw new Error('Maximum 100 inputs allowed per request');
    }

    // Create request payload
    const request: EmbeddingRequest = {
      inputs: normalizedInputs,
      model: options.model ?? 'public',
      language: options.language ?? 'english',
      semanticWeight: options.semanticWeight ?? 0.5,
    };

    try {
      const response = await this.client.post<EmbeddingResponse>(
        '/api/v1/embed',
        request
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;

        // Handle specific HTTP status codes
        if (axiosError.response?.status === 401) {
          throw new AuthenticationError('Invalid API key');
        } else if (axiosError.response?.status === 429) {
          throw new RateLimitError('Rate limit exceeded');
        } else if (axiosError.response?.status && axiosError.response.status >= 400) {
          const errorData = axiosError.response.data;
          throw new APIError(
            errorData?.message || 'API request failed',
            axiosError.response.status,
            errorData
          );
        } else if (error.code === 'ECONNABORTED') {
          throw new NeuraLexError('Request timeout');
        }
      }

      // Re-throw if it's already our custom error
      if (error instanceof NeuraLexError) {
        throw error;
      }

      // Generic error
      throw new NeuraLexError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }
}
