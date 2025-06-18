# Installation Guide

This guide will walk you through the complete installation process of the User Analytics SDK.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Android Studio** 4.0 or higher
- **Android API Level** 26+ (Android 8.0)
- **Internet connection** for your app
- **Developer account** on our platform

## 🛠️ Step-by-Step Installation

### 1. Project Setup

#### Add JitPack Repository

Open your project's `settings.gradle` file and add JitPack repository:

```gradle
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_PROJECT)
    repositories {
        google()
        mavenCentral()
        maven { url 'https://jitpack.io' } // Add this line
    }
}
```

#### Alternative: Project-level build.gradle

If you're using the older Gradle structure, add to your project-level `build.gradle`:

```gradle
allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://jitpack.io' } // Add this line
    }
}
```

### 2. Add SDK Dependency

Open your app-level `build.gradle` file (`app/build.gradle`) and add:

```gradle
dependencies {
    // Other dependencies...
    implementation 'com.github.nSella10:UserAnalyticsSDK:v1.0.6'
}
```

### 3. Add Required Permissions

Add internet permission to your `AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Add this permission -->
    <uses-permission android:name="android.permission.INTERNET" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme">
        
        <!-- Your activities -->
        
    </application>
</manifest>
```

### 4. Network Security Configuration (Optional)

For enhanced security, you can add network security configuration:

Create `res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">d1xb34m3k0zeus.cloudfront.net</domain>
    </domain-config>
</network-security-config>
```

Then reference it in your `AndroidManifest.xml`:

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ... >
```

## 🔑 Getting Your API Key

### 1. Register for Developer Account

1. Visit [Developer Dashboard](https://d1xb34m3k0zeus.cloudfront.net)
2. Click "Register" and fill in your details
3. Verify your email address
4. Log in to your account

### 2. Create Application

1. Click "Create New App" in the dashboard
2. Enter your application name
3. Add description (optional)
4. Click "Create"

### 3. Get Your API Key

1. Your API key will be generated automatically
2. Copy the API key (format: `ak_xxxxxxxxxx`)
3. Keep it secure - don't share it publicly

## 🚀 Initialize the SDK

Add initialization code to your main activity:

```java
import com.analytics.analyticstracker.AnalyticsTracker;

public class MainActivity extends AppCompatActivity {
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // Initialize the SDK with your API key
        AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", "YOUR_API_KEY_HERE");
    }
}
```

## ✅ Verify Installation

### 1. Build Your Project

Run a clean build to ensure everything compiles:

```bash
./gradlew clean build
```

### 2. Test Basic Functionality

Add a simple test event:

```java
// Test event
Map<String, Object> properties = new HashMap<>();
properties.put("test", "installation");
AnalyticsTracker.trackEvent("test_user", "sdk_installed", properties);
```

### 3. Check Dashboard

1. Run your app
2. Trigger the test event
3. Check your dashboard for the data
4. Data should appear within seconds

## 🔧 Advanced Configuration

### Secure API Key Storage

For production apps, consider storing your API key securely:

#### Option 1: BuildConfig

In your `build.gradle`:

```gradle
android {
    defaultConfig {
        buildConfigField "String", "ANALYTICS_API_KEY", "\"your_api_key_here\""
    }
    buildFeatures {
        buildConfig true
    }
}
```

Usage:
```java
AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", BuildConfig.ANALYTICS_API_KEY);
```

#### Option 2: Local Properties

Create `local.properties` (add to `.gitignore`):

```properties
ANALYTICS_API_KEY=your_api_key_here
```

In `build.gradle`:

```gradle
def localProps = new Properties()
localProps.load(new FileInputStream(rootProject.file("local.properties")))

android {
    defaultConfig {
        buildConfigField "String", "ANALYTICS_API_KEY", "\"${localProps['ANALYTICS_API_KEY']}\""
    }
}
```

## 🚨 Troubleshooting

### Common Issues

**Build Error: "Could not resolve dependency"**
- Ensure JitPack repository is added correctly
- Check internet connection
- Try invalidating caches: `Build > Clean Project`

**Network Error: "Unable to connect"**
- Verify internet permission is added
- Check if your device/emulator has internet access
- Verify the API URL is correct

**API Key Error: "Invalid API Key"**
- Double-check your API key from the dashboard
- Ensure no extra spaces or characters
- Verify the API key format: `ak_xxxxxxxxxx`

### Getting Help

If you encounter issues:

1. Check our [Troubleshooting Guide](troubleshooting.md)
2. Search [GitHub Issues](https://github.com/nSella10/UserAnalyticsSDK/issues)
3. Create a new issue with details

## 🎯 Next Steps

After successful installation:

1. Read the [API Reference](api-reference.md)
2. Check out [Examples](examples.md)
3. Review [Security Best Practices](security.md)

---

**Installation complete! 🎉 You're ready to start tracking analytics.**
