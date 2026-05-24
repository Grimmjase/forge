import json

with open('tarot_interpretations.json', 'r') as f:
    data = json.load(f)

tarot_cards = data.get('tarot_interpretations', [])
prompts = []

for card in tarot_cards:
    name = card.get('name', '')
    
    light_meanings = ", ".join(card.get('keywords', [])[:3])
    shadow_meanings = ", ".join(card.get('meanings', {}).get('shadow', [])[:2]).lower()
    
    # We create stylistic prompts
    upright_prompt = f"a vintage esoteric lithograph representing {name}, {light_meanings}"
    inverted_prompt = f"a vintage esoteric lithograph representing {name}, {shadow_meanings}"
    
    safe_name = name.lower().replace(' ', '_').replace('/', '_')
    
    prompts.append({
        'name': safe_name,
        'upright_prompt': upright_prompt,
        'inverted_prompt': inverted_prompt
    })

with open('tarot_prompts.json', 'w') as f:
    json.dump(prompts, f, indent=4)

print(f"Successfully generated tarot_prompts.json with {len(prompts)} cards.")
