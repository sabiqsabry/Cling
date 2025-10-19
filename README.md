# Cling - Cross-Platform Task Management

![Cling Logo](https://via.placeholder.com/400x200/3b82f6/ffffff?text=Cling)

**Cling** is a powerful, offline-first desktop task management application built with Tauri, React, and TypeScript. It combines the best features of modern task managers with the performance and security of native desktop applications.

## ✨ Features

### 🎯 Core Functionality

- **Quick Add** - Natural language task creation with smart parsing
- **Multiple Views** - List, Kanban, Calendar, Timeline, and Focus modes
- **Habit Tracking** - Build and maintain positive habits with streak tracking
- **Focus Mode** - Pomodoro timer with task integration
- **Offline-First** - Full functionality without internet connection

### 🔄 Smart Features

- **Natural Language Processing** - "Submit report Tue 3-4pm every 2 weeks #uni"
- **Global Shortcuts** - Quick access from anywhere (Cmd+Shift+A)
- **Menu Bar Integration** - macOS menu bar mini-window
- **System Tray** - Windows system tray integration
- **URL Scheme** - `cling://v1/add_task?title=...` support

### 🛡️ Security & Privacy

- **Local Storage** - SQLite with SQLCipher encryption
- **No Cloud Required** - Works completely offline
- **Optional Sync** - Supabase integration when ready

## 🚀 Quick Start

### Prerequisites

- **Rust** (via [rustup](https://rustup.rs/))
- **Node.js** 18+ and **pnpm**
- **macOS**: Xcode Command Line Tools
- **Windows**: Visual Studio Build Tools

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sabiqsabry/Cling.git
   cd Cling
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run in development**

   ```bash
   pnpm tauri:dev
   ```

4. **Build for production**
   ```bash
   pnpm tauri:build
   ```

> **Note**: The application is currently in a working state with a simplified Rust backend. All UI components and views are functional. The full database integration and advanced Rust features will be added in future updates.

## 📋 Keyboard Shortcuts

| Shortcut                                        | Action                 |
| ----------------------------------------------- | ---------------------- |
| `Cmd+Shift+A` (macOS) / `Alt+Shift+A` (Windows) | Quick Add              |
| `Cmd+Shift+O` (macOS) / `Alt+Shift+O` (Windows) | Toggle Mini Window     |
| `Cmd/Ctrl+K`                                    | Open Search            |
| `Cmd/Ctrl+N`                                    | Quick Add              |
| `Cmd/Ctrl+Enter`                                | Complete Selected Task |
| `Escape`                                        | Close Modals           |

## 🎨 Views & Features

### 📊 Dashboard

- Overview of tasks, habits, and focus sessions
- Quick stats and recent activity
- Quick action buttons

### 📅 Calendar

- Day, week, and month views
- Drag-and-drop time blocking
- All-day task support

### 📋 Kanban

- Visual task organization
- Customizable columns
- Drag-and-drop between columns

### ⏰ Timeline

- Gantt-style task visualization
- Duration and dependency tracking
- Zoom controls (day/week)

### 🎯 Focus Mode

- Pomodoro timer (25/5 minutes)
- Task-linked sessions
- Break tracking and statistics

### 📈 Habits

- Daily and weekly habit tracking
- Streak counters
- Heatmap visualization

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env` file for Supabase integration:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Note**: The app works perfectly without these variables in local-only mode.

### Settings

Access settings via the sidebar or `Cmd/Ctrl+,`:

- **General**: Theme, mini-window preferences
- **Shortcuts**: Customize keyboard shortcuts
- **Data**: Import/export, reset to sample data
- **About**: Version info and links

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Tauri 2.x (Rust)
- **Database**: SQLite with SQLCipher
- **UI**: Tailwind CSS + shadcn/ui + Radix
- **State**: Zustand + TanStack Query
- **Parsing**: chrono-node + rrule

### Project Structure

```
src/
├── app/                    # React application
│   ├── components/         # UI components
│   ├── routes/            # Page components
│   ├── store/             # Zustand stores
│   └── db/                # Data schemas
├── lib/                   # Utilities
└── main.tsx               # App entry point

src-tauri/
├── src/
│   ├── db/                # Database layer
│   ├── ipc/               # Tauri commands
│   ├── os/                # OS integrations
│   └── sync/              # Cloud sync (placeholder)
└── sql/migrations/        # Database schema
```

## 🔄 Cloud Sync (Optional)

Cling is designed to work offline-first, but can optionally sync with Supabase:

1. **Setup Supabase** - Follow the guide in `/supabase/README.md`
2. **Configure Environment** - Add your Supabase credentials
3. **Automatic Sync** - Changes sync in the background

## 📱 Platform Support

- **macOS** 10.15+ (Intel & Apple Silicon)
- **Windows** 10+ (x64)
- **Linux** (planned for v2.0)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Code Quality

- **TypeScript** strict mode enabled
- **ESLint** + **Prettier** for formatting
- **Vitest** for testing
- **Rust Clippy** for backend quality

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🗺️ Roadmap

See [ROADMAP.md](ROADMAP.md) for upcoming features and development plans.

## 🆘 Support

- **Documentation**: [SETUP.md](SETUP.md)
- **Issues**: [GitHub Issues](https://github.com/sabiqsabry/Cling/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sabiqsabry/Cling/discussions)

## 🙏 Acknowledgments

- **Tauri** team for the amazing desktop framework
- **React** and **TypeScript** communities
- **Tailwind CSS** for the utility-first approach
- **All contributors** and early adopters

---

**Made with ❤️ for productivity enthusiasts**
