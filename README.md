# User Analytics SDK

[![JitPack](https://jitpack.io/v/nSella10/UserAnalyticsSDK.svg)](https://jitpack.io/#nSella10/UserAnalyticsSDK)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Android API](https://img.shields.io/badge/API-26%2B-brightgreen.svg?style=flat)](https://android-arsenal.com/api?level=26)

A comprehensive Android SDK for tracking user behavior, screen time, and application analytics. Built for developers who need detailed insights into user engagement patterns.

## 🚀 Features

- **📊 Event Tracking** - Track user actions and custom events
- **⏱️ Screen Time Monitoring** - Automatic screen time measurement
- **🔒 Data Isolation** - Each app sees only its own data
- **⚡ Real-time Analytics** - Data appears in dashboard within seconds
- **🛡️ Secure API Key System** - Unique API keys for each application
- **📱 Easy Integration** - Simple 3-step setup process
- **☁️ Cloud Backend** - Hosted on AWS with CloudFront CDN

## 📋 Requirements

- **Android API Level:** 26+ (Android 8.0)
- **Permissions:** `INTERNET`
- **Dependencies:** Retrofit2, Gson

## 🛠️ Installation

### Step 1: Add JitPack Repository

Add JitPack repository to your project's `settings.gradle` file:

```gradle
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://jitpack.io' } // Add this line
    }
}
```

### Step 2: Add Dependency

Add the SDK dependency to your app's `build.gradle` file:

```gradle
dependencies {
    implementation 'com.github.nSella10:UserAnalyticsSDK:v1.0.6'
}
```

### Step 3: Add Internet Permission

Add internet permission to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

## 🔑 Getting Your API Key

1. **Register** at our [Developer Dashboard](https://d1xb34m3k0zeus.cloudfront.net)
2. **Create** a new application
3. **Copy** your unique API Key (format: `ak_xxxxxxxxxx`)

## 💻 Quick Start

### Basic Setup

```java
import com.analytics.analyticstracker.AnalyticsTracker;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize the SDK
        AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", "YOUR_API_KEY");

        // Track an event
        Map<String, Object> properties = new HashMap<>();
        properties.put("screen", "MainActivity");
        AnalyticsTracker.trackEvent("user123", "app_opened", properties);
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Start screen time tracking
        AnalyticsTracker.startScreen("MainActivity");
    }

    @Override
    protected void onPause() {
        super.onPause();
        // End screen time tracking
        AnalyticsTracker.endScreen("user123");
    }
}
```

## 📖 Documentation

- **[Installation Guide](docs/installation.md)** - Detailed setup instructions
- **[API Reference](docs/api-reference.md)** - Complete method documentation
- **[Examples](docs/examples.md)** - Code examples and use cases
- **[Troubleshooting](docs/troubleshooting.md)** - Common issues and solutions

## 🏗️ Architecture

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   📱 Android Client  │    │ 🌐 Developer Portal │    │ ☁️ Backend Services │
│                     │    │                     │    │                     │
│  ┌───────────────┐  │    │  ┌───────────────┐  │    │  ┌───────────────┐  │
│  │ Analytics SDK │  │    │  │   React App   │  │    │  │ Spring Boot   │  │
│  │  (JitPack)    │◄─┼────┼──┤   (Portal)    │◄─┼────┼──┤   REST API    │  │
│  └───────────────┘  │    │  └───────────────┘  │    │  └───────────────┘  │
│          ▲          │    │          ▲          │    │          │          │
│          │          │    │          │          │    │          ▼          │
│  ┌───────────────┐  │    │  ┌───────────────┐  │    │  ┌───────────────┐  │
│  │  MyInterest   │  │    │  │   Analytics   │  │    │  │ JWT + API Key │  │
│  │  Example App  │  │    │  │ Visualization │  │    │  │   Security    │  │
│  └───────────────┘  │    │  └───────────────┘  │    │  └───────────────┘  │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
           │                           │                           │
           │                           │                           │
           └───────────────────────────┼───────────────────────────┘
                                       │
                                       ▼
┌─────────────────────┐                                ┌─────────────────────┐
│ 🌍 AWS Infrastructure│                                │   🗄️ Data Layer     │
│                     │                                │                     │
│  ┌───────────────┐  │                                │  ┌───────────────┐  │
│  │  CloudFront   │  │                                │  │   MongoDB     │  │
│  │     CDN       │◄─┼────────────────────────────────┼──┤    Atlas      │  │
│  └───────────────┘  │                                │  └───────────────┘  │
│          │          │                                │          │          │
│          ▼          │                                │          ▼          │
│  ┌───────────────┐  │                                │  ┌───────────────┐  │
│  │   Elastic     │  │                                │  │ User Analytics│  │
│  │  Beanstalk    │  │                                │  │ Data Models   │  │
│  └───────────────┘  │                                │  └───────────────┘  │
└─────────────────────┘                                └─────────────────────┘
```

### 🔄 Data Flow

1. **📱 SDK Integration** → Android apps include SDK via JitPack
2. **📊 Event Tracking** → User actions → SDK → CloudFront CDN → Spring Boot API
3. **🔒 Security Layer** → JWT + API Key validation → Data isolation per app
4. **💾 Data Storage** → MongoDB Atlas with structured analytics models
5. **📈 Real-time Dashboard** → React portal displays insights within seconds

### 🛡️ Key Features

- **🌐 Global Performance**: CloudFront CDN for worldwide low latency
- **🔐 Enterprise Security**: Multi-layer authentication with data isolation
- **📦 Easy Distribution**: JitPack repository for seamless SDK integration
- **⚡ Real-time Analytics**: Events appear in dashboard within seconds
- **🏢 Multi-App Support**: Single developer account manages multiple applications

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation:** [GitHub Pages](https://nsella10.github.io/UserAnalyticsSDK/)
- **Issues:** [GitHub Issues](https://github.com/nSella10/UserAnalyticsSDK/issues)
- **Developer Dashboard:** [https://d1xb34m3k0zeus.cloudfront.net](https://d1xb34m3k0zeus.cloudfront.net)

## 🏆 Project Status

This SDK was developed as part of a comprehensive analytics platform including:
- ✅ Android SDK Library (Published on JitPack)
- ✅ Cloud API Service (Deployed on AWS)
- ✅ Developer Dashboard (React Frontend)
- ✅ Example Android Application
- ✅ Comprehensive Documentation

---

**Made with ❤️ by [Noam Sella](https://github.com/nSella10)**
