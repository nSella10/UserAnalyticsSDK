# Security Guide

Best practices for secure implementation of the User Analytics SDK.

## 🔒 API Key Security

### Never Hardcode API Keys

❌ **Bad - Hardcoded in source code:**
```java
// DON'T DO THIS - API key visible in source code
AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", "ak_827aeb412aed4b23b8260432");
```

✅ **Good - Use BuildConfig:**
```java
// Safe - API key hidden from source code
AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", BuildConfig.ANALYTICS_API_KEY);
```

### Secure Storage Methods

#### Method 1: BuildConfig (Recommended)

**Step 1:** Add to `build.gradle`:
```gradle
android {
    defaultConfig {
        buildConfigField "String", "ANALYTICS_API_KEY", "\"ak_your_api_key_here\""
    }
    
    buildFeatures {
        buildConfig true
    }
}
```

**Step 2:** Use in code:
```java
AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", BuildConfig.ANALYTICS_API_KEY);
```

#### Method 2: Local Properties File

**Step 1:** Create `local.properties` (add to `.gitignore`):
```properties
ANALYTICS_API_KEY=ak_your_api_key_here
```

**Step 2:** Read in `build.gradle`:
```gradle
def localProps = new Properties()
localProps.load(new FileInputStream(rootProject.file("local.properties")))

android {
    defaultConfig {
        buildConfigField "String", "ANALYTICS_API_KEY", "\"${localProps['ANALYTICS_API_KEY']}\""
    }
}
```

#### Method 3: Environment Variables

**Step 1:** Set environment variable:
```bash
export ANALYTICS_API_KEY=ak_your_api_key_here
```

**Step 2:** Use in `build.gradle`:
```gradle
android {
    defaultConfig {
        buildConfigField "String", "ANALYTICS_API_KEY", "\"${System.getenv('ANALYTICS_API_KEY')}\""
    }
}
```

### .gitignore Configuration

Always exclude sensitive files:

```gitignore
# API Keys and secrets
local.properties
*.key
*.secret
config.properties

# Build configs with secrets
app/src/main/java/**/Config.java
```

## 🛡️ Data Privacy

### User Consent

Implement proper user consent before tracking:

```java
public class ConsentManager {
    private static final String CONSENT_KEY = "analytics_consent";
    
    public static boolean hasUserConsent(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        return prefs.getBoolean(CONSENT_KEY, false);
    }
    
    public static void setUserConsent(Context context, boolean consent) {
        SharedPreferences prefs = context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        prefs.edit().putBoolean(CONSENT_KEY, consent).apply();
    }
}

// Usage
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        if (ConsentManager.hasUserConsent(this)) {
            // Initialize SDK only with consent
            AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", BuildConfig.ANALYTICS_API_KEY);
        } else {
            // Show consent dialog
            showConsentDialog();
        }
    }
}
```

### Data Minimization

Only collect necessary data:

```java
// Good - Minimal, relevant data
Map<String, Object> properties = new HashMap<>();
properties.put("category", "sports");
properties.put("action_type", "view");

// Bad - Excessive personal data
Map<String, Object> properties = new HashMap<>();
properties.put("user_email", "user@example.com");  // Don't collect unless necessary
properties.put("user_phone", "+1234567890");        // Avoid personal identifiers
properties.put("user_location", "exact_address");   // Use general location instead
```

### Anonymous User IDs

Use anonymous, non-reversible user identifiers:

```java
public class UserIdManager {
    private static final String USER_ID_KEY = "anonymous_user_id";
    
    public static String getAnonymousUserId(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
        String userId = prefs.getString(USER_ID_KEY, null);
        
        if (userId == null) {
            // Generate anonymous ID
            userId = "user_" + UUID.randomUUID().toString().replace("-", "");
            prefs.edit().putString(USER_ID_KEY, userId).apply();
        }
        
        return userId;
    }
}
```

## 🌐 Network Security

### HTTPS Only

Always use HTTPS for production:

```java
// Production - Always use HTTPS
AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", apiKey);

// Development - Local testing only
if (BuildConfig.DEBUG) {
    AnalyticsTracker.init("http://localhost:8080/", apiKey);
}
```

### Network Security Config

Configure network security in `res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- Production domain -->
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">d1xb34m3k0zeus.cloudfront.net</domain>
    </domain-config>
    
    <!-- Debug only - localhost -->
    <debug-overrides>
        <domain-config cleartextTrafficPermitted="true">
            <domain includeSubdomains="true">localhost</domain>
            <domain includeSubdomains="true">10.0.2.2</domain>
        </domain-config>
    </debug-overrides>
</network-security-config>
```

Reference in `AndroidManifest.xml`:

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config">
```





## 🚨 Security Incident Response

### If API Key is Compromised

1. **Immediate Actions:**
   - Log into [Developer Dashboard](https://d1xb34m3k0zeus.cloudfront.net)
   - Create new application with new API key
   - Update your app with new API key
   - Delete compromised application

2. **Code Changes:**
   ```java
   // Update with new API key
   AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", "ak_new_secure_key");
   ```

3. **Release Update:**
   - Push app update with new API key
   - Monitor for unauthorized usage
   - Review security practices

### Monitoring for Abuse

Check dashboard regularly for:
- Unusual traffic patterns
- Unknown user IDs
- Suspicious event patterns
- Unexpected data volumes

## 📱 App Security Best Practices

### ProGuard/R8 Configuration

Protect your code with obfuscation:

```proguard
# proguard-rules.pro

# Keep SDK classes
-keep class com.analytics.analyticstracker.** { *; }

# Obfuscate your app code
-obfuscationdictionary dictionary.txt
-classobfuscationdictionary dictionary.txt
-packageobfuscationdictionary dictionary.txt
```



## 🔍 Security Audit Checklist

### Before Release

- [ ] API keys not hardcoded in source
- [ ] Sensitive data excluded from version control
- [ ] HTTPS used for all network communication
- [ ] User consent implemented where required
- [ ] Minimal data collection principle followed
- [ ] Anonymous user IDs used
- [ ] Network security config properly set
- [ ] ProGuard/R8 obfuscation enabled
- [ ] Security testing performed

### Regular Security Reviews

- [ ] Review data collection practices
- [ ] Audit API key usage
- [ ] Check for security updates
- [ ] Monitor dashboard for anomalies
- [ ] Update dependencies regularly
- [ ] Review user permissions

## 📚 Privacy Compliance

### Key Privacy Principles

- **User Consent:** Always get user permission before tracking
- **Data Minimization:** Only collect necessary analytics data
- **Transparency:** Clearly explain what data you collect
- **User Control:** Allow users to opt-out of tracking

## 📞 Security Support

For security-related questions or to report vulnerabilities:

- **Security Issues:** [GitHub Security Advisories](https://github.com/nSella10/UserAnalyticsSDK/security)
- **General Questions:** [GitHub Issues](https://github.com/nSella10/UserAnalyticsSDK/issues)

---

**Remember: Security is an ongoing process, not a one-time setup. Regularly review and update your security practices.**
