import os
import json
from google import genai
from dotenv import load_dotenv

def normalize_name(name):
    """Normalize card names for matching between datasets."""
    return name.lower().replace("the ", "").strip()

def load_data(filepath):
    with open(filepath, 'r') as f:
        return json.load(f)

def get_shadow_visual_from_llm(client, card_name, upright_desc, shadow_meanings):
    """Ask Gemini to invent a scene-based visual description for the shadow state."""
    shadow_meaning_str = ", ".join(shadow_meanings)
    
    prompt = f"""
You are an expert Tarot illustrator and narrative designer.
I am designing a visual ambigram (optical illusion) for the Tarot card: {card_name}.

UPRIGHT VISUAL SCENE:
{upright_desc}

SHADOW MEANING (when the card is inverted):
{shadow_meaning_str}

TASK:
Invent a visual description of the scene when the card is flipped upside down (the Shadow state). 
It should visually contrast the upright scene while structurally reflecting it (as an optical illusion), and deeply embody the shadow meaning.
Keep it purely descriptive of the SCENE and ACTION (e.g. "An overturned lantern falling into an abyss"). Do NOT add artistic style keywords (like steampunk or metallic), just describe what is happening in the scene.

Output ONLY a single, concise paragraph of the visual description. No introductory text.
"""
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text.strip()
    except Exception as e:
        print(f"Error generating shadow visual for {card_name}: {e}")
        return "Error generating visual description."

def main():
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Please set your GEMINI_API_KEY environment variable.")
        return
        
    client = genai.Client(api_key=api_key)
    
    # File paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    alt_text_path = os.path.join(base_dir, "data", "Alt Text Tarot Json", "tarot.json")
    interp_path = os.path.join(base_dir, "tarot_interpretations.json")
    output_path = os.path.join(base_dir, "data", "compiled_tarot_packets.json")
    
    alt_data = load_data(alt_text_path)["tarot"]
    interp_data = load_data(interp_path)["tarot_interpretations"]
    
    # Create a lookup dictionary from the Alt Text dataset
    alt_lookup = {}
    for card in alt_data:
        alt_lookup[normalize_name(card["name"])] = card
        
    compiled_packets = []
    
    print("Starting Data Synthesis for Major Arcana...")
    
    for idx, interp_card in enumerate(interp_data):
        # We only want Major Arcana for now
        if interp_card.get("suit") != "major":
            continue
            
        name = interp_card["name"]
        norm_name = normalize_name(name)
        
        # Match with Alt Text dataset
        if norm_name not in alt_lookup:
            print(f"Warning: Could not find Alt Text data for {name}")
            continue
            
        alt_card = alt_lookup[norm_name]
        upright_desc = alt_card.get("description", "")
        
        light_meanings = interp_card.get("meanings", {}).get("light", [])
        shadow_meanings = interp_card.get("meanings", {}).get("shadow", [])
        
        print(f"[{idx}] Generating shadow visual for: {name}...")
        shadow_visual = get_shadow_visual_from_llm(client, name, upright_desc, shadow_meanings)
        
        # Structure the final data packet based on our schema
        # Format ID (e.g. major_00, major_09)
        rank_str = str(interp_card["rank"]).zfill(2)
        card_id = f"major_{rank_str}"
        
        packet = {
            "id": card_id,
            "name": name.upper(),
            # Shadow name would be pulled from the other script's output, defaulting to placeholder for now
            "shadow_name": f"SHADOW OF {name.upper()}", 
            "description_info": {
                "general_theme": ", ".join(interp_card.get("keywords", []))
            },
            "positions": {
                "upright": {
                    "meaning": ", ".join(light_meanings),
                    "visual_description": upright_desc
                },
                "inverted": {
                    "meaning": ", ".join(shadow_meanings),
                    "visual_description": shadow_visual
                }
            },
            "assets": {
                "image_texture": f"{card_id}_anagram.png"
            }
        }
        
        compiled_packets.append(packet)
        
        # Break early for testing purposes (just one card) to avoid hitting rate limits instantly
        if len(compiled_packets) >= 1:
            print("Stopping after 1 card for verification testing. (Remove break statement to run all 22).")
            break

    # Save to file
    with open(output_path, "w") as f:
        json.dump(compiled_packets, f, indent=4)
        
    print(f"\nSuccessfully compiled data packets to {output_path}")

if __name__ == "__main__":
    main()
