#!/bin/bash

# Script to copy the Hallway Monitor Player app to the Desktop for easy access

SOURCE_APP="$PWD/dist/mac-arm64/Hallway Monitor Player.app"
DEST_DESKTOP="$HOME/Desktop/Hallway Monitor Player.app"

if [ -d "$SOURCE_APP" ]; then
    echo "Copying app to Desktop..."
    rm -rf "$DEST_DESKTOP" 2>/dev/null
    cp -R "$SOURCE_APP" "$DEST_DESKTOP"
    echo "✓ App copied to Desktop!"
    echo "You can now double-click 'Hallway Monitor Player.app' on your Desktop to run it."
else
    echo "Error: App not found at $SOURCE_APP"
    echo "Please run 'npm run build' first."
    exit 1
fi
