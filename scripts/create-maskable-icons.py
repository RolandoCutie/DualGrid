#!/usr/bin/env python3
"""Create maskable PWA icons with proper safe zone."""
from PIL import Image
import os

BASE = os.path.join(os.path.dirname(__file__), '..', 'public')
src = Image.open(os.path.join(BASE, 'cubawayicon-512.png')).convert('RGBA')

# Maskable icons need content within 80% center (safe zone)
# Use 15% padding on each side to be safe
bg = Image.new('RGBA', (512, 512), (141, 198, 63, 255))  # #8dc63f
inner = src.resize((358, 358), Image.LANCZOS)
bg.paste(inner, (77, 77), inner)
bg.convert('RGB').save(os.path.join(BASE, 'cubawayicon-maskable-512.png'), 'PNG', optimize=True)

bg2 = bg.resize((192, 192), Image.LANCZOS)
bg2.convert('RGB').save(os.path.join(BASE, 'cubawayicon-maskable-192.png'), 'PNG', optimize=True)

print('Created maskable icons!')
print(f'  512: {os.path.getsize(os.path.join(BASE, "cubawayicon-maskable-512.png"))} bytes')
print(f'  192: {os.path.getsize(os.path.join(BASE, "cubawayicon-maskable-192.png"))} bytes')
