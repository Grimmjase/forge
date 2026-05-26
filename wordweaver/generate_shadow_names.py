import os
import re
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from google import genai
from dotenv import load_dotenv

# The 22 Major Arcana
MAJOR_ARCANA = [
    "THE FOOL", "THE MAGICIAN", "THE HIGH PRIESTESS", "THE EMPRESS", "THE EMPEROR",
    "THE HIEROPHANT", "THE LOVERS", "THE CHARIOT", "STRENGTH", "THE HERMIT",
    "WHEEL OF FORTUNE", "JUSTICE", "THE HANGED MAN", "DEATH", "TEMPERANCE",
    "THE DEVIL", "THE TOWER", "THE STAR", "THE MOON", "THE SUN", "JUDGEMENT",
    "THE WORLD"
]

def load_font(size=40):
    """Attempt to load a clean sans-serif font for consistent pixel measuring."""
    font_paths = [
        "/Library/Fonts/Arial.ttf",  # macOS
        "/System/Library/Fonts/Helvetica.ttc", # macOS fallback
        "C:\\Windows\\Fonts\\arial.ttf", # Windows
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf" # Linux
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    # Fallback if no TTF found
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()

def text_to_image(text, font):
    """Renders text to a binary numpy array (white text on black bg)."""
    # Create a dummy image to calculate bounding box
    dummy_img = Image.new('L', (1, 1))
    draw = ImageDraw.Draw(dummy_img)
    try:
        bbox = draw.textbbox((0, 0), text, font=font)
        width, height = bbox[2] - bbox[0], bbox[3] - bbox[1]
    except AttributeError:
        # Fallback for older PIL
        width, height = draw.textsize(text, font=font)
    
    # Add a little padding
    width += 10
    height += 10

    # Draw the actual text
    img = Image.new('L', (width, height), color=0)
    draw = ImageDraw.Draw(img)
    try:
        draw.text((5, 5), text, fill=255, font=font)
    except Exception:
        draw.text((5, 5), text, fill=255)
    
    # Crop to exact bounding box to align perfectly
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    return img

def calculate_iou(img1, img2):
    """Calculates Pixel Intersection over Union between two images."""
    # Resize img2 to match img1 dimensions if they slightly differ due to character kerning
    if img1.size != img2.size:
        img2 = img2.resize(img1.size, Image.Resampling.BILINEAR)
        
    arr1 = np.array(img1) > 128
    arr2 = np.array(img2) > 128
    
    intersection = np.logical_and(arr1, arr2).sum()
    union = np.logical_or(arr1, arr2).sum()
    
    if union == 0:
        return 0
    return intersection / union

def get_candidates_from_llm(card_name, api_key):
    """Uses Gemini to brainstorm exactly same-length shadow concepts."""
    client = genai.Client(api_key=api_key)
    length = len(card_name)
    
    prompt = f"""
You are an expert Tarot designer and wordsmith.
I am designing a visual ambigram where the card shows "{card_name}" when upright, and a "shadow" theme when inverted.
The original card name "{card_name}" has exactly {length} characters (including spaces).
I need 20 distinct "shadow" names or concepts that represent the dark, reversed, or hidden meaning of this card.
CRITICAL CONSTRAINT: Each suggestion MUST have EXACTLY {length} characters (including spaces).
Output ONLY the suggestions, one per line, in ALL CAPS. Do not include numbers, bullet points, or extra text.
"""
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        # Parse lines and filter strictly by length
        candidates = []
        for line in response.text.split('\n'):
            clean_line = line.strip().upper()
            if len(clean_line) == length and clean_line != card_name:
                candidates.append(clean_line)
        return list(set(candidates))
    except Exception as e:
        print(f"Error fetching from Gemini: {e}")
        return []

def evaluate_shadows(card_name, candidates, font):
    """Scores a list of candidate strings against the upright card name using inverted pixel overlap."""
    results = []
    img_light = text_to_image(card_name, font)
    
    for shadow in candidates:
        img_shadow = text_to_image(shadow, font)
        # Rotate the shadow image 180 degrees (ambigram simulation)
        img_shadow_inverted = img_shadow.rotate(180, expand=True)
        
        iou_score = calculate_iou(img_light, img_shadow_inverted)
        results.append({
            "shadow_name": shadow,
            "iou_score": float(iou_score)
        })
        
    # Sort by highest score first
    results.sort(key=lambda x: x["iou_score"], reverse=True)
    return results

def main():
    # Load .env file automatically
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Please set your GEMINI_API_KEY environment variable to use the LLM generator.")
        print("Example: export GEMINI_API_KEY='your_key'")
        return

    font = load_font(size=60)
    print("Loaded font successfully. Starting Ambigram Pipeline...\n")
    
    # For testing, we'll just run it on the first card
    # To run on all, use: for card in MAJOR_ARCANA:
    test_cards = ["THE HERMIT"] 
    
    all_results = {}
    
    for card in test_cards:
        print(f"--- Processing: {card} (Length: {len(card)}) ---")
        candidates = get_candidates_from_llm(card, api_key)
        
        if not candidates:
            print("No valid candidates generated. Skipping.")
            continue
            
        print(f"Generated {len(candidates)} valid length-matched candidates.")
        scored = evaluate_shadows(card, candidates, font)
        
        print("Top 3 Shadow Names (Pixel Similarity):")
        for i in range(min(3, len(scored))):
            print(f"  {i+1}. {scored[i]['shadow_name']} (Score: {scored[i]['iou_score']:.4f})")
            
        all_results[card] = scored
        
    # Save results to data folder
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(BASE_DIR, "..", "data", "shadow_ambigram_candidates.json")
    with open(output_path, "w") as f:
        json.dump(all_results, f, indent=4)
    print(f"\nSaved full results to {output_path}")

if __name__ == "__main__":
    main()
