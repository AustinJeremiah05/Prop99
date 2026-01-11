# Evidence Storage Example

This directory would contain evidence-map.json which maps request IDs to IPFS hashes.

## Format:
```json
{
  "18": "QmXYZ123...",
  "19": "QmABC456..."
}
```

The evidence files themselves are uploaded to IPFS and contain:
```json
{
  "requestId": "18",
  "finalValuation": 450000,
  "finalConfidence": 88,
  "timestamp": "2026-01-11T...",
  "satelliteData": {...},
  "agentAnalysis": {
    "agents": [
      {
        "name": "Groq",
        "model": "Llama 3.3 70B Versatile",
        "valuation": 452000,
        "confidence": 87,
        "reasoning": "...",
        "risk_factors": []
      },
      {
        "name": "OpenRouter", 
        "model": "GPT-4o-mini",
        "valuation": 448000,
        "confidence": 91,
        "reasoning": "...",
        "risk_factors": []
      },
      {
        "name": "Gemini",
        "model": "Meta Llama 3.1 8B Instruct",
        "valuation": 450000,
        "confidence": 85,
        "reasoning": "...",
        "risk_factors": []
      }
    ],
    "consensusMethod": "weighted_average"
  }
}
```

## To see real agent scores:

1. Run the offchain service: `npm run dev` 
2. Submit a new property verification request
3. Wait for AI agents to complete analysis
4. The evidence-map.json file will be created automatically
5. Open the asset details in the frontend
6. The real agent scores will be fetched and displayed
