# RedBoxVM

## Overview
RedBoxVM is an advanced Android virtualization platform that enables running multiple instances of applications simultaneously on a single device.

## Features
- **App Virtualization**: Run multiple instances of your favorite apps
- **Modern UI**: Material Design 3 interface with dark theme support
- **Performance Optimized**: Efficient resource management and fast app launching
- **Secure Environment**: Isolated virtual environments for enhanced security

## Getting Started

### Requirements
- Android 7.0 (API level 24) or higher
- ARM64 or ARM32 architecture
- Minimum 4GB RAM recommended

### Installation
1. Download the latest APK from releases
2. Enable "Install from Unknown Sources" in your device settings
3. Install the APK and launch RedBoxVM

### Usage
1. Open RedBoxVM
2. Browse available apps in the "All Apps" tab
3. Select apps to clone and virtualize
4. Launch virtual app instances from the "Cloned Apps" tab

## SDK Integration

RedBoxVM provides a powerful SDK for developers who want to integrate virtualization capabilities into their own applications.

### Basic Integration
```java
// Get LazyVM core instance
LazyVMCore core = LazyVMCore.get();

// Initialize native core
NativeCore.init(Build.VERSION.SDK_INT);

// Install virtual app
BPackageManager pm = BPackageManager.get();
InstallOption option = new InstallOption();
InstallResult result = pm.installPackage("/path/to/app.apk", option);

// Configure I/O redirection
NativeCore.addIORule("/data/data/com.example.app", 
                    "/data/data/com.redbox.vm/virtual/com.example.app");
NativeCore.enableIO();
```

## Documentation

For detailed documentation, API references, and integration guides, visit our [documentation website](https://theredxstudio.github.io/RedBoxVM/).

## Support

- **Issues**: Report bugs and feature requests in the Issues section
- **Discussions**: Join community discussions for help and tips
- **Documentation**: Check our online documentation for detailed guides

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

---

**Developed by**: TheRedXStudio  
**Platform**: Android  
**Architecture**: ARM64/ARM32  
**Minimum SDK**: API 24 (Android 7.0)