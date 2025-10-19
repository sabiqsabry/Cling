# Cling Setup Guide

This guide will help you set up Cling for development and production use.

## 📋 Prerequisites

### Required Software

#### 1. Rust

Install Rust via [rustup](https://rustup.rs/):

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
rustup update
```

#### 2. Node.js & pnpm

- **Node.js** 18 or later: [Download](https://nodejs.org/)
- **pnpm** (recommended package manager):

```bash
npm install -g pnpm
```

#### 3. Platform-Specific Tools

##### macOS

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Verify installation
rustc --version
node --version
pnpm --version
```

##### Windows

1. Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. Install [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
3. Restart your terminal

##### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install build-essential libwebkit2gtk-4.0-dev libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev

# For Arch Linux
sudo pacman -S webkit2gtk base-devel curl wget file openssl appmenu-gtk-module gtk3 libappindicator-gtk3 librsvg libvips
```

## 🚀 Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sabiqsabry/Cling.git
cd Cling
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
pnpm install

# Install Rust dependencies (automatic on first build)
```

### 3. Development Commands

```bash
# Start development server (frontend only)
pnpm dev

# Start Tauri development (full app)
pnpm tauri:dev

# Build for production
pnpm tauri:build

# Run tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm typecheck
```

### 4. Verify Installation

Run the development server:

```bash
pnpm tauri:dev
```

You should see:

- A desktop window opens with the Cling interface
- Sample data is loaded automatically
- All views (Dashboard, List, Kanban, etc.) are accessible

## 🏗️ Build for Production

### 1. Build the Application

```bash
pnpm tauri:build
```

### 2. Find Your Builds

After building, you'll find the installers in:

- **macOS**: `src-tauri/target/release/bundle/dmg/Cling_1.0.0_x64.dmg`
- **Windows**: `src-tauri/target/release/bundle/msi/Cling_1.0.0_x64_en-US.msi`
- **Linux**: `src-tauri/target/release/bundle/deb/cling_1.0.0_amd64.deb`

### 3. Installation

#### macOS

1. Double-click the `.dmg` file
2. Drag Cling to Applications folder
3. Launch from Applications or Spotlight

#### Windows

1. Run the `.msi` installer
2. Follow the installation wizard
3. Launch from Start Menu

#### Linux

```bash
sudo dpkg -i cling_1.0.0_amd64.deb
cling
```

## ⚙️ Configuration

### Environment Variables (Optional)

Create a `.env` file in the project root for Supabase integration:

```env
# Supabase Configuration (optional - app works without these)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
VITE_APP_NAME=Cling
VITE_APP_VERSION=1.0.0
```

**Note**: Cling works perfectly in local-only mode without these variables.

### Database

Cling uses SQLite with SQLCipher encryption:

- **Location**: `~/Library/Application Support/app.cling.desktop/` (macOS)
- **Location**: `%APPDATA%/app.cling.desktop/` (Windows)
- **Encryption**: Automatic with system keychain integration

### Settings

Access settings within the app:

1. Click the **Settings** button in the sidebar
2. Configure preferences for:
   - Theme (Light/Dark/System)
   - Mini-window behavior
   - Keyboard shortcuts
   - Data management

## 🔧 Troubleshooting

### Common Issues

#### Build Errors

**Error**: `error: linker 'cc' not found`

```bash
# macOS
xcode-select --install

# Ubuntu/Debian
sudo apt install build-essential

# Windows
# Install Visual Studio Build Tools
```

**Error**: `WebView2 not found`

```bash
# Windows only
# Download and install WebView2 Runtime
```

#### Runtime Errors

**Error**: `Database initialization failed`

- Check file permissions in app data directory
- Ensure SQLCipher is properly linked
- Try resetting the database in Settings

**Error**: `Global shortcuts not working`

- Check if another app is using the same shortcuts
- Restart the application
- Check system permissions (macOS may require accessibility permissions)

#### Performance Issues

**Slow startup**:

- Disable unnecessary startup programs
- Ensure SSD storage for app data directory
- Check available RAM (recommended: 4GB+)

**High CPU usage**:

- Check for background processes
- Restart the application
- Report issue with system specs

### Getting Help

1. **Check the logs**:

   ```bash
   # Development logs
   pnpm tauri:dev

   # Production logs (macOS)
   ~/Library/Logs/app.cling.desktop/
   ```

2. **Reset to defaults**:
   - Go to Settings → Data → Reset to Sample Data
   - Or delete the app data directory and restart

3. **Community support**:
   - [GitHub Issues](https://github.com/sabiqsabry/Cling/issues)
   - [GitHub Discussions](https://github.com/sabiqsabry/Cling/discussions)

## 🔄 Updates

### Automatic Updates (Planned)

Future versions will include automatic update checking.

### Manual Updates

1. Download the latest release
2. Install over the existing version
3. Your data will be preserved automatically

## 🛡️ Security

### Data Protection

- **Local encryption**: SQLite with SQLCipher
- **System integration**: Uses OS keychain for encryption keys
- **No telemetry**: Zero data collection or tracking
- **Open source**: Full source code transparency

### Permissions

#### macOS

- **Accessibility**: For global shortcuts
- **Notifications**: For reminders and focus sessions
- **File access**: For attachments and exports

#### Windows

- **File system**: For app data and attachments
- **Notifications**: For reminders and focus sessions

## 📊 Performance

### System Requirements

**Minimum**:

- CPU: Dual-core 2GHz
- RAM: 4GB
- Storage: 100MB free space
- OS: macOS 10.15, Windows 10, Ubuntu 18.04

**Recommended**:

- CPU: Quad-core 2.5GHz+
- RAM: 8GB+
- Storage: 500MB+ free space
- SSD storage for optimal performance

### Optimization Tips

1. **Regular maintenance**:
   - Clear completed tasks periodically
   - Export and archive old data
   - Keep the app updated

2. **Performance settings**:
   - Disable unused views
   - Limit habit tracking history
   - Optimize attachment storage

---

**Need more help?** Check our [FAQ](https://github.com/sabiqsabry/Cling/wiki/FAQ) or [contact support](https://github.com/sabiqsabry/Cling/issues).
