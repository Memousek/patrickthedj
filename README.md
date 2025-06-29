# Paprik - Discord Music Bot with AI Features

A feature-rich Discord music bot with AI conversation capabilities, voice recognition, and text-to-speech functionality.

## 🎵 Music Bot Features

### Core Music Commands
- **`/play <song>`** - Play music from YouTube, Spotify, SoundCloud, or direct URLs
- **`/pause`** - Pause the current track
- **`/resume`** - Resume paused music
- **`/stop`** - Stop playback and clear queue
- **`/skip`** - Skip to next track
- **`/back`** - Go to previous track
- **`/queue`** - Display current music queue
- **`/nowplaying`** - Show currently playing track info
- **`/volume <1-100>`** - Adjust playback volume
- **`/shuffle`** - Shuffle the queue
- **`/loop`** - Toggle loop modes (track, queue, off)
- **`/clear`** - Clear the music queue
- **`/remove <position>`** - Remove specific track from queue
- **`/jump <position>`** - Jump to specific track in queue
- **`/skipto <track>`** - Skip to specific track by name
- **`/seek <time>`** - Seek to specific time in track
- **`/filter <filter>`** - Apply audio filters (bassboost, nightcore, etc.)
- **`/lyrics`** - Display song lyrics
- **`/syncedlyrics`** - Create synchronized lyrics thread
- **`/save`** - Save current track to favorites
- **`/history`** - Show recently played tracks
- **`/search <query>`** - Search for tracks
- **`/playnext <song>`** - Add song to play next

### Music Sources Supported
- YouTube (videos, playlists, shorts)

### Advanced Features
- **High-quality audio** with configurable bitrate
- **Queue management** with position tracking
- **Audio filters** for enhanced listening experience
- **Lyrics synchronization** in Discord threads
- **Track history** and favorites system
- **Volume control** with memory
- **Auto-disconnect** when channel is empty
- **DJ role system** for restricted commands

## 🤖 AI Features

### Voice Recognition & TTS
- **Speech-to-text** recognition in voice channels
- **Text-to-speech** responses using Google TTS (wanna change it to some local solution)
- **Voice commands** for music and AI interactions
- **Welcome messages** when users join voice channels

### AI Conversation (Ollama Integration)
- **Local AI processing** using Ollama
- **Conversation memory** per server
- **Weather queries** via voice commands
- **Custom voice triggers** and responses

### Voice Commands
- **"jardo [question]"** - Ask AI anything
- **"jaké je počasí v [city]"** - Get weather information, default is Prague
- **"nazdar kamarádi"** - Greeting response
- **"dobrou noc"** - Good night message
- **"jardo stop"** - Stop AI responses

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- FFmpeg installed on your system
- Python (for some dependencies)
- Discord Bot Token
- Ollama (for AI features)

### 1. Environment Setup
Create a `.env` file in the root directory:
```env
TOKEN=your_discord_bot_token_here
```

### 2. Install Dependencies
```bash
npm install
```

### 3. AI Setup (Optional)
To enable AI conversation features:

1. **Install Ollama** from [ollama.ai](https://ollama.ai)
2. **Download the Gemma model**:
   ```bash
   ollama pull gemma3:12b
   ```
3. **Start Ollama service**:
   ```bash
   ollama serve
   ```

### 4. FFmpeg Installation

#### Windows:
```bash
# Using chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
```

#### macOS:
```bash
# Using homebrew
brew install ffmpeg
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install ffmpeg
```

### 5. Run the Bot

#### Method 1: Direct Node.js
```bash
node main.js
```

#### Method 2: Using npm script
```bash
npm start
```

#### Method 3: Docker (Recommended)
```bash
# Build the Docker image
docker build -t patrickthedj .

# Run the container
docker run patrickthedj
```

## ⚙️ Configuration

### Bot Configuration (`config.js`)
- **Language settings** (Default: Czech, but you can set any)
- **Volume defaults** and limits
- **Auto-disconnect settings**
- **DJ role configuration**
- **Emoji customization**

### User Names (`users.json`)
Configure custom display names for users:
```json
{
  "users": {
    "username": {
      "nominative": "Eliška",
      "vocative": "Eliško"
    }
  }
}
```

## 🎮 Usage Examples

### Music Commands
```
/play despacito
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ
/volume 80
/loop queue
```

### Voice Commands
- Join a voice channel and say: "jardo what's the weather like?"
- Say: "jardo tell me a joke"
- Ask: "jak počasí v Praze?"

## 🔧 Troubleshooting

### Common Issues

1. **Bot can't join voice channel**
   - Check bot permissions
   - Ensure bot has "Connect" and "Speak" permissions

2. **Music not playing**
   - Verify FFmpeg is installed
   - Check internet connection
   - Ensure YouTube/SoundCloud are accessible

3. **AI not responding**
   - Verify Ollama is running (`ollama serve`)
   - Check if Gemma model is downloaded
   - Ensure port 11434 is accessible

4. **Voice recognition not working**
   - Check bot has "Use Voice Activity" permission
   - Ensure microphone permissions are granted

### Debug Mode
Enable debug mode in `config.js`:
```javascript
debug: true
```