# NeuraLex JavaScript/TypeScript Client

Official TypeScript/JavaScript client library for the [NeuraLex](https://neuralex.ca) API.

## What is NeuraLex?

NeuraLex is a next-generation embedding API that combines **semantic understanding** with **term-based precision** to deliver superior search and retrieval performance. Unlike traditional embedding models that rely solely on neural networks, NeuraLex uses a hybrid approach that preserves exact keyword matching while capturing semantic meaning.

This hybrid architecture delivers:
- ✅ **Better recall** - Captures both exact terms and semantic meaning
- ✅ **Reduced false positives (disambiguation)** - Term-based component filters irrelevant semantic matches
- ✅ **Configurable precision** - Adjust the balance for your use case

### Learn More

- 📄 [NeuraSearch Whitepaper](https://neuralex.ca/neurasearch-whitepaper) - Technical deep dive into the hybrid approach
- 📊 [Performance Analysis](https://neuralex.ca/neurasearch-analysis) - Benchmark results and comparisons
- 📖 [API Documentation](https://neuralex.ca/docs/api) - Complete API reference

## Installation

```bash
npm install neuralex
```

or

```bash
yarn add neuralex
```

## Quick Start

```typescript
import { NeuraLexClient } from 'neuralex';

// Initialize client with your API key
const client = new NeuraLexClient({ apiKey: 'nlx_your_api_key' });

// Generate embeddings
const response = await client.embed('Hello, world!');

// Access the embedding vector
const embedding = response.payload[0].embedding;
console.log(`Dimensions: ${embedding.length}`);
console.log(`First 5 values: ${embedding.slice(0, 5)}`);
```

## Features

- ✅ TypeScript support with full type definitions
- ✅ Promise-based async API
- ✅ Automatic error handling
- ✅ Configurable semantic/term-based balance
- ✅ Batch embedding support (up to 100 inputs)
- ✅ Tree-shakeable ESM and CommonJS builds

## Usage

### Basic Usage

```typescript
import { NeuraLexClient } from 'neuralex';

const client = new NeuraLexClient({ apiKey: 'nlx_your_api_key' });

// Single text
const response = await client.embed('Machine learning is fascinating');
const embedding = response.payload[0].embedding;
```

### Batch Embeddings

```typescript
// Multiple texts
const texts = [
  'First document',
  'Second document',
  'Third document'
];

const response = await client.embed(texts);

response.payload.forEach((item) => {
  console.log(`Text: ${item.text}`);
  console.log(`Embedding dimensions: ${item.embedding.length}`);
  console.log(`Tokens used: ${item.usage.totalTokens}`);
});
```

### Adjusting Semantic Weight

The `semanticWeight` parameter controls the balance between term-based and semantic embeddings:
- `0.0` = Pure term-based (exact keyword matching)
- `1.0` = Pure semantic (meaning-based)
- `0.5` = Balanced (default)

```typescript
// More term-focused (better for keyword search)
const response = await client.embed('Python programming', {
  semanticWeight: 0.3
});

// More semantic-focused (better for meaning-based search)
const response = await client.embed('Python programming', {
  semanticWeight: 0.8
});
```

### Error Handling

```typescript
import {
  NeuraLexClient,
  AuthenticationError,
  RateLimitError,
  APIError
} from 'neuralex';

const client = new NeuraLexClient({ apiKey: 'nlx_your_api_key' });

try {
  const response = await client.embed('Hello, world!');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded, please wait');
  } else if (error instanceof APIError) {
    console.error(`API error: ${error.message} (status: ${error.statusCode})`);
  } else {
    console.error(`Unexpected error: ${error}`);
  }
}
```

### Using with JavaScript (CommonJS)

```javascript
const { NeuraLexClient } = require('neuralex');

const client = new NeuraLexClient({ apiKey: 'nlx_your_api_key' });

async function main() {
  const response = await client.embed('Hello, world!');
  console.log(response.payload[0].embedding.slice(0, 5));
}

main();
```

## API Reference

### `NeuraLexClient`

Main client class for API interactions.

**Constructor:**

```typescript
new NeuraLexClient(config: NeuraLexClientConfig)
```

**Config Options:**

- `apiKey` (string, required): Your NeuraLex API key
- `baseUrl` (string, optional): Base URL for the API (default: "https://api.neuralex.ca")
- `timeout` (number, optional): Request timeout in milliseconds (default: 30000)

**Methods:**

#### `embed(inputs, options?)`

Generate embeddings for text input(s).

**Parameters:**

- `inputs` (string | string[]): Text or array of texts to embed (max 100)
- `options` (object, optional):
  - `model` (string): Model name (default: "public")
  - `language` (string): Language for lexeme extraction (default: "english")
  - `semanticWeight` (number): Balance between term (0.0) and semantic (1.0) (default: 0.5)

**Returns:** `Promise<EmbeddingResponse>`

### Types

#### `EmbeddingResponse`

```typescript
interface EmbeddingResponse {
  payload: EmbeddingData[];
  model: string;
  totalUsage: Usage;
}
```

#### `EmbeddingData`

```typescript
interface EmbeddingData {
  text: string;
  embedding: number[];
  usage: Usage;
}
```

#### `Usage`

```typescript
interface Usage {
  totalTokens: number;
}
```

### Error Classes

- `NeuraLexError` - Base error class
- `AuthenticationError` - Invalid or missing API key
- `RateLimitError` - Rate limit exceeded
- `APIError` - API error response (includes `statusCode` and `responseData`)

## Getting an API Key

1. Sign up at [app.neuralex.ca](https://app.neuralex.ca)
2. Generate a new API key
3. Keep your API key secure and never commit it to version control

## Examples

### Semantic Search

```typescript
import { NeuraLexClient } from 'neuralex';

const client = new NeuraLexClient({ apiKey: process.env.NEURALEX_API_KEY });

// Embed documents
const documents = [
  'The quick brown fox jumps over the lazy dog',
  'Machine learning is a subset of artificial intelligence',
  'Python is a popular programming language'
];

const docResponse = await client.embed(documents);
const docEmbeddings = docResponse.payload.map(d => d.embedding);

// Embed query
const queryResponse = await client.embed('Tell me about AI');
const queryEmbedding = queryResponse.payload[0].embedding;

// Compute cosine similarity (you'll need to implement this)
const similarities = docEmbeddings.map(docEmb => 
  cosineSimilarity(queryEmbedding, docEmb)
);

console.log('Most similar document:', documents[similarities.indexOf(Math.max(...similarities))]);
```

### Integration with Vector Databases

```typescript
import { NeuraLexClient } from 'neuralex';
// import your vector database client

const nlxClient = new NeuraLexClient({ apiKey: 'nlx_your_api_key' });

async function indexDocuments(documents: string[]) {
  const response = await nlxClient.embed(documents);
  
  // Store in your vector database
  for (let i = 0; i < response.payload.length; i++) {
    await vectorDB.insert({
      id: i,
      text: response.payload[i].text,
      embedding: response.payload[i].embedding
    });
  }
}
```

## License

MIT License - see LICENSE file for details
