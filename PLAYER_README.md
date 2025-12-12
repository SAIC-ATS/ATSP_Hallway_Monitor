# Hallway Monitor - Art Installation Player

An automated, kiosk-mode player for displaying a looping sequence of artworks including videos and interactive web content.

## Features

- **Fullscreen Kiosk Mode**: Runs in fullscreen with hidden cursor and menu bar
- **Auto-Loop**: Continuously cycles through all artworks without user interaction
- **Smart Duration Handling**: 
  - Videos play from start to finish based on their actual duration
  - Web content (like p5.js sketches) runs for a configurable duration (default: 3 minutes)
- **Smooth Transitions**: Automatic transitions between artworks
- **Crash-Resistant**: Built with Electron for stability on long-running installations

## Project Structure

```
hallway-monitor/
├── player/                 # Electron player application
│   ├── main.js            # Electron main process
│   ├── index.html         # Player UI
│   └── player.js          # Playback logic
├── playlist.json          # Artwork configuration
├── 1_bubble-space/        # Interactive web artwork
├── 2_love-hospital/       # Video artwork
├── 3_sound-food/          # Video artwork
├── 4_space-pet/           # Video artwork
└── package.json
```

## Installation

1. **Install Node.js** (if not already installed):
   - Download from https://nodejs.org/ (LTS version recommended)
   - Or use Homebrew: `brew install node`

2. **Install Dependencies**:
   ```bash
   cd /Users/dougrosman/GitHub/hallway-monitor
   npm install
   ```

3. **Build the Standalone App** (Optional but Recommended):
   ```bash
   npm run build
   npm run copy-to-desktop
   ```
   
   This creates `Hallway Monitor Player.app` on your Desktop that you can double-click to run.

## Usage

### Option 1: Run the Standalone App (Recommended)

After building, simply **double-click** `Hallway Monitor Player.app` on your Desktop.

### Option 2: Run from Terminal

```bash
npm start
```

The player will:
1. Launch in fullscreen kiosk mode
2. Begin playing artworks in sequence from `playlist.json`
3. Loop indefinitely

### Exiting the Player

- **Quit**: Press `Cmd + Q` to quit the application
- **Force Quit**: Press `Cmd + Option + Esc` and select the application

### Testing Controls (Optional)

During testing, you can use these keyboard shortcuts:
- **Right Arrow**: Skip to next artwork
- **Left Arrow**: Go to previous artwork

These can be disabled by commenting out `player.setupKeyboardControls()` in `player/player.js`.

## Configuration

### Editing the Playlist

Edit `playlist.json` to add, remove, or reorder artworks:

```json
[
  {
    "id": 1,
    "name": "Artwork Name",
    "type": "web",              // "web" or "video"
    "path": "folder/file.html", // Relative path from repo root
    "duration": 180             // Duration in seconds (web content only)
  }
]
```

**Artwork Types:**
- `"video"`: MP4, MOV, or other HTML5-compatible video files
- `"web"`: HTML files (can include JavaScript, p5.js, etc.)

**Duration:**
- Videos use their actual duration automatically
- Web content requires a `duration` field (in seconds)
- Default web duration: 180 seconds (3 minutes)

### Example Playlist Entry

```json
{
  "id": 5,
  "name": "New Interactive Piece",
  "type": "web",
  "path": "5_interactive-work/index.html",
  "duration": 240
}
```

## Auto-Start on Boot (Optional)

To have the player start automatically when the Mac Mini boots:

### Method 1: Login Items (Recommended)

1. Open **System Settings** → **General** → **Login Items**
2. Click the **+** button under "Open at Login"
3. Create a simple script file `start-player.command`:
   ```bash
   #!/bin/bash
   cd /Users/dougrosman/GitHub/hallway-monitor
   npm start
   ```
4. Make it executable: `chmod +x start-player.command`
5. Add this script to Login Items

### Method 2: Automator Application

1. Open **Automator**
2. Create new **Application**
3. Add "Run Shell Script" action:
   ```bash
   cd /Users/dougrosman/GitHub/hallway-monitor
   /usr/local/bin/npm start
   ```
4. Save as "Hallway Monitor Player"
5. Add to Login Items in System Settings

## Troubleshooting

### Videos Not Playing
- Ensure video files are in supported formats (MP4 with H.264 is most reliable)
- Check file paths in `playlist.json` are correct
- Look at Console output for error messages

### Web Content Not Loading
- Verify HTML files have correct relative paths for assets
- Check browser console in Electron DevTools (uncomment `mainWindow.webContents.openDevTools()` in `main.js`)

### Performance Issues
- If videos stutter, try reducing video resolution or bitrate
- Uncomment `app.disableHardwareAcceleration()` in `main.js` if you see visual glitches

### Screen Goes to Sleep
Prevent sleep in System Settings:
1. **System Settings** → **Lock Screen**
2. Set "Turn display off when inactive" to "Never"
3. Enable "Prevent automatic sleeping when display is off" if available

## Development

To modify the player behavior, edit these files:

- **player/player.js**: Core playback logic and timing
- **player/main.js**: Electron window configuration
- **player/index.html**: UI structure and styling
- **playlist.json**: Artwork sequence and settings

## Technical Details

- **Platform**: Electron (Chromium-based)
- **Node Integration**: Enabled for file system access
- **Video Playback**: HTML5 video element
- **Web Content**: iframe with local file loading
- **Compatibility**: macOS 10.13+ (optimized for macOS 15.5 Sequoia / M2 Pro)

## Credits

Created for the 4th floor hallway monitor art installation.
