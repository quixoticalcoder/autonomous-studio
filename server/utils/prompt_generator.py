"""Prompt generation utilities for different AI agents"""

import json
from config.constansts import PROMPT_TEMPLATES

def generate_idea_prompt(topic, prompt_style="standard"):
    """Generate enhanced prompt for Idea Agent based on style"""
    template = PROMPT_TEMPLATES.get(prompt_style, PROMPT_TEMPLATES["standard"])
    
    return f"""As a Creative Idea Strategist, generate exactly 3 groundbreaking concepts for: "{topic}"

TONE: {template['tone']}
STYLE: {template['style']}

For EACH concept, provide:
1. A compelling title
2. A comprehensive 2-3 sentence description
3. Key innovation points
4. Potential impact/benefits
5. Tags (3-5 relevant keywords)

Respond in this EXACT JSON format:
{{
  "concepts": [
    {{
      "id": 1,
      "title": "Innovative Title",
      "description": "Detailed description highlighting uniqueness and value proposition.",
      "innovation": ["Point 1", "Point 2", "Point 3"],
      "impact": ["Benefit 1", "Benefit 2"],
      "tags": ["tag1", "tag2", "tag3"],
      "feasibility": "High/Medium/Low",
      "novelty": "High/Medium/Low"
    }},
    {{"id": 2, ... }},
    {{"id": 3, ... }}
  ],
  "strategyOverview": "Brief analysis of the strategic approach"
}}

Ensure concepts are distinct, actionable, and aligned with modern innovation principles."""

def generate_critic_prompt(topic, concepts, prompt_style="standard"):
    """Generate enhanced prompt for Critic Agent"""
    template = PROMPT_TEMPLATES.get(prompt_style, PROMPT_TEMPLATES["standard"])
    
    return f"""As a Strategic Critic & Risk Analyst, conduct a rigorous evaluation of these concepts for: "{topic}"

TONE: {template['tone']}
STYLE: {template['style']}

Concepts to evaluate:
{json.dumps(concepts, indent=2)}

For EACH concept, provide a comprehensive analysis with:
1. STRENGTHS (competitive advantages, unique value)
2. WEAKNESSES (risks, limitations, potential failures)
3. MARKET VIABILITY (target audience, market fit)
4. IMPLEMENTATION CHALLENGES (technical, resource, timeline)
5. STRATEGIC RECOMMENDATIONS (concrete improvement suggestions)

Respond in this EXACT JSON format:
{{
  "critiques": [
    {{
      "id": 1,
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"],
      "marketViability": "Analysis of market fit",
      "implementationChallenges": ["Challenge 1", "Challenge 2"],
      "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
      "riskLevel": "High/Medium/Low",
      "potentialROI": "High/Medium/Low"
    }},
    {{"id": 2, ... }},
    {{"id": 3, ... }}
  ],
  "comparativeAnalysis": "Brief comparison across all concepts"
}}

Be objective, evidence-based, and constructive in your criticism."""

def generate_refiner_prompt(topic, concepts, critiques, prompt_style="standard"):
    """Generate enhanced prompt for Refiner Agent"""
    template = PROMPT_TEMPLATES.get(prompt_style, PROMPT_TEMPLATES["standard"])
    
    return f"""As an Innovation Refinement Specialist, synthesize and enhance the concepts based on critical feedback for: "{topic}"

TONE: {template['tone']}
STYLE: {template['style']}

Original Concepts:
{json.dumps(concepts, indent=2)}

Critical Feedback:
{json.dumps(critiques, indent=2)}

For EACH refined concept, provide:
1. Enhanced title (more compelling)
2. Improved description (addressing critiques)
3. Key refinements made
4. Mitigation strategies for identified risks
5. Enhanced innovation features
6. Implementation roadmap highlights

Respond in this EXACT JSON format:
{{
  "refined": [
    {{
      "id": 1,
      "title": "Enhanced Title",
      "description": "Improved description addressing feedback",
      "improvements": ["Improvement 1", "Improvement 2"],
      "riskMitigations": ["Mitigation 1", "Mitigation 2"],
      "enhancedFeatures": ["Feature 1", "Feature 2"],
      "implementationSteps": ["Step 1", "Step 2"],
      "valueProposition": "Clear statement of refined value"
    }},
    {{"id": 2, ... }},
    {{"id": 3, ... }}
  ],
  "refinementSummary": "Summary of key improvements across all concepts"
}}

Transform good ideas into exceptional, actionable solutions."""

def generate_presenter_prompt(topic, refined_concepts, prompt_style="standard"):
    """Generate enhanced prompt for Presenter Agent"""
    template = PROMPT_TEMPLATES.get(prompt_style, PROMPT_TEMPLATES["standard"])
    
    return f"""As an Executive Presentation Strategist, create a compelling final presentation for: "{topic}"

TONE: {template['tone']}
STYLE: {template['style']}

Refined Concepts:
{json.dumps(refined_concepts, indent=2)}

Create a professional executive package with:
1. EXECUTIVE SUMMARY (overview, strategic importance)
2. RECOMMENDATION (clear action recommendation with rationale)
3. TOP CONCEPT SELECTION (with detailed justification)
4. IMPLEMENTATION TIMELINE (phased approach)
5. SUCCESS METRICS (KPIs, measurement criteria)
6. NEXT STEPS (immediate actions)

Respond in this EXACT JSON format:
{{
  "summary": "Comprehensive executive summary highlighting strategic value and innovation potential",
  "recommendation": "Clear, actionable recommendation with business justification",
  "topConcept": {{
    "title": "Selected concept title",
    "description": "Detailed description",
    "rationale": "Strategic rationale for selection",
    "competitiveAdvantage": ["Advantage 1", "Advantage 2"],
    "expectedImpact": "Business/innovation impact",
    "implementationTimeline": "3-6-12 month phases"
  }},
  "successMetrics": {{
    "shortTerm": ["Metric 1", "Metric 2"],
    "longTerm": ["Metric 1", "Metric 2"]
  }},
  "nextSteps": ["Step 1", "Step 2", "Step 3"],
  "presentationNotes": "Key talking points for stakeholders"
}}

Craft this as if presenting to C-level executives or board members."""