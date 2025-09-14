# RedBoxVM

## Overview
RedBoxVM is an advanced Android virtualization platform powered by LazyVM library that enables running multiple instances of applications simultaneously on a single device with complete isolation and security.

## Features
- **App Virtualization**: Run multiple instances of your favorite apps using LazyVM engine
- **Complete Isolation**: Process, file system, and network isolation for each virtual app
- **Multi-User Support**: Create multiple virtual users with separate app instances
- **I/O Redirection**: Advanced file system virtualization and path redirection
- **System Property Spoofing**: Configure virtual device properties and build information
- **Network Virtualization**: Virtual network interfaces with SSL bypass capabilities
- **Anti-Detection**: Hide Xposed, root, and emulator detection from virtual apps
- **Authentication System**: License-based authentication and package authorization
- **Modern UI**: Material Design 3 interface with dark theme support
- **Performance Optimized**: Efficient resource management and fast app launching

## Getting Started

### Requirements
- Android 7.0 (API level 24) or higher
- ARM64 or ARM32 architecture (ARM64 recommended)
- Minimum 4GB RAM recommended
- 2GB+ free storage space
- Valid RedBoxVM license key for SDK usage

### Installation
1. Download the latest APK from releases
2. Enable "Install from Unknown Sources" in your device settings
3. Install the APK and launch RedBoxVM

### Usage
1. Open RedBoxVM
2. Initialize the LazyVM core engine
3. Install APK files into virtual environments
4. Configure I/O redirection and system properties as needed
5. Launch virtual app instances with complete isolation
6. Manage multiple virtual users and app instances

## SDK Integration

RedBoxVM provides a powerful SDK based on LazyVM library for developers who want to integrate virtualization capabilities into their own applications.

### Basic Integration
```java
// Get LazyVM core instance
LazyVMCore core = LazyVMCore.get();

// Initialize native core
NativeCore.init(Build.VERSION.SDK_INT);

// Initialize authentication system
if (NativeCore.initializeAuth()) {
    // Set your license key
    NativeCore.setClientLicense("your-license-key");
}

// Install virtual app
BPackageManager pm = BPackageManager.get();
InstallOption option = new InstallOption();
option.userId = 0;
option.copyApk = true;

InstallResult result = pm.installPackage("/path/to/app.apk", option);
if (result.isSuccess()) {
    Log.d("RedBox", "App installed: " + result.packageName);
}

// Configure I/O redirection
NativeCore.addIORule("/data/data/com.example.app", 
                    "/data/data/com.redbox.vm/virtual/com.example.app");
NativeCore.enableIO();
```

### Advanced Features
```java
// Create virtual users
BUserManager userManager = BUserManager.get();
BUserInfo user = userManager.createUser("Virtual User", 0);

// Configure system properties
NativeCore.nativeSetProp("ro.build.version.release", "13");
NativeCore.nativeSetProp("ro.product.model", "Virtual Device");

// Enable network virtualization
NativeCore.enableNativeNetworkVirtualization(true);
NativeCore.setNetworkInterface("wlan0", "02:00:00:00:00:00", "192.168.1.100");

// Hide detection mechanisms
NativeCore.hideXposed();
NativeCore.disableHiddenApi();
```

## Architecture

RedBoxVM is built on top of the LazyVM virtualization library, providing a multi-layer architecture:

### Core Components
- **LazyVMCore**: Main virtualization engine and service management
- **NativeCore**: Native C++ implementation with Dobby hooking framework
- **BPackageManager**: Virtual package installation and management
- **BUserManager**: Multi-user virtual environment management
- **BActivityThread**: Virtual app lifecycle and process management
- **IOCore**: File system virtualization and I/O redirection

### Native Layer
- **Dobby Framework**: Advanced function hooking and interception
- **System Call Interceptor**: Kernel-level call interception and filtering
- **JNI Bridge**: Java-Native communication layer
- **Stealth Memory Reader**: Anti-detection memory operations

### Security Features
- **Process Isolation**: Complete process sandboxing and memory protection
- **Authentication System**: License-based access control and package authorization
- **Anti-Detection**: Hide virtualization indicators from target applications
- **Network Virtualization**: Isolated network stacks with VPN support

## Documentation

For detailed documentation, API references, and integration guides, visit our [documentation website](https://theredxstudio.github.io/RedBoxVM/).

### Key Documentation Sections
- **[Getting Started](https://theredxstudio.github.io/RedBoxVM/docs/getting-started.html)**: Installation and basic setup
- **[API Reference](https://theredxstudio.github.io/RedBoxVM/docs/api-reference.html)**: Complete LazyVM API documentation
- **[Architecture Guide](https://theredxstudio.github.io/RedBoxVM/docs/architecture.html)**: Technical architecture overview
- **[Security Guide](https://theredxstudio.github.io/RedBoxVM/docs/security.html)**: Security features and best practices
- **[Examples](https://theredxstudio.github.io/RedBoxVM/docs/examples.html)**: Practical integration examples

## Support

- **Issues**: Report bugs and feature requests in the Issues section
- **Discussions**: Join community discussions for help and tips
- **Documentation**: Check our online documentation for detailed guides

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Project Structure

```
RedBoxVM/
├── app/                    # Demo Android application
├── LazyVM/                 # Core LazyVM library
│   ├── src/main/cpp/      # Native C++ implementation
│   │   ├── Dobby/         # Dobby hooking framework
│   │   ├── Hook/          # System hooks and interceptors
│   │   ├── JniHook/       # JNI bridge implementation
│   │   └── Utils/         # Utility functions
│   └── src/main/java/     # Java API layer
│       ├── me/lazyvm/     # Core LazyVM classes
│       └── lazy/android/  # Android framework virtualization
├── docs/                  # Documentation website
│   ├── index.html         # Main landing page
│   └── docs/              # API documentation
└── README.md              # This file
```

## Building from Source

### Prerequisites
- Android Studio 2023.1.1+
- Android SDK API 35
- Android NDK 29.0.13846066
- Java JDK 17
- CMake 3.22.1+

### Build Commands
```bash
# Clone repository
git clone https://github.com/TheRedXStudio/RedBoxVM.git
cd RedBoxVM

# Initialize submodules
git submodule update --init --recursive

# Build debug version
./gradlew assembleDebug

# Build release version
./gradlew assembleRelease

# Install debug APK
./gradlew installDebug
```

## Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

### Development Guidelines
- Follow the existing code style and architecture
- Add comprehensive tests for new features
- Update documentation for API changes
- Ensure compatibility with Android 7.0+

---

**Developed by**: TheRedXStudio  
**Platform**: Android  
**Architecture**: ARM64/ARM32  
**Minimum SDK**: API 24 (Android 7.0)
