#!/bin/bash

# AI Prompter - Installation Script for macOS

echo "🚀 Installing AI Prompter..."

# Create symlink to Applications
cp -r "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/AI Prompter.app" ~/Applications/ 2>/dev/null || \
cp -r "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/AI Prompter.app" /Applications/

echo "✅ AI Prompter installed!"
echo "📍 You can now launch it from Applications folder"
echo ""
echo "Or run from terminal:"
echo "open ~/Applications/AI\ Prompter.app"
