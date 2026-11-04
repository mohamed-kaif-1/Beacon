import os
import struct
import io
import resvg_py
from PIL import Image
# Exact Quiet Path ribbon vector paths
ARCH_PATH = "M 154.4 256.0 C 148.5 267.8, 182.4 229.5, 194.1 220.7 C 205.9 211.8, 216.2 206.7, 225.1 203.0 C 233.9 199.3, 239.8 198.6, 247.2 198.6 C 254.5 198.6, 257.5 197.1, 269.3 203.0 C 281.0 208.9, 300.9 219.9, 317.9 233.9 C 334.8 247.9, 360.6 274.4, 370.9 286.9 C 381.2 299.4, 381.9 301.7, 379.7 309.0 C 377.5 316.4, 372.4 327.4, 357.6 331.1 C 342.9 334.8, 310.5 332.6, 291.3 331.1 C 272.2 329.6, 238.3 317.9, 242.7 322.3 C 247.2 326.7, 296.5 349.5, 317.9 357.6 C 339.2 365.7, 354.7 369.4, 370.9 370.9 C 387.1 372.4, 403.3 371.6, 415.1 366.5 C 426.9 361.3, 437.2 350.3, 441.6 340.0 C 446.0 329.6, 446.0 317.1, 441.6 304.6 C 437.2 292.1, 436.4 289.1, 415.1 264.8 C 393.7 240.5, 337.0 180.1, 313.4 158.8 C 289.9 137.4, 283.2 140.4, 273.7 136.7 C 264.1 133.0, 263.4 134.5, 256.0 136.7 C 248.6 138.9, 246.4 130.1, 229.5 150.0 C 212.6 169.8, 160.3 244.2, 154.4 256.0 Z"
WING_PATH = "M 295.8 269.3 C 293.6 269.3, 281.8 270.0, 278.1 269.3 C 274.4 268.5, 286.2 265.6, 273.7 264.8 C 261.2 264.1, 215.5 264.1, 203.0 264.8 C 190.5 265.6, 204.4 267.8, 198.6 269.3 C 192.7 270.7, 173.5 272.2, 167.6 273.7 C 161.7 275.1, 169.1 275.1, 163.2 278.1 C 157.3 281.0, 138.9 287.7, 132.3 291.3 C 125.7 295.0, 125.7 298.7, 123.4 300.2 C 121.2 301.7, 121.2 298.7, 119.0 300.2 C 116.8 301.7, 112.4 307.6, 110.2 309.0 C 108.0 310.5, 113.1 302.4, 105.8 309.0 C 98.4 315.7, 70.4 340.0, 66.0 348.8 C 61.6 357.6, 76.3 359.8, 79.3 362.0 C 82.2 364.3, 82.2 361.3, 83.7 362.0 C 85.1 362.8, 85.9 365.7, 88.1 366.5 C 90.3 367.2, 94.7 365.7, 96.9 366.5 C 99.1 367.2, 97.7 370.1, 101.3 370.9 C 105.0 371.6, 115.3 371.6, 119.0 370.9 C 122.7 370.1, 121.2 367.2, 123.4 366.5 C 125.7 365.7, 130.1 367.2, 132.3 366.5 C 134.5 365.7, 135.2 362.8, 136.7 362.0 C 138.2 361.3, 138.2 364.3, 141.1 362.0 C 144.1 359.8, 151.4 351.0, 154.4 348.8 C 157.3 346.6, 152.2 354.7, 158.8 348.8 C 165.4 342.9, 187.5 319.3, 194.1 313.4 C 200.8 307.6, 194.1 316.4, 198.6 313.4 C 203.0 310.5, 216.2 298.7, 220.7 295.8 C 225.1 292.8, 220.7 298.0, 225.1 295.8 C 229.5 293.6, 242.0 284.7, 247.2 282.5 C 252.3 280.3, 253.8 283.2, 256.0 282.5 C 258.2 281.8, 258.2 278.8, 260.4 278.1 C 262.6 277.4, 267.0 278.8, 269.3 278.1 C 271.5 277.4, 270.7 274.4, 273.7 273.7 C 276.6 272.9, 284.0 274.4, 286.9 273.7 C 289.9 272.9, 289.9 270.0, 291.3 269.3 C 292.8 268.5, 298.0 269.3, 295.8 269.3 Z"

# Output directories
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
BRAND_DIR = os.path.join(ROOT_DIR, 'resources', 'brand')
WIN_RES_DIR = os.path.join(ROOT_DIR, 'apps', 'windows', 'resources')
EXT_DIR = os.path.join(ROOT_DIR, 'extension')
MACOS_RES_DIR = os.path.join(ROOT_DIR, 'apps', 'macos', 'Resources')

