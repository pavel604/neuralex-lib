"""
Example usage of the NeuraLex Python client library.
"""

from neuralex import NeuraLexClient, AsyncNeuraLexClient
import asyncio


def basic_example():
    """Basic synchronous usage example."""
    print("=== Basic Example ===")
    
    # Initialize client
    client = NeuraLexClient(api_key="nlx_your_api_key")
    
    # Single text embedding
    response = client.embed("Hello, world!")
    
    print(f"Model: {response.model}")
    print(f"Dimensions: {len(response.payload[0].embedding)}")
    print(f"First 5 values: {response.payload[0].embedding[:5]}")
    print(f"Tokens used: {response.total_usage.total_tokens}")
    
    client.close()


def batch_example():
    """Batch embedding example."""
    print("\n=== Batch Example ===")
    
    with NeuraLexClient(api_key="nlx_your_api_key") as client:
        texts = [
            "Machine learning is fascinating",
            "Python is a great programming language",
            "Vector embeddings enable semantic search"
        ]
        
        response = client.embed(texts)
        
        for i, item in enumerate(response.payload):
            print(f"\nText {i + 1}: {item.text}")
            print(f"Dimensions: {len(item.embedding)}")
            print(f"Tokens: {item.usage.total_tokens}")


def semantic_weight_example():
    """Demonstrate semantic weight parameter."""
    print("\n=== Semantic Weight Example ===")
    
    with NeuraLexClient(api_key="nlx_your_api_key") as client:
        text = "Python programming language"
        
        # Term-focused (better for keyword matching)
        response_term = client.embed(text, semantic_weight=0.2)
        print(f"Term-focused (0.2): {response_term.payload[0].embedding[:3]}")
        
        # Balanced
        response_balanced = client.embed(text, semantic_weight=0.5)
        print(f"Balanced (0.5): {response_balanced.payload[0].embedding[:3]}")
        
        # Semantic-focused (better for meaning-based search)
        response_semantic = client.embed(text, semantic_weight=0.8)
        print(f"Semantic-focused (0.8): {response_semantic.payload[0].embedding[:3]}")


async def async_example():
    """Async client usage example."""
    print("\n=== Async Example ===")
    
    async with AsyncNeuraLexClient(api_key="nlx_your_api_key") as client:
        texts = ["Text 1", "Text 2", "Text 3"]
        response = await client.embed(texts)
        
        for item in response.payload:
            print(f"{item.text}: {len(item.embedding)} dimensions")


def error_handling_example():
    """Error handling example."""
    print("\n=== Error Handling Example ===")
    
    from neuralex import AuthenticationError, APIError
    
    try:
        # This will fail with invalid API key
        client = NeuraLexClient(api_key="invalid_key")
        response = client.embed("Test")
    except AuthenticationError as e:
        print(f"Authentication error: {e}")
    except APIError as e:
        print(f"API error: {e} (status: {e.status_code})")
    except Exception as e:
        print(f"Unexpected error: {e}")


if __name__ == "__main__":
    # Run synchronous examples
    basic_example()
    batch_example()
    semantic_weight_example()
    error_handling_example()
    
    # Run async example
    asyncio.run(async_example())
