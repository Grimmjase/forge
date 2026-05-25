import json
import argparse
from pathlib import Path
import torch
import gc
from diffusers import DiffusionPipeline

from visual_anagrams.views import get_views
from visual_anagrams.samplers import sample_stage_1, sample_stage_2
from visual_anagrams.utils import save_illusion, save_metadata

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--save_dir", type=str, default='results_tarot', help='Location to save samples')
    parser.add_argument("--device", type=str, default='mps')
    parser.add_argument("--num_inference_steps", type=int, default=30)
    parser.add_argument("--guidance_scale", type=float, default=10.0)
    parser.add_argument("--reduction", type=str, default='mean')
    parser.add_argument("--noise_level", type=int, default=50)
    parser.add_argument("--generate_1024", action='store_true')
    parser.add_argument("--start_idx", type=int, default=0, help="Start from a specific card index")
    args = parser.parse_args()

    prompts_path = Path(__file__).parent / '../tarot_prompts.json'
    with open(prompts_path, 'r') as f:
        prompts_data = json.load(f)

    # Load Stage 1 (XL)
    print("Loading DeepFloyd IF Stage 1 (XL)...")
    stage_1 = DiffusionPipeline.from_pretrained(
                    "DeepFloyd/IF-I-XL-v1.0",
                    variant="fp16",
                    torch_dtype=torch.float16)
    # CPU offload might be buggy on MPS, but we'll try it
    stage_1.enable_model_cpu_offload()
    stage_1 = stage_1.to(args.device)

    # Load Stage 2
    print("Loading DeepFloyd IF Stage 2...")
    stage_2 = DiffusionPipeline.from_pretrained(
                    "DeepFloyd/IF-II-M-v1.0",
                    text_encoder=None,
                    variant="fp16",
                    torch_dtype=torch.float16,
                )
    stage_2.enable_model_cpu_offload()
    stage_2 = stage_2.to(args.device)

    stage_3 = None
    if args.generate_1024:
        print("Loading Stable Diffusion 4x Upscaler...")
        stage_3 = DiffusionPipeline.from_pretrained(
                        "stabilityai/stable-diffusion-x4-upscaler", 
                        torch_dtype=torch.float16
                    )
        stage_3.enable_model_cpu_offload()
        stage_3 = stage_3.to(args.device)

    views = get_views(['identity', 'rotate_180'])
    save_dir = Path(args.save_dir)
    save_dir.mkdir(exist_ok=True, parents=True)

    for i, card in enumerate(prompts_data[args.start_idx:]):
        card_idx = i + args.start_idx
        name = card['name']
        p1 = card['upright_prompt']
        p2 = card['inverted_prompt']
        print(f"[{card_idx+1}/{len(prompts_data)}] Generating: {name}")
        
        card_dir = save_dir / name
        card_dir.mkdir(exist_ok=True, parents=True)
        
        prompts = [p1, p2]
        prompt_embeds = [stage_1.encode_prompt(p) for p in prompts]
        prompt_embeds_list, negative_prompt_embeds_list = zip(*prompt_embeds)
        prompt_embeds = torch.cat(prompt_embeds_list)
        negative_prompt_embeds = torch.cat(negative_prompt_embeds_list)
        
        # Save metadata
        save_metadata(views, args, card_dir)

        generator = torch.manual_seed(42 + card_idx)
        sample_dir = card_dir / '0000'
        sample_dir.mkdir(exist_ok=True, parents=True)

        print("  -> Sampling 64x64...")
        image = sample_stage_1(stage_1, 
                               prompt_embeds,
                               negative_prompt_embeds,
                               views,
                               num_inference_steps=args.num_inference_steps,
                               guidance_scale=args.guidance_scale,
                               reduction=args.reduction,
                               generator=generator)
        save_illusion(image, views, sample_dir)

        print("  -> Sampling 256x256...")
        image = sample_stage_2(stage_2,
                               image,
                               prompt_embeds,
                               negative_prompt_embeds, 
                               views,
                               num_inference_steps=args.num_inference_steps,
                               guidance_scale=args.guidance_scale,
                               reduction=args.reduction,
                               noise_level=args.noise_level,
                               generator=generator)
        save_illusion(image, views, sample_dir)

        if args.generate_1024 and stage_3 is not None:
            print("  -> Upsampling to 1024x1024...")
            image_1024 = stage_3(
                            prompt=prompts[0], 
                            image=image, 
                            noise_level=0,
                            output_type='pt',
                            generator=generator).images
            save_illusion(image_1024 * 2 - 1, views, sample_dir)
            
        # Free some memory if possible
        if args.device == 'mps':
            torch.mps.empty_cache()
        elif args.device == 'cuda':
            torch.cuda.empty_cache()
        gc.collect()

if __name__ == "__main__":
    main()
