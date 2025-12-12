const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

class ArtworkPlayer {
  constructor() {
    this.playlist = [];
    this.currentIndex = 0;
    this.timer = null;
    
    this.videoContainer = document.getElementById('video-container');
    this.webContainer = document.getElementById('web-container');
    this.videoPlayer = document.getElementById('video-player');
    this.webFrame = document.getElementById('web-frame');
    this.loading = document.getElementById('loading');
    
    this.init();
  }

  async init() {
    try {
      // Load playlist
      const playlistPath = path.join(__dirname, '..', 'playlist.json');
      const playlistData = fs.readFileSync(playlistPath, 'utf8');
      this.playlist = JSON.parse(playlistData);
      
      console.log('Playlist loaded:', this.playlist);
      
      // Set up video player event listeners
      this.videoPlayer.addEventListener('ended', () => this.playNext());
      this.videoPlayer.addEventListener('error', (e) => {
        console.error('Video error:', e);
        this.playNext();
      });
      
      // Start playing
      this.hideLoading();
      this.playCurrentArtwork();
      
    } catch (error) {
      console.error('Failed to initialize player:', error);
      this.loading.textContent = 'Error loading playlist';
    }
  }

  hideLoading() {
    this.loading.style.display = 'none';
  }

  showLoading() {
    this.loading.style.display = 'block';
  }

  playCurrentArtwork() {
    const artwork = this.playlist[this.currentIndex];
    console.log(`Playing artwork ${this.currentIndex + 1}/${this.playlist.length}:`, artwork.name);
    
    // Clear any existing timer
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    // Hide both containers
    this.videoContainer.classList.remove('active');
    this.webContainer.classList.remove('active');
    
    if (artwork.type === 'video') {
      this.playVideo(artwork);
    } else if (artwork.type === 'web') {
      this.playWeb(artwork);
    }
  }

  playVideo(artwork) {
    const videoPath = path.join(__dirname, '..', artwork.path);
    
    // Check if file exists
    if (!fs.existsSync(videoPath)) {
      console.error('Video file not found:', videoPath);
      this.playNext();
      return;
    }
    
    this.videoPlayer.src = `file://${videoPath}`;
    this.videoContainer.classList.add('active');
    
    // Play the video
    this.videoPlayer.play().catch(err => {
      console.error('Failed to play video:', err);
      this.playNext();
    });
  }

  playWeb(artwork) {
    const webPath = path.join(__dirname, '..', artwork.path);
    
    // Check if file exists
    if (!fs.existsSync(webPath)) {
      console.error('Web file not found:', webPath);
      this.playNext();
      return;
    }
    
    this.webFrame.src = `file://${webPath}`;
    this.webContainer.classList.add('active');
    
    // Set timer for web content (default 3 minutes = 180 seconds)
    const duration = artwork.duration || 180;
    console.log(`Web content will play for ${duration} seconds`);
    
    this.timer = setTimeout(() => {
      this.playNext();
    }, duration * 1000);
  }

  playNext() {
    // Move to next artwork
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    
    // Small delay for smooth transition
    setTimeout(() => {
      this.playCurrentArtwork();
    }, 500);
  }

  // Emergency controls (hidden but available)
  setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      // Press Escape to quit the application
      if (e.key === 'q') {
        // ipcRenderer.send('quit-app');
      }
      
      // Arrow keys for manual navigation (for testing)
      if (e.key === 'ArrowRight') {
        this.playNext();
      } else if (e.key === 'ArrowLeft') {
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.playCurrentArtwork();
      }
    });
  }
}

// Initialize player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const player = new ArtworkPlayer();
  player.setupKeyboardControls(); // Optional: enable keyboard controls for testing
});
