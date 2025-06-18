# Troubleshooting Guide

Common issues and solutions for the User Analytics SDK.

## 🚨 Common Issues

### Installation Problems

#### "Could not resolve dependency"

**Error Message:**
```
Could not resolve: com.github.nSella10:UserAnalyticsSDK:v1.0.6
```

**Solutions:**

1. **Check JitPack Repository**
   ```gradle
   // In settings.gradle
   dependencyResolutionManagement {
       repositories {
           google()
           mavenCentral()
           maven { url 'https://jitpack.io' } // Make sure this is present
       }
   }
   ```

2. **Clear Gradle Cache**
   ```bash
   ./gradlew clean
   ./gradlew build --refresh-dependencies
   ```

3. **Check Internet Connection**
   - Ensure your development machine has internet access
   - Try building with VPN disabled if using one

4. **Verify Version**
   - Check [JitPack page](https://jitpack.io/#nSella10/UserAnalyticsSDK) for available versions
   - Use latest stable version: `v1.0.6`

#### "Manifest merger failed"

**Error Message:**
```
Manifest merger failed : uses-permission#android.permission.INTERNET was tagged at AndroidManifest.xml
```

**Solution:**
```xml
<!-- Remove duplicate INTERNET permissions -->
<uses-permission android:name="android.permission.INTERNET" />
```

### Runtime Errors

#### "API Key not initialized"

**Error Message:**
```
❌ API Key not initialized. Call init() first.
```

**Solutions:**

1. **Initialize SDK First**
   ```java
   // Call this before any other SDK methods
   AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", "your_api_key");
   ```

2. **Check Initialization Location**
   ```java
   // Initialize in onCreate() of your main activity
   @Override
   protected void onCreate(Bundle savedInstanceState) {
       super.onCreate(savedInstanceState);
       setContentView(R.layout.activity_main);
       
       // Initialize here
       AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", "ak_your_key");
   }
   ```

#### "Network error"

**Error Message:**
```
❌ Network error sending event: java.net.UnknownHostException
```

**Solutions:**

1. **Check Internet Permission**
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   ```

2. **Verify Network Connection**
   - Test on device with internet access
   - Check if emulator has network access

3. **Check Server URL**
   ```java
   // Use correct server URL
   AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", "your_api_key");
   ```

4. **Network Security Config**
   ```xml
   <!-- In AndroidManifest.xml -->
   <application
       android:networkSecurityConfig="@xml/network_security_config">
   ```

   ```xml
   <!-- res/xml/network_security_config.xml -->
   <?xml version="1.0" encoding="utf-8"?>
   <network-security-config>
       <domain-config cleartextTrafficPermitted="false">
           <domain includeSubdomains="true">d1xb34m3k0zeus.cloudfront.net</domain>
       </domain-config>
   </network-security-config>
   ```

#### "Invalid API Key"

**Error Message:**
```
❌ Event failed with code: 401
```

**Solutions:**

1. **Verify API Key Format**
   - Should start with `ak_`
   - Example: `ak_827aeb412aed4b23b8260432`

2. **Check Dashboard**
   - Log into [Developer Dashboard](https://d1xb34m3k0zeus.cloudfront.net)
   - Verify API key is correct
   - Ensure app is active

3. **Copy-Paste Carefully**
   ```java
   // Avoid typos - copy directly from dashboard
   String apiKey = "ak_827aeb412aed4b23b8260432"; // Your actual key
   AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", apiKey);
   ```

### Data Not Appearing

#### Events not showing in dashboard

**Possible Causes:**

1. **Wrong App Selected**
   - Check you've selected correct app in dashboard
   - Verify API key matches selected app

2. **Timing Issues**
   - Data appears within seconds, but check after 1-2 minutes
   - Refresh dashboard page

3. **Event Not Sent**
   ```java
   // Check logs for confirmation
   Log.d("AnalyticsTracker", "Event sent successfully");
   ```

4. **User ID Issues**
   ```java
   // Ensure user ID is not null or empty
   String userId = UserManager.getCurrentUserId();
   if (userId != null && !userId.isEmpty()) {
       AnalyticsTracker.trackEvent(userId, "event_name", properties);
   }
   ```

#### Screen time not tracking

**Solutions:**

1. **Pair Start/End Calls**
   ```java
   @Override
   protected void onResume() {
       super.onResume();
       AnalyticsTracker.startScreen("MainActivity");
   }

   @Override
   protected void onPause() {
       super.onPause();
       AnalyticsTracker.endScreen("user123");
   }
   ```

2. **Check User ID**
   ```java
   // Use same user ID for start and end
   private String userId = UserManager.getCurrentUserId();
   
   AnalyticsTracker.startScreen("MainActivity");
   // Later...
   AnalyticsTracker.endScreen(userId); // Same user ID
   ```

### Performance Issues

#### App feels slow after SDK integration

**Solutions:**

1. **SDK is Async**
   - All network calls are asynchronous
   - SDK doesn't block UI thread

2. **Reduce Event Frequency**
   ```java
   // Don't track every scroll event
   private long lastScrollTrack = 0;
   
   private void onScroll() {
       long now = System.currentTimeMillis();
       if (now - lastScrollTrack > 5000) { // 5 second throttle
           trackScrollEvent();
           lastScrollTrack = now;
       }
   }
   ```

3. **Batch Events**
   ```java
   // Instead of tracking every click, batch them
   private List<String> clickEvents = new ArrayList<>();
   
   private void onButtonClick(String buttonName) {
       clickEvents.add(buttonName);
       
       // Send batch every 10 clicks
       if (clickEvents.size() >= 10) {
           sendBatchedEvents();
           clickEvents.clear();
       }
   }
   ```

## 🔧 Debug Mode

### Enable Detailed Logging

```java
// Add this to see detailed SDK logs
if (BuildConfig.DEBUG) {
    // SDK automatically logs to Android Log
    // Filter by "AnalyticsTracker" tag in Logcat
}
```

### Logcat Filters

```bash
# View only SDK logs
adb logcat -s AnalyticsTracker

# View network logs
adb logcat -s AnalyticsTracker,OkHttp
```

### Test Events

```java
// Send test event to verify connection
Map<String, Object> testProps = new HashMap<>();
testProps.put("test", true);
testProps.put("timestamp", System.currentTimeMillis());
AnalyticsTracker.trackEvent("test_user", "sdk_test", testProps);
```

## 🧪 Testing Checklist

### Before Release

- [ ] SDK initializes without errors
- [ ] Test events appear in dashboard
- [ ] Screen time tracking works
- [ ] No network errors in logs
- [ ] App performance not affected
- [ ] API key is secure (not hardcoded)

### Test Scenarios

1. **Fresh Install**
   ```java
   // Test with new user ID
   String newUserId = UUID.randomUUID().toString();
   AnalyticsTracker.trackEvent(newUserId, "first_launch", properties);
   ```

2. **Network Interruption**
   - Turn off WiFi during event sending
   - Verify events are queued and sent when connection returns

3. **App Backgrounding**
   ```java
   // Test screen time tracking with app switching
   // onPause() -> onResume() cycle
   ```

## 📞 Getting Help

### Self-Help Resources

1. **Check Logs First**
   ```bash
   adb logcat -s AnalyticsTracker
   ```

2. **Verify Configuration**
   - API key format and validity
   - Network permissions
   - Server URL

3. **Test with Minimal Example**
   ```java
   // Minimal test case
   AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", "your_api_key");
   
   Map<String, Object> props = new HashMap<>();
   props.put("test", "minimal");
   AnalyticsTracker.trackEvent("test_user", "test_event", props);
   ```

### Contact Support

If issues persist:

1. **GitHub Issues**
   - [Create new issue](https://github.com/nSella10/UserAnalyticsSDK/issues)
   - Include error logs and code snippets

2. **Information to Include**
   - Android version
   - SDK version
   - Error logs
   - Minimal reproduction code
   - Device/emulator details

### Known Issues

#### Android 9+ Network Security

**Issue:** Network requests blocked on Android 9+

**Solution:**
```xml
<!-- Add to AndroidManifest.xml -->
<application
    android:usesCleartextTraffic="false"
    android:networkSecurityConfig="@xml/network_security_config">
```

#### ProGuard/R8 Obfuscation

**Issue:** SDK classes obfuscated in release builds

**Solution:**
```proguard
# Add to proguard-rules.pro
-keep class com.analytics.analyticstracker.** { *; }
-keep interface com.analytics.analyticstracker.** { *; }
```

## 🔄 Version Migration

### Upgrading from v1.0.5 to v1.0.6

No breaking changes - just update version:

```gradle
implementation 'com.github.nSella10:UserAnalyticsSDK:v1.0.6'
```

### Future Upgrades

Check [CHANGELOG.md](../CHANGELOG.md) for version-specific migration notes.

---

**Still having issues? [Open an issue on GitHub](https://github.com/nSella10/UserAnalyticsSDK/issues)**
