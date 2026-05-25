import json
import csv
import os

# Define paths dynamically
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
master_json_path = os.path.join(BASE_DIR, "engine", "master_synthesis.json")
output_csv_path = os.path.join(BASE_DIR, "ideogram_batch_prompts.csv")

def generate_csv():
    # Load the master synthesis data
    try:
        with open(master_json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: {master_json_path} not found.")
        return

    # Define the CSV headers based on the template
    headers = [
        "prompt", "visibility", "aspect_ratio", "magic_prompt", 
        "model", "seed_number", "rendering", "negative_prompt", 
        "style", "color_palette", "num_images"
    ]

    rows = []
    
    for key, card in data.items():
        name = card.get("name", "Unknown Card")
        thesis = card.get("thesis", "")
        antithesis = card.get("antithesis", "")
        card_class = card.get("class", "").upper()
        
        # Construct the prompt mimicking the template structure
        prompt = (
            f"11:19 aspect ratio, metallic bas-relief tarot card. "
            f"Top half: {name} - {thesis} (Thesis). "
            f"Bottom half: An inverted 180-degree mirror image showing {name} - {antithesis} (Antithesis). "
            f"Seamless Thatcher Effect morph at the waistline. "
            f"Steampunk Technomancy aesthetic, brass and oxidized copper, neon amber fractal wiring. "
            f"Embossed text: '{card_class}'."
        )
        
        # Build the row dictionary
        row = {
            "prompt": prompt,
            "visibility": "private",
            "aspect_ratio": "11:19:00",
            "magic_prompt": "on",
            "model": "D3lphi",
            "seed_number": "",
            "rendering": "quality",
            "negative_prompt": "",
            "style": "Metallic technomancy",
            "color_palette": "#457B5A #B8860B #8B4513 #00F0FF #FF7E1B",
            "num_images": "1"
        }
        rows.append(row)

    # Write to CSV
    with open(output_csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)
        
    print(f"Successfully generated {output_csv_path} with {len(rows)} prompts.")

if __name__ == '__main__':
    generate_csv()
