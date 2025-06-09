# 📱 Android SDK Integration Guide

This guide will walk you through integrating the UserAnalyticsSDK into your Android application.

## 📋 Prerequisites

- Android Studio 4.0+
- Minimum SDK: API 21 (Android 5.0)
- Target SDK: API 34 (Android 14)
- Java 8+ or Kotlin

## 🚀 Installation

### Step 1: Add the SDK to Your Project

#### Option A: Local Module (Current)
```gradle
// In your app's build.gradle file
dependencies {
    implementation project(':analyticstracker')
}
```

#### Option B: JitPack (Coming Soon)
```gradle
// In your project's build.gradle file
allprojects {
    repositories {
        maven { url 'https://jitpack.io' }
    }
}

// In your app's build.gradle file
dependencies {
    implementation 'com.github.nSella10:UserAnalyticsSDK:1.0.0'
}
```

### Step 2: Add Internet Permission
```xml
<!-- In your AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## ⚙️ Configuration

### Step 1: Create TrackerConfig.java
```java
package com.analytics.analyticstracker.config;

public class TrackerConfig {
    public static final String BASE_URL = "https://your-api-server.com/";
    public static final String DEFAULT_API_KEY = "your_api_key_here";
    public static final int CONNECTION_TIMEOUT = 30; // seconds
    public static final int READ_TIMEOUT = 30; // seconds
    public static final boolean DEBUG_MODE = true; // Enable detailed logs
}
```

### Step 2: Initialize the SDK
```java
// In your MainActivity.java or Application class
import com.analytics.analyticstracker.AnalyticsTracker;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // Initialize the SDK
        AnalyticsTracker.init(TrackerConfig.BASE_URL, TrackerConfig.DEFAULT_API_KEY);
    }
}
```

## 📊 Usage Examples

### 1. Track User Events
```java
// Track a button click
Map<String, Object> properties = new HashMap<>();
properties.put("button_name", "login");
properties.put("screen", "MainActivity");
AnalyticsTracker.trackEvent("user123", "button_click", properties);

// Track category selection
Map<String, Object> categoryProps = new HashMap<>();
categoryProps.put("category", "sports");
categoryProps.put("subcategory", "football");
AnalyticsTracker.trackEvent("user123", "category_selected", categoryProps);
```

### 2. Track Screen Time
```java
public class MainActivity extends AppCompatActivity {
    
    @Override
    protected void onResume() {
        super.onResume();
        // Start tracking screen time
        AnalyticsTracker.startScreen("MainActivity");
    }
    
    @Override
    protected void onPause() {
        super.onPause();
        // End tracking screen time
        String userId = getCurrentUserId(); // Your method to get user ID
        AnalyticsTracker.endScreen(userId);
    }
}
```

### 3. Track Custom Events
```java
// Track purchase event
Map<String, Object> purchaseProps = new HashMap<>();
purchaseProps.put("item_id", "12345");
purchaseProps.put("price", 29.99);
purchaseProps.put("currency", "USD");
AnalyticsTracker.trackEvent("user123", "purchase", purchaseProps);

// Track search event
Map<String, Object> searchProps = new HashMap<>();
searchProps.put("query", "android development");
searchProps.put("results_count", 42);
AnalyticsTracker.trackEvent("user123", "search", searchProps);
```

## 🔧 Advanced Configuration

### Custom User ID Management
```java
public class UserManager {
    private static final String PREF_USER_ID = "user_id";
    
    public static String getUserId(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("analytics", Context.MODE_PRIVATE);
        return prefs.getString(PREF_USER_ID, generateUniqueId());
    }
    
    public static void setUserId(Context context, String userId) {
        SharedPreferences prefs = context.getSharedPreferences("analytics", Context.MODE_PRIVATE);
        prefs.edit().putString(PREF_USER_ID, userId).apply();
    }
    
    private static String generateUniqueId() {
        return UUID.randomUUID().toString();
    }
}
```

### Error Handling
```java
// The SDK handles errors gracefully and logs them
// You can check logs with tag "AnalyticsTracker"
Log.d("AnalyticsTracker", "Event tracked successfully");
Log.e("AnalyticsTracker", "Failed to track event: " + error.getMessage());
```

## 🎯 Best Practices

### 1. User ID Management
- Use consistent, unique user IDs across sessions
- Don't use personally identifiable information (PII)
- Consider using hashed or anonymized IDs

### 2. Event Naming
```java
// Good: Descriptive and consistent
AnalyticsTracker.trackEvent(userId, "button_click", props);
AnalyticsTracker.trackEvent(userId, "screen_view", props);
AnalyticsTracker.trackEvent(userId, "user_signup", props);

// Bad: Inconsistent or unclear
AnalyticsTracker.trackEvent(userId, "click", props);
AnalyticsTracker.trackEvent(userId, "event1", props);
```

### 3. Property Structure
```java
// Good: Structured and meaningful
Map<String, Object> props = new HashMap<>();
props.put("screen_name", "ProductDetails");
props.put("product_id", "12345");
props.put("category", "electronics");
props.put("price", 299.99);

// Bad: Unstructured or meaningless
Map<String, Object> props = new HashMap<>();
props.put("data", "some_value");
props.put("x", 123);
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Events Not Appearing in Dashboard
- Check internet connection
- Verify API key is correct
- Check server URL is accessible
- Look for error logs with tag "AnalyticsTracker"

#### 2. SDK Initialization Fails
```java
// Check if initialization was successful
if (AnalyticsTracker.isInitialized()) {
    Log.d("Analytics", "SDK initialized successfully");
} else {
    Log.e("Analytics", "SDK initialization failed");
}
```

#### 3. Network Errors
- Ensure INTERNET permission is added
- Check if server is running
- Verify CORS settings on server

### Debug Mode
```java
// Enable debug mode for detailed logging
public static final boolean DEBUG_MODE = true;
```

## 📈 Performance Considerations

- Events are sent asynchronously to avoid blocking UI
- Failed events are retried automatically
- Network requests are optimized for minimal battery usage
- Data is compressed before transmission

## 🔒 Security Notes

- Never hardcode API keys in production
- Use environment variables or build configs
- Implement proper user authentication
- Follow data privacy regulations (GDPR, CCPA)

---

**Next Steps**: [API Reference](./api-reference.md) | [Code Examples](./examples.md)
