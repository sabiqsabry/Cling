#!/bin/bash

# Cling Beta Build Script
# This script builds beta releases for both macOS and Windows

echo "🚀 Building Cling Beta Releases..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the Cling project root directory"
    exit 1
fi

# Create beta directory
mkdir -p beta-releases
cd beta-releases

echo "📦 Installing dependencies..."
cd ..
pnpm install

echo "🔨 Building for macOS..."
pnpm tauri build --target x86_64-apple-darwin

echo "🔨 Building for Windows..."
pnpm tauri build --target x86_64-pc-windows-msvc

echo "📁 Moving builds to beta-releases directory..."

# Move macOS build
if [ -f "src-tauri/target/x86_64-apple-darwin/release/bundle/dmg/Cling_1.0.0_x64.dmg" ]; then
    cp "src-tauri/target/x86_64-apple-darwin/release/bundle/dmg/Cling_1.0.0_x64.dmg" "beta-releases/Cling-Beta-macOS.dmg"
    echo "✅ macOS build: beta-releases/Cling-Beta-macOS.dmg"
else
    echo "❌ macOS build failed"
fi

# Move Windows build
if [ -f "src-tauri/target/x86_64-pc-windows-msvc/release/bundle/msi/Cling_1.0.0_x64_en-US.msi" ]; then
    cp "src-tauri/target/x86_64-pc-windows-msvc/release/bundle/msi/Cling_1.0.0_x64_en-US.msi" "beta-releases/Cling-Beta-Windows.msi"
    echo "✅ Windows build: beta-releases/Cling-Beta-Windows.msi"
else
    echo "❌ Windows build failed"
fi

echo ""
echo "🎉 Beta builds complete!"
echo "📁 Beta releases are in the 'beta-releases' directory"
echo ""
echo "📋 Next steps:"
echo "1. Test the builds on both platforms"
echo "2. Upload to your preferred hosting service"
echo "3. Share the BETA_TESTING.md guide with testers"
echo "4. Collect feedback and iterate"
echo ""
echo "🔗 Share these files with beta testers:"
echo "- BETA_TESTING.md (testing guide)"
echo "- BETA_SIGNUP_TEMPLATE.md (signup form)"
echo "- beta-releases/Cling-Beta-macOS.dmg"
echo "- beta-releases/Cling-Beta-Windows.msi"
