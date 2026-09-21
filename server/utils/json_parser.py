"""JSON parsing and cleaning utilities"""

import json

def clean_json_response(response):
    """Clean and parse JSON from API responses"""
    if isinstance(response, dict) and "error" in response:
        return response
    
    if not isinstance(response, str):
        response = str(response)
    
    # Remove markdown code blocks
    cleaned = response.replace("```json", "").replace("```", "").strip()
    
    # Handle potential formatting issues
    cleaned = cleaned.replace('\n', ' ').replace('\r', '')
    
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        print(f"Raw response: {response[:500]}...")
        
        # Try to extract JSON from malformed response
        try:
            # Look for JSON-like content
            start = cleaned.find('{')
            end = cleaned.rfind('}') + 1
            if start >= 0 and end > start:
                json_str = cleaned[start:end]
                return json.loads(json_str)
        except:
            pass
        
        return {
            "error": f"JSON parsing error: {str(e)}",
            "raw": response[:500] + "..."
        }