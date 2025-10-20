# 🚀 Cling Beta Testing Guide

Thank you for your interest in beta testing **Cling** - a powerful, offline-first task management application built by **Novusian**! This guide will help you get started with testing on both Mac and Windows.

## 📋 What is Cling?

Cling is a TickTick-style productivity application built with modern technologies:

- **Tauri 2.x + React 18 + TypeScript** for the frontend
- **SQLite with SQLCipher** for secure local storage
- **Supabase integration** for cloud sync (optional)
- **Cross-platform** support for macOS and Windows

## 🎯 Beta Testing Goals

We're looking for feedback on:

- **User Experience**: Navigation, workflow, and overall usability
- **Performance**: App responsiveness and speed
- **Features**: Task management, calendar, focus mode, and habits
- **Dark Mode**: Theme switching and system integration
- **Cross-platform**: Consistency between Mac and Windows
- **Cloud Sync**: Supabase integration and data synchronization

## 📦 Installation Instructions

### For macOS Users

1. **Download the beta build**:
   - Get the latest `.dmg` file from the releases
   - Or build from source (see Development Setup below)

2. **Install the application**:
   - Open the `.dmg` file
   - Drag Cling to your Applications folder
   - First launch may require right-clicking and selecting "Open" due to macOS security

3. **System Requirements**:
   - macOS 10.15 (Catalina) or later
   - 8GB RAM recommended
   - 100MB free disk space

### For Windows Users

1. **Download the beta build**:
   - Get the latest `.msi` installer from the releases
   - Or build from source (see Development Setup below)

2. **Install the application**:
   - Run the `.msi` installer as Administrator
   - Follow the installation wizard
   - Launch from Start Menu or Desktop shortcut

3. **System Requirements**:
   - Windows 10 version 1903 or later
   - 8GB RAM recommended
   - 100MB free disk space

## 🛠️ Development Setup (Optional)

If you want to build from source or contribute:

### Prerequisites

- **Node.js** 18+ and **pnpm**
- **Rust** toolchain (install via rustup.rs)
- **Git**

### Build Instructions

```bash
# Clone the repository
git clone https://github.com/sabiqsabry/Cling.git
cd Cling

# Install dependencies
pnpm install

# Install Rust dependencies (first time only)
source ~/.cargo/env  # On Windows: just run the commands

# Run in development mode
pnpm tauri:dev

# Build for production
pnpm tauri:build
```

## 🎮 Getting Started

### 1. First Launch

- The app will show an authentication modal
- You can either:
  - **Sign up** for a new account (cloud sync enabled)
  - **Continue offline** (local-only mode)

### 2. Key Features to Test

#### 📝 Task Management

- **Quick Add**: Press `Cmd/Ctrl + Shift + A` or click the "Quick Add" button
- **Natural Language**: Try "Submit report tomorrow 3pm #work P1"
- **Task Editing**: Click on any task to open the detailed editor
- **Drag & Drop**: Move tasks between lists in Kanban view

#### 📅 Calendar & Timeline

- **Calendar View**: Switch between Day/Week/Month views
- **Time Blocking**: Drag tasks to specific time slots
- **Timeline**: Visual representation of your scheduled tasks

#### 🎯 Focus Mode

- **Pomodoro Timer**: Built-in 25-minute focus sessions
- **Task Linking**: Connect focus sessions to specific tasks
- **Statistics**: Track your productivity patterns

#### 📊 Habits Tracking

- **Habit Creation**: Set up daily/weekly habits
- **Logging**: Mark habits as complete
- **Streak Tracking**: Visual streak indicators

#### 🌙 Dark Mode

- **Theme Switching**: Light, Dark, or System preference
- **System Integration**: Automatically follows OS theme
- **Cross-device Sync**: Theme preference syncs across devices

### 3. Navigation Guide