for d in [BRAND_DIR, WIN_RES_DIR, EXT_DIR, MACOS_RES_DIR]:
    os.makedirs(d, exist_ok=True)

# ----------------------------------------------------------------------
# 1. SVG Definitions
# ----------------------------------------------------------------------

# Helper for the BEACON wordmark
def get_wordmark_svg(fill="#FFFFFF"):
    b_path = "M 100 356 L 120 356 C 127 356 132 360 132 367 C 132 373 128 377 121 378 C 129 379 133 384 133 391 C 133 398 127 400 120 400 L 100 400 Z M 104.5 360 L 104.5 375.5 L 119 C 124 375.5 127 373 127 367.5 C 127 362 124 360 119 360 Z M 104.5 379.5 L 104.5 396 L 120 C 125 396 128 393.5 128 388 C 128 382.5 125 379.5 120 379.5 Z"
    e_path = "M 158 356 L 186 356 L 186 360 L 162.5 360 L 162.5 376 L 183 376 L 183 380 L 162.5 380 L 162.5 396 L 186 396 L 186 400 L 158 400 Z"
    lambda_path = "M 228 356 L 244 400 L 239.5 400 L 228 368 L 216.5 400 L 212 400 Z"
    c_path = "M 296 365 C 294 359 288 356 281 356 C 270 356 263 365 263 378 C 263 391 270 400 281 400 C 288 400 294 397 296 391 L 291.5 389.5 C 289.5 393.5 285.5 396 281 396 C 272.5 396 267.5 388.5 267.5 378 C 267.5 367.5 272.5 360 281 360 C 285.5 360 289.5 362.5 291.5 366.5 Z"
    o_path = "M 340 356 C 352 356 360 366 360 378 C 360 390 352 400 340 400 C 328 400 320 390 320 378 C 320 366 328 356 340 356 Z M 340 360 C 330.5 360 324.5 368 324.5 378 C 324.5 388 330.5 396 340 396 C 349.5 396 355.5 388 355.5 378 C 355.5 368 349.5 360 340 360 Z"
    n_path = "M 384 356 L 388.5 356 L 406 389 L 406 356 L 410.5 356 L 410.5 400 L 406 400 L 388.5 367 L 388.5 400 L 384 400 Z"
    return f'<g fill="{fill}"><path d="{b_path}"/><path d="{e_path}"/><path d="{lambda_path}"/><path d="{c_path}"/><path d="{o_path}"/><path d="{n_path}"/></g>'

GRADIENTS_DEFS = '''<defs>
    <linearGradient id="beaconWing" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="35%" stop-color="#4F8CFF"/>
      <stop offset="75%" stop-color="#6366F1"/>
      <stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
    <linearGradient id="beaconArch" x1="15%" y1="80%" x2="85%" y2="15%">
      <stop offset="0%" stop-color="#4F46E5"/>
      <stop offset="30%" stop-color="#6366F1"/>
      <stop offset="60%" stop-color="#8B5CF6"/>
      <stop offset="85%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
    <radialGradient id="beaconAura" cx="50%" cy="45%" r="48%">
      <stop offset="0%" stop-color="#6366F1" stop-opacity="0.30"/>
      <stop offset="50%" stop-color="#8B5CF6" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#080811" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="squircleBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#14162B"/>
      <stop offset="100%" stop-color="#080914"/>
    </linearGradient>
    <linearGradient id="squircleBorder" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6366F1" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.2"/>
    </linearGradient>
  </defs>'''

# 1A. Standalone Symbol (Transparent)
SVG_BEACON_SYMBOL = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  {GRADIENTS_DEFS}
  <g id="beacon-quiet-path">
    <path d="{ARCH_PATH}" fill="url(#beaconArch)"/>
    <path d="{WING_PATH}" fill="url(#beaconWing)"/>
  </g>
</svg>'''

# 1B. Standalone Symbol Monochrome White
SVG_BEACON_SYMBOL_WHITE = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <g id="beacon-quiet-path-white" fill="#FFFFFF">
    <path d="{ARCH_PATH}"/>
    <path d="{WING_PATH}"/>
  </g>
</svg>'''

# 1C. Standalone Symbol Monochrome Black
SVG_BEACON_SYMBOL_BLACK = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <g id="beacon-quiet-path-black" fill="#0F172A">
    <path d="{ARCH_PATH}"/>
    <path d="{WING_PATH}"/>
  </g>
