# NeuraLex Client Libraries

Official client libraries for the [NeuraLex API](https://neuralex.ca).

## What is NeuraLex?

NeuraLex is a next-generation embedding API that combines **semantic understanding** with **term-based precision** to deliver superior search and retrieval performance. Unlike traditional embedding models that rely solely on neural networks, NeuraLex uses a hybrid approach that preserves exact keyword matching while capturing semantic meaning.

Keep using your favourite vector DB with blazing-fast, ultra-accurate retrieval in a single index architecture.

This hybrid architecture delivers:
- ✅ **Better recall** - Captures both exact terms and semantic meaning
- ✅ **Reduced false positives** - Term-based component filters irrelevant semantic matches
- ✅ **Configurable precision** - Adjust the balance for your use case
- ✅ **Multilingual support** - Semantic component handles cross-language similarity

### Learn More

- 📄 [NeuraSearch Whitepaper](https://neuralex.ca/neurasearch-whitepaper) - Technical deep dive into the hybrid approach
- 📊 [Performance Analysis](https://neuralex.ca/neurasearch-analysis) - Performance analysis and comparisons
- 📖 [API Documentation](https://neuralex.ca/docs/api) - Complete API reference

## Available Libraries

### Python (pip)
Location: `lib/python/`

```bash
pip install neuralex
```

Full documentation: [lib/python/README.md](python/README.md)

### JavaScript/TypeScript (npm)
Location: `lib/npm/`

```bash
npm install neuralex
```

Full documentation: [lib/npm/README.md](npm/README.md)

## Quick Start

### Python

```python
from neuralex import NeuraLexClient

client = NeuraLexClient(api_key="nlx_your_api_key")
response = client.embed("Hello, world!")
print(response.payload[0].embedding[:5])
```

### JavaScript/TypeScript

```typescript
import { NeuraLexClient } from 'neuralex';

const client = new NeuraLexClient({ apiKey: 'nlx_your_api_key' });
const response = await client.embed('Hello, world!');
console.log(response.payload[0].embedding.slice(0, 5));
```

## Features

- ✅ Simple and intuitive API
- ✅ Type-safe with full type definitions
- ✅ Automatic error handling
- ✅ Configurable semantic/term-based balance
- ✅ Batch embedding support (up to 100 inputs)
- ✅ Async support (Python async client included)

## Publishing

### Python Package

```bash
cd lib/python
python -m build
python -m twine upload dist/*
```

### npm Package

```bash
cd lib/npm
npm run build
npm publish
```

## Development

### Python

```bash
cd lib/python
pip install -e ".[dev]"
pytest
```

### npm

```bash
cd lib/npm
npm install
npm run build
npm test
```

## Getting an API Key

1. Sign up at [app.neuralex.ca](https://app.neuralex.ca)
2. Navigate to the API section
3. Generate a new API key

## Support

- Documentation: [docs.neuralex.ca](https://docs.neuralex.ca)
- Email: support@neuralex.ca

## License

MIT License - see individual package LICENSE files for details
