# Cling Setup Guide

This guide will help you set up the Cling desktop application for development and production use.

## Prerequisites

Before setting up Cling, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v18 or later)

   ```bash
   # Check version
   node --version

   # Install via nvm (recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   ```

2. **pnpm** (Package Manager)

   ```bash
   npm install -g pnpm
   ```

3. **Rust** (for Tauri backend)

   ```bash
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env

   # Verify installation
   rustc --version
   cargo --version
   ```

4. **Tauri CLI**
   ```bash
   cargo install tauri-cli
   ```

### Platform-Specific Requirements

#### macOS

- Xcode Command Line Tools: `xcode-select --install`
- macOS 10.15+ (Catalina or later)

#### Windows

- Microsoft Visual Studio C++ Build Tools
- WebView2 (usually pre-installed on Windows 10/11)

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sabiqsabry/Cling.git
   cd Cling
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Install Rust dependencies**
   ```bash
   cd src-tauri
   cargo build
   cd ..
   ```

## Development

### Running the Development Server

```bash
# Start the development server
pnpm tauri:dev
```

This will:

- Start the Vite development server on `http://localhost:1420`
- Launch the Tauri desktop application
- Enable hot reloading for both frontend and backend changes

### Available Scripts

```bash
# Development
pnpm dev                 # Start Vite dev server only
pnpm tauri:dev          # Start Tauri development app

# Building
pnpm build              # Build frontend only
pnpm tauri:build        # Build complete desktop app

# Quality Checks
pnpm lint               # Run ESLint
pnpm lint:fix           # Fix ESLint errors
pnpm typecheck          # Run TypeScript checks
pnpm test               # Run tests
pnpm test:ui            # Run tests with UI

# Formatting
pnpm format             # Format code with Prettier
pnpm format:check       # Check code formatting
```

## Database Setup

Cling uses SQLite with SQLCipher for local data storage. The database is automatically initialized on first run.

### Database Location

- **macOS**: `~/Library/Application Support/app.cling.desktop/cling.db`
- **Windows**: `%APPDATA%\app.cling.desktop\cling.db`
- **Linux**: `~/.local/share/app.cling.desktop/cling.db`

### Manual Database Operations

```bash
# Reset database to sample data (from within the app)
# Go to Settings > Data Management > Reset to Sample Data

# Or manually delete the database file to start fresh
rm ~/Library/Application\ Support/app.cling.desktop/cling.db  # macOS
# The app will recreate it on next launch
```

## Building for Production

### Build the Application

```bash
# Build for current platform
pnpm tauri:build

# Build for specific platform
pnpm tauri:build --target x86_64-apple-darwin  # macOS Intel
pnpm tauri:build --target aarch64-apple-darwin # macOS Apple Silicon
pnpm tauri:build --target x86_64-pc-windows-msvc # Windows
pnpm tauri:build --target x86_64-unknown-linux-gnu # Linux
```

### Output Location

Built applications will be in `src-tauri/target/release/bundle/`

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Development
TAURI_DEV_HOST=localhost

# Production
VITE_APP_NAME=Cling
VITE_APP_VERSION=1.0.0

# Supabase (for cloud sync - optional)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Tauri Configuration

Main configuration is in `src-tauri/tauri.conf.json`:

```json
{
  "productName": "Cling",
  "version": "1.0.0",
  "identifier": "app.cling.desktop",
  "build": {
    "beforeDevCommand": "pnpm dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "pnpm build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "Cling",
        "width": 1200,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600
      }
    ]
  }
}
```

## Troubleshooting

### Common Issues

1. **"cargo not found" error**

   ```bash
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env
   ```

2. **"pnpm not found" error**

   ```bash
   npm install -g pnpm
   ```

3. **Database connection issues**
   - Check file permissions in the app data directory
   - Ensure no other process is using the database
   - Try deleting the database file to recreate it

4. **Build failures**

   ```bash
   # Clean build cache
   pnpm clean
   cd src-tauri
   cargo clean
   cd ..
   pnpm tauri:build
   ```

5. **Hot reload not working**
   - Check that the development server is running on port 1420
   - Verify firewall settings
   - Try restarting the development server

### Getting Help

- Check the [GitHub Issues](https://github.com/sabiqsabry/Cling/issues)
- Review the [Tauri Documentation](https://tauri.app/)
- Check the [React Documentation](https://react.dev/)

## Next Steps

After setup, you can:

1. **Explore the app**: Run `pnpm tauri:dev` and explore all the features
2. **Read the code**: Start with `src/App.tsx` and `src-tauri/src/lib.rs`
3. **Check the documentation**: See `README.md` and `ROADMAP.md`
4. **Set up cloud sync**: Follow the Supabase integration guide in `supabase/README.md`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to the project.