</svg>'''

# 1D. Full Dark Logo (Symbol + Wordmark + Tagline on Dark Canvas)
SVG_BEACON_LOGO_DARK = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="32" fill="#080811"/>
  {GRADIENTS_DEFS}
  <circle cx="256" cy="215" r="210" fill="url(#beaconAura)"/>
  <g transform="translate(0, -35)">
    <path d="{ARCH_PATH}" fill="url(#beaconArch)"/>
    <path d="{WING_PATH}" fill="url(#beaconWing)"/>
  </g>
  {get_wordmark_svg("#FFFFFF")}
  <g opacity="0.85">
    <line x1="140" y1="434" x2="190" y2="434" stroke="#6366F1" stroke-width="1.2" stroke-opacity="0.6"/>
    <text x="256" y="438" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="12" font-weight="400" letter-spacing="3.5" fill="#818CF8" text-anchor="middle">FIND YOUR FOCUS</text>
    <line x1="322" y1="434" x2="372" y2="434" stroke="#6366F1" stroke-width="1.2" stroke-opacity="0.6"/>
  </g>
</svg>'''

# 1E. Full Light Logo (Symbol + Wordmark + Tagline on Light Canvas)
SVG_BEACON_LOGO_LIGHT = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="32" fill="#F8FAFC"/>
  {GRADIENTS_DEFS}
  <g transform="translate(0, -35)">
    <path d="{ARCH_PATH}" fill="url(#beaconArch)"/>
    <path d="{WING_PATH}" fill="url(#beaconWing)"/>
  </g>
  {get_wordmark_svg("#0F172A")}
  <g opacity="0.85">
    <line x1="140" y1="434" x2="190" y2="434" stroke="#6366F1" stroke-width="1.2" stroke-opacity="0.5"/>
    <text x="256" y="438" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="12" font-weight="500" letter-spacing="3.5" fill="#6366F1" text-anchor="middle">FIND YOUR FOCUS</text>
    <line x1="322" y1="434" x2="372" y2="434" stroke="#6366F1" stroke-width="1.2" stroke-opacity="0.5"/>
  </g>
</svg>'''

# 1F. Full Logo Transparent (Symbol + Wordmark + Tagline)
SVG_BEACON_LOGO = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  {GRADIENTS_DEFS}
  <g transform="translate(0, -35)">
    <path d="{ARCH_PATH}" fill="url(#beaconArch)"/>
    <path d="{WING_PATH}" fill="url(#beaconWing)"/>
  </g>
  {get_wordmark_svg("#FFFFFF")}
  <g opacity="0.85">
    <line x1="140" y1="434" x2="190" y2="434" stroke="#6366F1" stroke-width="1.2" stroke-opacity="0.6"/>
    <text x="256" y="438" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="12" font-weight="400" letter-spacing="3.5" fill="#818CF8" text-anchor="middle">FIND YOUR FOCUS</text>
    <line x1="322" y1="434" x2="372" y2="434" stroke="#6366F1" stroke-width="1.2" stroke-opacity="0.6"/>
  </g>
</svg>'''

# 1G. App Icon Squircle (for Windows, macOS Dock, Web)
SVG_ICON = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  {GRADIENTS_DEFS}
  <rect x="24" y="24" width="464" height="464" rx="108" ry="108" fill="url(#squircleBg)" stroke="url(#squircleBorder)" stroke-width="3"/>
  <circle cx="256" cy="256" r="190" fill="url(#beaconAura)"/>
  <g transform="translate(25.6, 25.6) scale(0.9)">
    <path d="{ARCH_PATH}" fill="url(#beaconArch)"/>
    <path d="{WING_PATH}" fill="url(#beaconWing)"/>
  </g>
</svg>'''

# 1H. Circular Tray / Avatar Icon
SVG_ICON_TRAY = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  {GRADIENTS_DEFS}
  <circle cx="256" cy="256" r="236" fill="url(#squircleBg)" stroke="url(#squircleBorder)" stroke-width="6"/>
  <circle cx="256" cy="256" r="200" fill="url(#beaconAura)"/>
  <g transform="translate(38.4, 38.4) scale(0.85)">
    <path d="{ARCH_PATH}" fill="url(#beaconArch)"/>
    <path d="{WING_PATH}" fill="url(#beaconWing)"/>
  </g>
</svg>'''

# ----------------------------------------------------------------------
# 2. Render Functions & ICO Generator
# ----------------------------------------------------------------------

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  [SVG] Wrote {path}")

