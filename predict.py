import sys
import time
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
model = BlipForConditionalGeneration.from_pretrained("blip-image-captioning-model")

def generate_caption(image_path, text=None):

    raw_image = Image.open(image_path).convert('RGB')

    if text:
        inputs = processor(raw_image, text, return_tensors="pt")
    else:
        inputs = processor(raw_image, return_tensors="pt")

    out = model.generate(**inputs)
    caption = processor.decode(out[0], skip_special_tokens=True)
    return caption

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python image_captioning.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]

    start_time = time.time()
    caption = generate_caption(image_path)
    end_time = time.time()
    
    print(caption)
    # print("Response time:", end_time - start_time, "seconds")
