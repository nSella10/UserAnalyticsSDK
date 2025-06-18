# User Analytics SDK Documentation

Welcome to the comprehensive documentation for the User Analytics SDK - a powerful Android library for tracking user behavior, screen time, and application analytics.

## 🚀 Quick Start

Get started with the User Analytics SDK in just 3 simple steps:

1. **Add JitPack Repository** to your `settings.gradle`
2. **Add SDK Dependency** to your `build.gradle`
3. **Initialize the SDK** with your API key

```java
// Initialize the SDK
AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", "YOUR_API_KEY");

// Track an event
Map<String, Object> properties = new HashMap<>();
properties.put("screen", "MainActivity");
AnalyticsTracker.trackEvent("user123", "app_opened", properties);
```

## 📚 Documentation Sections

### 🛠️ [Installation Guide](installation.md)
Complete setup instructions including:
- JitPack repository configuration
- Dependency management
- API key setup
- Security best practices

### 📖 [API Reference](api-reference.md)
Detailed documentation for all SDK methods:
- `AnalyticsTracker` class
- Event tracking methods
- Screen time monitoring
- User management
- Data models

### 💡 [Examples](examples.md)
Practical code examples and use cases:
- Basic event tracking
- Screen time measurement
- User authentication
- Custom properties
- Best practices

### 🔧 [Troubleshooting](troubleshooting.md)
Common issues and solutions:
- Build errors
- Network connectivity
- API key problems
- Performance optimization

## 🌟 Key Features

- **📊 Event Tracking** - Track user actions and custom events
- **⏱️ Screen Time Monitoring** - Automatic screen time measurement
- **🔒 Data Isolation** - Each app sees only its own data
- **⚡ Real-time Analytics** - Data appears in dashboard within seconds
- **🛡️ Secure API Key System** - Unique API keys for each application
- **📱 Easy Integration** - Simple 3-step setup process
- **☁️ Cloud Backend** - Hosted on AWS with CloudFront CDN

## 🏗️ Architecture

The User Analytics SDK consists of several components working together:

- **Android SDK Library** - Published on JitPack for easy integration
- **Spring Boot Backend** - RESTful API service hosted on AWS
- **React Developer Portal** - Web dashboard for analytics visualization
- **MongoDB Atlas** - Cloud database for data storage
- **CloudFront CDN** - Global content delivery network

## 📋 Requirements

- **Android API Level:** 26+ (Android 8.0)
- **Permissions:** `INTERNET`
- **Dependencies:** Retrofit2, Gson

## 🔑 Getting Your API Key

1. Visit our [Developer Dashboard](https://d1xb34m3k0zeus.cloudfront.net)
2. Register for a developer account
3. Create a new application
4. Copy your unique API Key (format: `ak_xxxxxxxxxx`)

## 📞 Support

- **GitHub Repository:** [UserAnalyticsSDK](https://github.com/nSella10/UserAnalyticsSDK)
- **Issues:** [GitHub Issues](https://github.com/nSella10/UserAnalyticsSDK/issues)
- **Developer Dashboard:** [https://d1xb34m3k0zeus.cloudfront.net](https://d1xb34m3k0zeus.cloudfront.net)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/nSella10/UserAnalyticsSDK/blob/main/LICENSE) file for details.

---

**Ready to get started?** Begin with our [Installation Guide](installation.md) or explore the [API Reference](api-reference.md) for detailed method documentation.
