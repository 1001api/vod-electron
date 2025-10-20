![banner](https://i.imgur.com/bU4l1Mn.png)

# Ten-Oh-One VOD Electron 🎬

A modern **Video On Demand (VOD)** desktop application built with Electron, Svelte 5, and TypeScript. Browse, search, and stream thousands of movies and TV shows with a beautiful, cinematic user interface.

![Electron](https://img.shields.io/badge/Electron-37.2.6-47848F?logo=electron)
![Svelte](https://img.shields.io/badge/Svelte-5.38.1-FF3E00?logo=svelte)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)

## ✨ Features

- 🎥 **Extensive VOD Library** - Browse thousands of movies and TV shows
- 🔍 **Advanced Search** - Real-time search with debouncing across the entire catalog
- 📊 **Smart Sorting** - Sort by title (A-Z, Z-A) or year (newest/oldest)
- ♾️ **Infinite Scroll** - Smooth pagination with lazy loading
- 🎨 **Modern UI** - Beautiful, cinematic interface with TailwindCSS and glassmorphism effects
- 📱 **Responsive Design** - Optimized for all screen sizes
- 🎬 **Built-in Video Player** - Powered by Vidstack with HLS support
- 🔗 **Multiple Streaming Links** - Fallback options for reliable playback
- 💾 **Window State Persistence** - Remembers window size and position
- 🌐 **Cross-Platform** - Windows (32-bit & 64-bit) support with portable builds

## 🛠️ Tech Stack

### Frontend
- **[Svelte 5](https://svelte.dev/)** - Modern reactive framework with runes
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Vidstack](https://www.vidstack.io/)** - Advanced video player with HLS support
- **[Lucide Svelte](https://lucide.dev/)** - Beautiful icon library
- **[Svelte SPA Router](https://github.com/ItalyPaleAle/svelte-spa-router)** - Client-side routing
- **[Svelte Infinite](https://github.com/Skayo/svelte-infinite)** - Infinite scroll component

### Desktop
- **[Electron](https://www.electronjs.org/)** - Cross-platform desktop framework
- **[Electron Builder](https://www.electron.build/)** - Package and build for distribution
- **[Electron Serve](https://github.com/sindresorhus/electron-serve)** - Static file serving
- **[Electron Window State](https://github.com/mawie81/electron-window-state)** - Persist window state

### Build Tools
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool
- **[Concurrently](https://github.com/open-cli-tools/concurrently)** - Run multiple commands
- **[Cross-env](https://github.com/kentcdodds/cross-env)** - Cross-platform environment variables

## 📦 Installation

### Prerequisites
- **Node.js** 18+ and npm
- **Git**

### Clone & Install
```bash
# Clone the repository
git clone https://github.com/1001api/vod-electron.git
cd vod-electron

# Install dependencies
npm install
```

### Environment Setup
Fill the `.env` file in the root directory with your backend URL, or use the default one:
```env
VITE_SERVER_BASE_URL=https://iptv-be.1001api.com
```

## 🚀 Development

```bash
# Start development server (Vite + Electron)
npm run dev

# Start Vite dev server only
npm run dev:svelte

# Start Electron only
npm run dev:electron
```

The app will launch automatically with hot-reload enabled for both Svelte and Electron.

## 📦 Building

### Build for Windows
```bash
# Build for Windows 32-bit
npm run build:w32

# Build for Windows 64-bit
npm run build:w64
```

Built applications will be in the `release/` directory as portable executables.

### Build Process
1. Vite builds the Svelte app to `dist/`
2. Electron Builder packages the app with the built files
3. Creates portable `.exe` files (no installation required)

## 📁 Project Structure

```
vod-electron/
├── src/
│   ├── lib/
│   │   ├── MovieCard.svelte      # Movie card component
│   │   ├── MovieDetail.svelte    # Movie detail page with player
│   │   └── MovieSection.svelte   # Movie list with search/sort
│   ├── assets/                   # Images and icons
│   ├── App.svelte                # Main app component with routing
│   ├── electron.cjs              # Electron main process
│   ├── preload.cjs               # Electron preload script
│   └── main.ts                   # Svelte entry point
├── public/                       # Static assets
├── build.config.json             # Electron Builder configuration
├── vite.config.ts                # Vite configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🎨 UI Components

### MovieSection
- Grid layout with responsive columns (2-5 columns)
- Search bar with real-time filtering
- Sort dropdown (title/year, asc/desc)
- Infinite scroll pagination
- Loading states and empty states

### MovieCard
- Cinematic poster display
- Hover effects with scale animation
- Movie metadata (title, year, group)
- Gradient overlay for readability

### MovieDetail
- Full movie information display
- Multiple streaming link selector
- Integrated Vidstack video player
- Error handling with VLC fallback instructions
- Copy link functionality
- Blurred backdrop effect

## 🔧 Configuration

### Electron Builder (`build.config.json`)
- **App ID**: `com.1001api.vod`
- **Product Name**: Video On Demand
- **Output**: `release/` directory
- **Target**: Windows portable executable
- **ASAR**: Enabled for packaging

### Vite (`vite.config.ts`)
- Svelte plugin with TypeScript support
- TailwindCSS integration
- Vidstack plugin for video player
- Development server on port 5173

## 🌐 API Integration

The app connects to the **1001API VOD Backend**:
- **Base URL**: `https://iptv-be.1001api.com`
- **List Endpoint**: `/api/v1/vod/list` - Paginated movie list with search/sort
- **Detail Endpoint**: `/api/v1/vod/detail/:id` - Movie details with streaming URLs

### API Features
- Pagination (100 items per page)
- Search by title
- Sort by title or year (ascending/descending)
- Movie metadata (title, year, poster, group, type)
- Multiple streaming URLs per movie

## 🎯 Key Features Explained

### Infinite Scroll
Uses `svelte-infinite` for smooth pagination. Loads 100 movies at a time and automatically fetches more when scrolling near the bottom.

### Search & Sort
- **Debounced search** (300ms delay) to reduce API calls
- **Real-time filtering** without page reload
- **Sort options**: Title A-Z/Z-A, Year newest/oldest
- Resets to page 1 when search/sort changes

### Video Player
- **Vidstack player** with Plyr layout
- **HLS streaming** support
- **Multiple quality options** via link selector
- **Error handling** with user-friendly messages
- **Poster images** as thumbnails

### Window Management
- Remembers window size and position
- Minimum size: 500x450
- Auto-hide menu bar for cleaner UI
- Hidden inset title bar style
