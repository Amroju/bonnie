import os
import shutil
import random
import re
from PIL import Image
from PIL.ExifTags import TAGS

source_dir = 'C:/Users/Asus/Desktop/Bonnie/photos/lei/lei-20260628T222352Z-3-001/lei'
target_dir = 'C:/Users/Asus/Desktop/Bonnie/public/images/gallery'

os.makedirs(target_dir, exist_ok=True)

files = [f for f in os.listdir(source_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]

def get_exif_date(filepath):
    try:
        img = Image.open(filepath)
        exif = img.getexif()
        for k, v in exif.items():
            if TAGS.get(k) == 'DateTimeOriginal' or TAGS.get(k) == 'DateTime':
                return str(v)
    except Exception:
        pass
    return "9999:99:99"

files.sort(key=lambda f: get_exif_date(os.path.join(source_dir, f)))
random.seed(42)

def get_semantic_emoji(text):
    text = text.lower()
    
    # Specific requests
    if 'compleanno' in text: return '🎂'
    if 'cucino' in text: return '👨‍🍳'
    if 'montagna' in text: return '⛰️'
    if 'tiramis' in text: return '🍰'
    if 'torta' in text: return '🍰'
    if 'cibo' in text: return '🍝'
    
    # General matches
    if 'baci' in text or 'mwa' in text or 'mwaa' in text: return '💋'
    if 'piogg' in text or 'meteorologico' in text: return '🌧️'
    if 'dorm' in text or 'nott' in text or 'sera' in text: return '🌙'
    if 'osterie' in text or 'cena' in text: return '🍷'
    if 'trenitalia' in text or 'treno' in text or 'gita' in text: return '🚂'
    if 'sole' in text or 'giornat' in text: return '☀️'
    if 'orsetto' in text: return '🧸'
    if 'fior' in text: return '🌹'
    if 'occhi' in text or 'bella' in text: return '✨'
    if 'natale' in text or 'regalo' in text: return '💖'
    
    return random.choice(['🤍', '✨', '🥺', '💫', '🫶']) # Variety of cute fallbacks!

photos_js = []
for i, f in enumerate(files):
    ext = os.path.splitext(f)[1].lower()
    new_name = f'gal_{i}{ext}'
    shutil.copy(os.path.join(source_dir, f), os.path.join(target_dir, new_name))
    
    caption = os.path.splitext(f)[0]
    caption = caption.strip()
    caption = caption.replace(' ( ', ' (')
    caption = caption.replace(' ) ', ') ')
    caption = caption.replace("capira'", 'capirà')
    caption = caption.replace("perche'", 'perché')
    caption = caption.replace("tiramisu'", 'tiramisù')
    caption = caption.replace('npn', 'non')
    caption = caption.replace('gia;', 'già')
    caption = caption.replace("papa'", 'papà')
    caption = caption.replace("qualita'", 'qualità')
    
    caption = re.sub(r'(?<!,)\s+ma\s+', ', ma ', caption)
    caption = re.sub(r'(?<!,)\s+eppure\s+', ', eppure ', caption)
    
    if len(caption) > 0:
        caption = caption[0].upper() + caption[1:]
        
    if not caption.endswith(('.', '!', '?')):
        caption += '.'
        
    rotate = random.uniform(-4, 4)
    emoji = get_semantic_emoji(caption)
    
    if emoji:
        caption_jsx = f'<>{caption} <AppleEmoji emoji="{emoji}" /></>'
    else:
        caption_jsx = f'<>{caption}</>'
    
    photos_js.append(f'  {{ id: {i}, src: "/images/gallery/{new_name}", caption: {caption_jsx}, rotate: {rotate:.1f} }}')

photos_array_str = 'const PHOTOS = [\n' + ',\n'.join(photos_js) + '\n];'

gallery_path = 'C:/Users/Asus/Desktop/Bonnie/src/components/Gallery.jsx'
with open(gallery_path, 'r', encoding='utf-8') as file:
    content = file.read()

content = re.sub(r'const PHOTOS = \[.*?\];', photos_array_str, content, flags=re.DOTALL)

with open(gallery_path, 'w', encoding='utf-8') as file:
    file.write(content)

print('Successfully mapped emojis with varied cute fallbacks!')
