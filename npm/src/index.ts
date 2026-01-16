/**
 * NeuraLex TypeScript Client Library
 * Official client for the NeuraLex Embedding API
 */

export { NeuraLexClient } from './client';
export type {
  EmbeddingRequest,
  EmbeddingResponse,
  EmbeddingData,
  Usage,
  NeuraLexClientConfig,
} from './types';
export {
  NeuraLexError,
  AuthenticationError,
  RateLimitError,
  APIError,
} from './errors';
