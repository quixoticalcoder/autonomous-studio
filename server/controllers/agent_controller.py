"""Controller for AI agent operations"""

import time
from utils.api_client import call_openrouter
from utils.json_parser import clean_json_response
from utils.prompt_generator import (
    generate_idea_prompt,
    generate_critic_prompt,
    generate_refiner_prompt,
    generate_presenter_prompt
)
from models.history_schema import History

def process_agent_request(endpoint, data, user_id=None):
    """Process agent request and return formatted response"""
    start_time = time.time()
    
    topic = data.get('topic', '')
    concepts = data.get('concepts', [])
    critiques = data.get('critiques', [])
    refined = data.get('refined', [])
    agent_model = data.get('agent', 'xiaomi')
    prompt_style = data.get('promptStyle', 'standard')
    
    # Generate appropriate prompt based on endpoint and style
    if endpoint == 'idea':
        prompt = generate_idea_prompt(topic, prompt_style)
        temperature = 0.8 if prompt_style == 'creative' else 0.7
    elif endpoint == 'critic':
        prompt = generate_critic_prompt(topic, concepts, prompt_style)
        temperature = 0.6  # Lower temp for critical analysis
    elif endpoint == 'refiner':
        prompt = generate_refiner_prompt(topic, concepts, critiques, prompt_style)
        temperature = 0.7
    elif endpoint == 'presenter':
        prompt = generate_presenter_prompt(topic, refined, prompt_style)
        temperature = 0.7
    else:
        return {"error": f"Unknown endpoint: {endpoint}"}, 400
    
    # Call the API
    response = call_openrouter(prompt, agent_model, temperature)
    
    # Parse the response
    result = clean_json_response(response)
    
    execution_time = round(time.time() - start_time, 2)
    
    response_data = {
        "agent": f"{agent_model.capitalize()} {endpoint.capitalize()} Agent",
        "promptStyle": prompt_style,
        "executionTime": execution_time,
        "modelUsed": agent_model,
        "output": result
    }
    
    # Save to history if this is the presenter agent (final step)
    if endpoint == 'presenter' and user_id:
        try:
            history_entry = History.create_history(
                user_id=user_id,
                topic=topic,
                concepts=concepts,
                critiques=critiques,
                refined=refined,
                presentation=result,
                agent_model=agent_model,
                prompt_style=prompt_style,
                execution_time=execution_time
            )
            response_data['history_id'] = str(history_entry._id)
            response_data['saved_to_history'] = True
        except Exception as e:
            print(f"Error saving to history: {e}")
            # Don't fail the request if history save fails
            response_data['saved_to_history'] = False
            response_data['history_error'] = str(e)
    
    return response_data, 200