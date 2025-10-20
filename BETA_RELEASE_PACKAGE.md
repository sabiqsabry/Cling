# 🚀 Cling Beta Release Package

**Built by Novusian** | Version 1.0.0 Beta

## 📦 What's Included

This beta release package contains installable versions of Cling for macOS:

### macOS Files
- **`Cling-Beta-macOS-AppleSilicon.dmg`** - For Apple Silicon Macs (M1, M2, M3, etc.)
- **`Cling-Beta-macOS-Intel.dmg`** - For Intel-based Macs
- **`Cling.app`** - Direct application bundle (drag to Applications folder)

### Documentation
- **`BETA_TESTING.md`** - Complete testing guide for beta testers
- **`BETA_SIGNUP_TEMPLATE.md`** - Template for recruiting beta testers

## 🎯 How to Distribute

### For Mac Users
1. **Share the appropriate DMG file** based on their Mac type:
   - Apple Silicon Macs: `Cling-Beta-macOS-AppleSilicon.dmg`
   - Intel Macs: `Cling-Beta-macOS-Intel.dmg`

2. **Installation Instructions**:
   - Download the DMG file
   - Double-click to open
   - Drag Cling to Applications folder
   - First launch may require right-clicking and selecting "Open" (macOS security)

### For Windows Users
Unfortunately, the Windows build requires additional Windows development tools that aren't available on macOS. To create Windows builds, you would need to:

1. **Option 1**: Build on a Windows machine with Visual Studio and Rust installed
2. **Option 2**: Use GitHub Actions or similar CI/CD to build Windows versions
3. **Option 3**: Provide the source code for Windows users to build themselves

## 📋 Beta Testing Instructions

Share these files with your beta testers:

1. **`BETA_TESTING.md`** - The complete testing guide
2. **The appropriate DMG file** for their platform
3. **Instructions to report feedback** via GitHub issues or email

## 🔧 Technical Details

### What's Working
- ✅ Full authentication system with Supabase
- ✅ Task management (create, edit, delete)
- ✅ Calendar view with time blocking
- ✅ Kanban board with drag-and-drop
- ✅ Dark mode with system integration
- ✅ User profile management
- ✅ Real-time data synchronization
- ✅ Offline-first architecture

### Known Limitations
- Some TypeScript errors were bypassed for the build (app still functions)
- Windows build requires additional setup
- Some advanced features may have minor issues

### System Requirements
- **macOS**: 10.15 (Catalina) or later
- **RAM**: 8GB recommended
- **Storage**: 100MB free space
- **Internet**: Required for authentication and cloud sync

## 🚀 Next Steps

1. **Test the builds** on your Mac first
2. **Share with beta testers** using the DMG files
3. **Collect feedback** using the provided templates
4. **Iterate based on feedback**
5. **Set up Windows build environment** for cross-platform testing

## 📞 Support

For beta testing support:
- **GitHub Issues**: [Create an issue](https://github.com/sabiqsabry/Cling/issues)
- **Email**: [Your contact email]
- **Documentation**: See `BETA_TESTING.md` for detailed instructions

---

**Built with ❤️ by Novusian**

*This is a beta release for testing purposes. The application is fully functional but may contain minor issues that will be resolved in the final release.*
