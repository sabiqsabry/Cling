# Cling App Icons

This directory contains the app icons for the Cling desktop application.

## Required Icon Files

For a complete Tauri app, you need the following icon files:

### macOS Icons
- `icon.icns` - macOS app icon bundle
- `32x32.png` - 32x32 pixel icon
- `128x128.png` - 128x128 pixel icon  
- `128x128@2x.png` - 256x256 pixel icon (retina)

### Windows Icons
- `icon.ico` - Windows app icon

### Linux Icons
- `32x32.png` - 32x32 pixel icon
- `128x128.png` - 128x128 pixel icon

## Icon Generation

You can generate these icons using:

1. **Online tools:**
   - [App Icon Generator](https://appicon.co/)
   - [Icon Kitchen](https://icon.kitchen/)
   - [Tauri Icon Generator](https://tauri.app/v1/guides/features/icons/)

2. **Command line tools:**
   ```bash
   # Install iconutil (macOS only)
   iconutil -c icns icon.iconset
   
   # Convert PNG to ICO (Windows)
   magick convert icon.png -resize 256x256 icon.ico
   ```

3. **Design tools:**
   - Figma
   - Sketch
   - Adobe Illustrator
   - GIMP

## Current Status

⚠️ **Placeholder icons needed** - The current icons are placeholders and should be replaced with the actual Cling app icons.

## Icon Design Guidelines

- **Size**: Icons should be high-resolution (at least 512x512 for the source)
- **Format**: Use PNG for raster images, SVG for vector
- **Style**: Clean, modern design that represents task management/productivity
- **Colors**: Should work well on both light and dark backgrounds
- **Recognition**: Should be easily recognizable at small sizes

## Temporary Solution

For development purposes, you can use any 512x512 PNG image as the source and generate all required sizes from it.
