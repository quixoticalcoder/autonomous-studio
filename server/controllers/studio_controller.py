"""Controller for complete studio workflow"""

from utils.api_client import call_openrouter
from utils.json_parser import clean_json_response
from utils.prompt_generator import (
    generate_idea_prompt,
    generate_critic_prompt,
    generate_refiner_prompt,
    generate_presenter_prompt
)

def run_complete_workflow(data):
    """Execute complete autonomous-studio workflow"""
    topic = data.get('topic', '')
    prompt_style = data.get('promptStyle', 'standard')
    
    workflow = []
    
    # Idea Agent
    idea_prompt = generate_idea_prompt(topic, prompt_style)
    idea_response = call_openrouter(idea_prompt, "gemini")
    ideas = clean_json_response(idea_response)
    workflow.append({"agent": "Idea Agent", "output": ideas})
    
    if "error" in ideas:
        return {
            "workflow": workflow,
            "error": "Failed at Idea Agent"
        }, 500
    
    # Critic Agent
    critic_prompt = generate_critic_prompt(topic, ideas.get('concepts', []), prompt_style)
    critic_response = call_openrouter(critic_prompt, "gemini", 0.6)
    critiques = clean_json_response(critic_response)
    workflow.append({"agent": "Critic Agent", "output": critiques})
    
    if "error" in critiques:
        return {
            "workflow": workflow,
            "error": "Failed at Critic Agent"
        }, 500
    
    # Refiner Agent
    refiner_prompt = generate_refiner_prompt(
        topic, 
        ideas.get('concepts', []), 
        critiques.get('critiques', []), 
        prompt_style
    )
    refiner_response = call_openrouter(refiner_prompt, "gemini")
    refined = clean_json_response(refiner_response)
    workflow.append({"agent": "Refiner Agent", "output": refined})
    
    # Presenter Agent
    presenter_prompt = generate_presenter_prompt(
        topic, 
        refined.get('refined', []), 
        prompt_style
    )
    presenter_response = call_openrouter(presenter_prompt, "gemini")
    presentation = clean_json_response(presenter_response)
    workflow.append({"agent": "Presenter Agent", "output": presentation})
    
    return {
        "workflow": workflow,
        "finalOutput": presentation if "error" not in presentation else None,
        "promptStyle": prompt_style,
        "totalConcepts": len(ideas.get('concepts', [])),
        "status": "completed"
    }, 200