- **Dashboard**: Overview of all your tasks and progress
- **Today**: Tasks due today
- **List**: All tasks organized by lists
- **Kanban**: Drag-and-drop task management
- **Calendar**: Time-based task scheduling
- **Timeline**: Visual timeline of your tasks
- **Focus**: Pomodoro timer and focus sessions
- **Habits**: Habit tracking and streaks
- **Settings**: App preferences and configuration
- **Profile**: User account management (click user icon in top-right)

## 🐛 How to Report Issues

### Bug Report Template

When reporting bugs, please include:

```
**Platform**: macOS/Windows (version)
**Cling Version**: (if known)
**Steps to Reproduce**:
1.
2.
3.

**Expected Behavior**:
What should have happened?

**Actual Behavior**:
What actually happened?

**Screenshots/Logs**:
(If applicable)

**Additional Context**:
Any other relevant information
```

### Feedback Categories

1. **🐛 Bugs**: Something doesn't work as expected
2. **💡 Feature Requests**: Ideas for new functionality
3. **🎨 UI/UX Issues**: Design or usability concerns
4. **⚡ Performance**: Slow loading or responsiveness issues
5. **🔄 Sync Issues**: Problems with cloud synchronization

### Reporting Channels

- **GitHub Issues**: [Create an issue](https://github.com/sabiqsabry/Cling/issues)
- **Email**: [Your email here]
- **Discord/Slack**: [Community link if available]

## 🧪 Testing Scenarios

### Basic Functionality

- [ ] Create, edit, and delete tasks
- [ ] Create and manage lists
- [ ] Use Quick Add with natural language
- [ ] Navigate between all views
- [ ] Test dark/light mode switching

### Advanced Features

- [ ] Calendar time blocking
- [ ] Kanban drag-and-drop
- [ ] Focus mode with Pomodoro timer
- [ ] Habit tracking and logging
- [ ] Profile management

### Cross-platform Testing

- [ ] Data consistency between Mac and Windows
- [ ] Theme synchronization
- [ ] Cloud sync functionality
- [ ] Performance comparison

### Edge Cases

- [ ] Large number of tasks (100+)
- [ ] Long task descriptions
- [ ] Special characters in task names
- [ ] Offline/online mode switching
- [ ] App restart with unsaved changes

## 📊 Data & Privacy

### Local Storage

- All data is stored locally using SQLite with SQLCipher encryption
- Your data is encrypted and secure on your device
- No data is sent anywhere without your explicit consent

### Cloud Sync (Optional)

- Uses Supabase for cloud synchronization
- Only enabled if you create an account
- Your data is encrypted in transit and at rest
- You can disable sync anytime

### Beta Data

- Beta testing data will not be used for production
- Consider this a testing environment
- You can reset your data anytime from Settings

## 🎁 Beta Tester Perks

- **Early Access**: Be among the first to use Cling
- **Direct Feedback**: Your input shapes the final product
- **Recognition**: Beta testers will be credited in the final release
- **Priority Support**: Direct access to the development team

## 📞 Support & Community

### Getting Help

- Check the [GitHub Issues](https://github.com/sabiqsabry/Cling/issues) for known problems
- Join our [Discord/Slack community] for real-time support
- Email us directly for urgent issues

### Staying Updated

- Watch the GitHub repository for updates
- Follow release notes for new features and fixes
- Join the beta tester mailing list

## 🏁 Beta Testing Timeline

- **Week 1-2**: Core functionality testing
- **Week 3-4**: Advanced features and edge cases
- **Week 5-6**: Cross-platform testing and performance
- **Week 7-8**: Final feedback and polish

## 🙏 Thank You!

Your participation in the beta testing program is invaluable. Every bug report, feature request, and piece of feedback helps make Cling better for everyone.

**Happy Testing! 🚀**

---

_This beta testing guide will be updated as we receive feedback and add new features. Please check back regularly for updates._

**Last Updated**: January 2025
**Version**: Beta 1.0.0
**Built by**: Novusian
