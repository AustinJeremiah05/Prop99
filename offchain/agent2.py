"""
AI Agent 2 - OpenRouter Agent
Property analysis using OpenRouter API with Google Custom Search price data
"""
import os
import sys
import json
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI

# Import price oracle
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.services.priceOracle import get_market_valuation

load_dotenv()

# Configure OpenAI client for OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv('OPENROUTER_API_KEY')
)

def calculate_valuation(area_sqm: float, ndvi: float, cloud_coverage: float, document_count: int) -> dict:
    """
    Calculate property valuation based on satellite data and documents.
    
    Args:
        area_sqm: Property area in square meters
        ndvi: Normalized Difference Vegetation Index (0-1)
        cloud_coverage: Cloud coverage percentage
        document_count: Number of submitted documents
    
    Returns:
        Dictionary with valuation and analysis
    """
    # Base price per sqm based on vegetation health
    if ndvi > 0.6:
        base_price = 2500  # High vegetation = premium land
    elif ndvi > 0.4:
        base_price = 2200  # Moderate vegetation
    else:
        base_price = 1800  # Low vegetation
    
    # Area factor (larger properties may have lower per-sqm value)
    area_factor = 1.0 if area_sqm < 500 else 0.95 if area_sqm < 1000 else 0.90
    
    # Document confidence factor
    doc_factor = min(1.0, 0.7 + (document_count * 0.15))
    
    # Calculate valuation
    valuation = int(area_sqm * base_price * area_factor * doc_factor)
    
    # Calculate confidence based on data quality
    confidence = 85
    if cloud_coverage > 10:
        confidence -= 5
    if document_count < 2:
        confidence -= 10
    if ndvi < 0.3:
        confidence -= 5
    
    result = {
        "valuation": valuation,
        "confidence": max(60, min(95, confidence)),
        "factors": {
            "base_price_per_sqm": base_price,
            "area_factor": area_factor,
            "doc_factor": doc_factor,
            "ndvi_quality": "high" if ndvi > 0.6 else "moderate" if ndvi > 0.4 else "low"
        }
    }
    
    return result

def analyze_property(data):
    """Analyze property using OpenRouter with direct API call and market price data"""
    try:
        api_key = os.getenv('OPENROUTER_API_KEY')
        
        if not api_key:
            raise ValueError("OPENROUTER_API_KEY not configured")
        
        # Extract data
        satellite_data = data.get('satellite_data', {})
        area_sqm = satellite_data.get('area_sqm', 200)
        ndvi = satellite_data.get('ndvi', 0.5)
        cloud_coverage = satellite_data.get('cloud_coverage', 5)
        document_count = data.get('document_count', 0)
        latitude = data.get('latitude', 0)
        longitude = data.get('longitude', 0)
        location = data.get('location', f"{latitude},{longitude}")
        
        # Fetch market price data from Google Custom Search
        market_data = {}
        try:
            market_data = get_market_valuation(location, latitude, longitude, area_sqm)
            if not market_data.get('error'):
                print(f"✓ Market data: ${market_data.get('average_price', 0):,} avg, {market_data.get('price_count', 0)} sources", file=sys.stderr)
        except Exception as e:
            print(f"⚠️  Market price fetch failed: {e}", file=sys.stderr)
        
        # Calculate valuation with market data influence
        base_valuation = calculate_valuation(area_sqm, ndvi, cloud_coverage, document_count)
        
        # If we have market data, blend it with satellite-based valuation
        final_valuation = base_valuation['valuation']
        final_confidence = base_valuation['confidence']
        
        if market_data.get('average_price') and not market_data.get('error'):
            market_price = market_data.get('estimated_valuation', market_data.get('average_price', 0))
            # Weighted average: 60% market data, 40% satellite data
            if market_price > 0:
                final_valuation = int(market_price * 0.6 + base_valuation['valuation'] * 0.4)
                # Increase confidence if market data available
                final_confidence = min(95, final_confidence + 10)
        
        # Use OpenRouter API for reasoning
        try:
            market_info = ""
            if market_data.get('average_price') and not market_data.get('error'):
                market_info = f"\n- Market Average: ${market_data.get('average_price', 0):,} ({market_data.get('price_count', 0)} sources)"
            
            response = client.chat.completions.create(
                model="openai/gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a real estate valuation expert. Provide brief, professional reasoning for property valuations."
                    },
                    {
                        "role": "user",
                        "content": f"""Property Analysis:
- Location: {location}
- Area: {area_sqm} sqm
- Vegetation Health (NDVI): {ndvi}
- Cloud Coverage: {cloud_coverage}%
- Documents: {document_count}{market_info}
- Final Valuation: ${final_valuation:,}
- Confidence: {final_confidence}%

Provide a brief 1-2 sentence reasoning for this valuation."""
                    }
                ]
            )
            
            reasoning = response.choices[0].message.content
        except Exception as e:
            reasoning = f"Analysis based on {area_sqm} sqm property with NDVI {ndvi} and {document_count} documents. "
            if market_data.get('average_price'):
                reasoning += f"Market data shows average price of ${market_data.get('average_price', 0):,}. "
            reasoning += f"Vegetation health indicates {'premium' if ndvi > 0.6 else 'moderate' if ndvi > 0.4 else 'standard'} land quality."
        
        result = {
            "valuation": final_valuation,
            "confidence": final_confidence,
            "reasoning": reasoning,
            "risk_factors": [
                "Cloud coverage impact" if cloud_coverage > 10 else None,
                "Limited documentation" if document_count < 2 else None,
                "Low vegetation index" if ndvi < 0.3 else None,
                "No market data" if market_data.get('error') else None
            ],
            "agent": "openrouter",
            "market_data": {
                "has_data": not market_data.get('error'),
                "average_price": market_data.get('average_price', 0),
                "source_count": market_data.get('price_count', 0)
            } if market_data else {}
        }
        
        # Filter out None values from risk_factors
        result["risk_factors"] = [r for r in result["risk_factors"] if r]
        
        return result
        
    except Exception as e:
        return {
            "error": str(e),
            "agent": "openrouter"
        }

if __name__ == "__main__":
    # Read input from stdin or args
    if len(sys.argv) > 1:
        input_data = json.loads(sys.argv[1])
    else:
        input_data = json.loads(sys.stdin.read())
    
    result = analyze_property(input_data)
    print(json.dumps(result))