def render_png(svg_content, out_path, size=512):
    # Adjust viewBox width/height attribute in root svg tag
    svg_sized = svg_content.replace('width="512" height="512"', f'width="{size}" height="{size}"')
    png_bytes = resvg_py.svg_to_bytes(svg_sized)
    with open(out_path, 'wb') as f:
        f.write(png_bytes)
    print(f"  [PNG] Generated {out_path} ({size}x{size}, {len(png_bytes)} bytes)")
    return png_bytes

def create_multi_res_ico(png_map, ico_path):
    """
    Creates standard Windows .ICO file with uncompressed 32-bit DIB bitmaps
    for 16, 24, 32, 48, 64, 128 (maximum Windows Shell / GDI compatibility)
    and 32-bit PNG compression for 256x256 (Windows Vista+ standard).
    png_map: dict of { size_int: png_bytes }
    """
    sizes = sorted(png_map.keys())
    count = len(sizes)
    
    # 6 bytes ICONDIR header
    header = struct.pack('<HHH', 0, 1, count)
    offset = 6 + count * 16
    
    entries = []
    payloads = []
    
    for s in sizes:
        if s == 256:
            # PNG payload for 256x256
            payload = png_map[s]
            data_len = len(payload)
            w_byte = 0
            h_byte = 0
            bpp = 32
        else:
            w_byte = s
            h_byte = s
            bpp = 32
            
            # Open PNG to extract RGBA pixel array
            img = Image.open(io.BytesIO(png_map[s])).convert('RGBA')
            
            # Bottom-to-top BGRA pixel rows
            xor_data = bytearray()
            for y in reversed(range(s)):
                for x in range(s):
                    r, g, b, a = img.getpixel((x, y))
                    xor_data.extend([b, g, r, a])
            
            # 1-bit AND mask (row padded to 32 bits / 4 bytes)
            row_bytes_len = (s + 7) // 8
            padded_row_len = (row_bytes_len + 3) & ~3
            and_mask = bytearray()
            for y in reversed(range(s)):
                row_bits = bytearray(padded_row_len)
                for x in range(s):
                    _, _, _, a = img.getpixel((x, y))
                    if a == 0:
                        byte_idx = x // 8
                        bit_idx = 7 - (x % 8)
                        row_bits[byte_idx] |= (1 << bit_idx)
                and_mask.extend(row_bits)
            
            # BITMAPINFOHEADER (40 bytes) with doubled height
            bih = struct.pack(
                '<IIIHHIIIIII',
                40,             # biSize
                s,              # biWidth
                s * 2,          # biHeight (doubled for XOR + AND masks)
                1,              # biPlanes
                32,             # biBitCount
                0,              # biCompression (BI_RGB)
                len(xor_data),  # biSizeImage
                0, 0, 0, 0      # XPels, YPels, ClrUsed, ClrImportant
            )
            payload = bih + bytes(xor_data) + bytes(and_mask)
            data_len = len(payload)
            
        entry = struct.pack(
            '<BBBBHHII',
            w_byte,
            h_byte,
            0,
            0,
            1,
            bpp,
            data_len,
            offset
        )
        entries.append(entry)
        payloads.append(payload)
        offset += data_len
        
    ico_bytes = header + b''.join(entries) + b''.join(payloads)
    with open(ico_path, 'wb') as f:
        f.write(ico_bytes)
    print(f"  [ICO] Generated standard Windows multi-res ICO: {ico_path} ({len(ico_bytes)} bytes, {count} sizes: {sizes})")

# ----------------------------------------------------------------------
# 3. Execution Pipeline
# ----------------------------------------------------------------------

print("\n--- Generating BEACON 'Quiet Path' Primary Vector Assets ---")
write_file(os.path.join(BRAND_DIR, 'beacon-logo.svg'), SVG_BEACON_LOGO)
write_file(os.path.join(BRAND_DIR, 'beacon-symbol.svg'), SVG_BEACON_SYMBOL)
write_file(os.path.join(BRAND_DIR, 'beacon-logo-dark.svg'), SVG_BEACON_LOGO_DARK)
write_file(os.path.join(BRAND_DIR, 'beacon-logo-light.svg'), SVG_BEACON_LOGO_LIGHT)
write_file(os.path.join(BRAND_DIR, 'beacon-symbol-white.svg'), SVG_BEACON_SYMBOL_WHITE)
write_file(os.path.join(BRAND_DIR, 'beacon-symbol-black.svg'), SVG_BEACON_SYMBOL_BLACK)
write_file(os.path.join(BRAND_DIR, 'icon.svg'), SVG_ICON)

