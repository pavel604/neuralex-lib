/**
 * Custom error classes for NeuraLex client
 */

export class NeuraLexError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NeuraLexError';
    Object.setPrototypeOf(this, NeuraLexError.prototype);
  }
}

export class AuthenticationError extends NeuraLexError {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class RateLimitError extends NeuraLexError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class APIError extends NeuraLexError {
  statusCode: number;
  responseData: any;

  constructor(message: string, statusCode: number, responseData: any = {}) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.responseData = responseData;
    Object.setPrototypeOf(this, APIError.prototype);
  }
}
