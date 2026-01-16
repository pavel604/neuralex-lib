/**
 * Example usage of the NeuraLex TypeScript/JavaScript client library.
 */

import { NeuraLexClient, AuthenticationError, APIError } from 'neuralex';

async function basicExample() {
  console.log('=== Basic Example ===');

  const client = new NeuraLexClient({ apiKey: 'nlx_your_api_key' });

  // Single text embedding
  const response = await client.embed('Hello, world!');

  console.log(`Model: ${response.model}`);
  console.log(`Dimensions: ${response.payload[0].embedding.length}`);
  console.log(`First 5 values: ${response.payload[0].embedding.slice(0, 5)}`);
  console.log(`Tokens used: ${response.totalUsage.totalTokens}`);
}

async function batchExample() {
  console.log('\n=== Batch Example ===');

  const client = new NeuraLexClient({ apiKey: 'nlx_your_api_key' });

  const texts = [
    'Machine learning is fascinating',
    'Python is a great programming language',
    'Vector embeddings enable semantic search',
  ];

  const response = await client.embed(texts);

  response.payload.forEach((item, i) => {
    console.log(`\nText ${i + 1}: ${item.text}`);
    console.log(`Dimensions: ${item.embedding.length}`);
    console.log(`Tokens: ${item.usage.totalTokens}`);
  });
}

async function semanticWeightExample() {
  console.log('\n=== Semantic Weight Example ===');

  const client = new NeuraLexClient({ apiKey: 'nlx_your_api_key' });
  const text = 'Python programming language';

  // Term-focused (better for keyword matching)
  const responseTerm = await client.embed(text, { semanticWeight: 0.2 });
  console.log(`Term-focused (0.2): ${responseTerm.payload[0].embedding.slice(0, 3)}`);

  // Balanced
  const responseBalanced = await client.embed(text, { semanticWeight: 0.5 });
  console.log(
    `Balanced (0.5): ${responseBalanced.payload[0].embedding.slice(0, 3)}`
  );

  // Semantic-focused (better for meaning-based search)
  const responseSemantic = await client.embed(text, { semanticWeight: 0.8 });
  console.log(
    `Semantic-focused (0.8): ${responseSemantic.payload[0].embedding.slice(0, 3)}`
  );
}

async function errorHandlingExample() {
  console.log('\n=== Error Handling Example ===');

  try {
    // This will fail with invalid API key
    const client = new NeuraLexClient({ apiKey: 'invalid_key' });
    await client.embed('Test');
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error(`Authentication error: ${error.message}`);
    } else if (error instanceof APIError) {
      console.error(`API error: ${error.message} (status: ${error.statusCode})`);
    } else {
      console.error(`Unexpected error: ${error}`);
    }
  }
}

async function customConfigExample() {
  console.log('\n=== Custom Config Example ===');

  const client = new NeuraLexClient({
    apiKey: 'nlx_your_api_key',
    baseUrl: 'https://api.neuralex.ca',
    timeout: 60000, // 60 seconds
  });

  const response = await client.embed('Custom config example');
  console.log(`Success: ${response.payload.length} embedding(s) generated`);
}

// Run all examples
async function main() {
  try {
    await basicExample();
    await batchExample();
    await semanticWeightExample();
    await errorHandlingExample();
    await customConfigExample();
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}