print("\n--- Rendering High-Res Brand Renders ---")
render_png(SVG_BEACON_LOGO_DARK, os.path.join(BRAND_DIR, 'beacon-logo-dark.png'), 1024)
render_png(SVG_BEACON_LOGO_LIGHT, os.path.join(BRAND_DIR, 'beacon-logo-light.png'), 1024)
render_png(SVG_BEACON_SYMBOL, os.path.join(BRAND_DIR, 'beacon-symbol-transparent.png'), 512)
render_png(SVG_BEACON_SYMBOL_WHITE, os.path.join(BRAND_DIR, 'beacon-symbol-white.png'), 512)
render_png(SVG_BEACON_SYMBOL_BLACK, os.path.join(BRAND_DIR, 'beacon-symbol-black.png'), 512)

print("\n--- Rendering Multi-Resolution App Icons (16 to 1024) ---")
icon_sizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024]
rendered_icons = {}

for s in icon_sizes:
    path = os.path.join(BRAND_DIR, f'icon-{s}.png')
    data = render_png(SVG_ICON, path, s)
    rendered_icons[s] = data

# Build Master Multi-Resolution Windows ICO
print("\n--- Compiling Multi-Resolution Windows .ICO ---")
ico_target_sizes = {s: rendered_icons[s] for s in [16, 24, 32, 48, 64, 128, 256]}
brand_ico = os.path.join(BRAND_DIR, 'icon.ico')
create_multi_res_ico(ico_target_sizes, brand_ico)

# Copy to apps/windows/resources
print("\n--- Syncing Windows Desktop Application Resources ---")
write_file(os.path.join(WIN_RES_DIR, 'icon.svg'), SVG_ICON)
write_file(os.path.join(WIN_RES_DIR, 'beacon-logo.svg'), SVG_BEACON_LOGO)
write_file(os.path.join(WIN_RES_DIR, 'beacon-symbol.svg'), SVG_BEACON_SYMBOL)
write_file(os.path.join(WIN_RES_DIR, 'beacon-symbol-white.svg'), SVG_BEACON_SYMBOL_WHITE)

# Write primary icon.png (512x512)
with open(os.path.join(WIN_RES_DIR, 'icon.png'), 'wb') as f:
    f.write(rendered_icons[512])
# Write icon-256.png (256x256)
with open(os.path.join(WIN_RES_DIR, 'icon-256.png'), 'wb') as f:
    f.write(rendered_icons[256])
# Write icon48.png (48x48)
with open(os.path.join(WIN_RES_DIR, 'icon48.png'), 'wb') as f:
    f.write(rendered_icons[48])
# Copy multi-res icon.ico
create_multi_res_ico(ico_target_sizes, os.path.join(WIN_RES_DIR, 'icon.ico'))

# Render Tray Icon (32x32 circular / squircle optimized for dark & light taskbar)
tray_png_bytes = render_png(SVG_ICON_TRAY, os.path.join(WIN_RES_DIR, 'icon-tray.png'), 32)
write_file(os.path.join(WIN_RES_DIR, 'icon-tray.svg'), SVG_ICON_TRAY)

# Browser Extension Icons
print("\n--- Syncing Chromium Browser Extension Icons ---")
write_file(os.path.join(EXT_DIR, 'icon.svg'), SVG_ICON)
with open(os.path.join(EXT_DIR, 'icon16.png'), 'wb') as f:
    f.write(rendered_icons[16])
with open(os.path.join(EXT_DIR, 'icon32.png'), 'wb') as f:
    f.write(rendered_icons[32])
with open(os.path.join(EXT_DIR, 'icon48.png'), 'wb') as f:
    f.write(rendered_icons[48])
with open(os.path.join(EXT_DIR, 'icon128.png'), 'wb') as f:
    f.write(rendered_icons[128])

# macOS Application Resources
print("\n--- Syncing Native macOS Application Resources ---")
# logo-mask.png for macOS menu bar and dock
# macOS logo-mask expects a monochrome mask
mask_bytes = render_png(SVG_BEACON_SYMBOL_WHITE, os.path.join(MACOS_RES_DIR, 'logo-mask.png'), 128)
write_file(os.path.join(MACOS_RES_DIR, 'icon.svg'), SVG_ICON)
render_png(SVG_ICON, os.path.join(MACOS_RES_DIR, 'AppIcon.png'), 1024)

print("\n==================================================")
print("SUCCESS: ALL PRODUCTION BRAND ASSETS COMPILED!")
print("==================================================")
