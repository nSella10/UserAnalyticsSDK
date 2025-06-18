# API Reference

Complete reference for all User Analytics SDK methods and classes.

## 📚 Table of Contents

- [AnalyticsTracker](#analyticsstracker)
- [Initialization Methods](#initialization-methods)
- [Event Tracking](#event-tracking)
- [Screen Time Tracking](#screen-time-tracking)
- [User Management](#user-management)
- [Data Models](#data-models)

## AnalyticsTracker

The main class for interacting with the User Analytics SDK.

### Package
```java
com.analytics.analyticstracker.AnalyticsTracker
```

### Import
```java
import com.analytics.analyticstracker.AnalyticsTracker;
```

## Initialization Methods

### init(String baseUrl, String apiKey)

Initializes the SDK with custom server URL and API key.

**Parameters:**
- `baseUrl` (String): The analytics server URL
- `apiKey` (String): Your unique API key from the dashboard

**Example:**
```java
AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", "ak_your_api_key");
```

**Notes:**
- Must be called before any other SDK methods
- Typically called in `onCreate()` of your main activity
- API key format: `ak_` followed by alphanumeric characters

### init(String apiKey)

Initializes the SDK with API key only (uses default server URL).

**Parameters:**
- `apiKey` (String): Your unique API key

**Example:**
```java
AnalyticsTracker.init("ak_your_api_key");
```

**Note:** This method uses a default base URL. Use the two-parameter version for production.

## Event Tracking

### trackEvent(String userId, String actionName, Map<String, Object> properties)

Tracks a custom user event with properties.

**Parameters:**
- `userId` (String): Unique identifier for the user
- `actionName` (String): Name of the action/event
- `properties` (Map<String, Object>): Additional event data

**Example:**
```java
Map<String, Object> properties = new HashMap<>();
properties.put("category", "ספורט");
properties.put("subcategory", "כדורגל");
properties.put("item", "כריסטיאנו רונאלדו");

AnalyticsTracker.trackEvent("user123", "click_item", properties);
```

**Common Event Names:**
- `app_opened` - App launch
- `click_category` - Category selection
- `click_subcategory` - Subcategory selection
- `click_item` - Interest item selection
- `profile_viewed` - Profile screen viewed
- `profile_updated` - Profile information updated

**Property Types:**
- String
- Integer
- Double/Float
- Boolean
- Long

## Screen Time Tracking

### startScreen(String screenName)

Starts tracking time spent on a screen.

**Parameters:**
- `screenName` (String): Name of the screen/activity

**Example:**
```java
@Override
protected void onResume() {
    super.onResume();
    AnalyticsTracker.startScreen("MainActivity");
}
```

**Best Practices:**
- Call in `onResume()` method
- Use consistent screen names
- Use descriptive names (e.g., "MainActivity", "CategoryActivity", "UserProfileActivity")

### endScreen(String userId)

Ends screen time tracking and sends data to server.

**Parameters:**
- `userId` (String): Unique identifier for the user

**Example:**
```java
@Override
protected void onPause() {
    super.onPause();
    AnalyticsTracker.endScreen("user123");
}
```

**Best Practices:**
- Call in `onPause()` method
- Always pair with `startScreen()`
- Use the same userId consistently

### trackScreenTime(String userId, String screenName, long startTimeMillis, long endTimeMillis, long durationMillis)

Manually track screen time with specific timestamps.

**Parameters:**
- `userId` (String): User identifier
- `screenName` (String): Screen name
- `startTimeMillis` (long): Start timestamp in milliseconds
- `endTimeMillis` (long): End timestamp in milliseconds
- `durationMillis` (long): Duration in milliseconds

**Example:**
```java
long startTime = System.currentTimeMillis();
// ... user interaction ...
long endTime = System.currentTimeMillis();
long duration = endTime - startTime;

AnalyticsTracker.trackScreenTime("user123", "GameScreen", startTime, endTime, duration);
```

**Note:** This method is for advanced use cases. Use `startScreen()`/`endScreen()` for normal tracking.

## User Management

### loginUser(LoginRequest request, Callback<AuthResponse> callback)

Authenticates a user with the analytics system.

**Parameters:**
- `request` (LoginRequest): Login credentials
- `callback` (Callback<AuthResponse>): Response callback

**Example:**
```java
LoginRequest loginRequest = new LoginRequest("user@myinterest.com", "password");

AnalyticsTracker.loginUser(loginRequest, new Callback<AuthResponse>() {
    @Override
    public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
        if (response.isSuccessful()) {
            AuthResponse authResponse = response.body();
            // Handle successful login
        }
    }

    @Override
    public void onFailure(Call<AuthResponse> call, Throwable t) {
        // Handle login error
    }
});
```

### updateUserName(String userId, String firstName, String lastName, Callback<Void> callback)

Updates user's name information.

**Parameters:**
- `userId` (String): User identifier
- `firstName` (String): User's first name
- `lastName` (String): User's last name
- `callback` (Callback<Void>): Response callback

**Example:**
```java
AnalyticsTracker.updateUserName("user123", "John", "Doe", new Callback<Void>() {
    @Override
    public void onResponse(Call<Void> call, Response<Void> response) {
        if (response.isSuccessful()) {
            // Name updated successfully
        }
    }

    @Override
    public void onFailure(Call<Void> call, Throwable t) {
        // Handle error
    }
});
```

## Data Models

### ActionEvent

Represents a user action event.

**Fields:**
- `userId` (String): User identifier
- `actionName` (String): Action name
- `timestamp` (String): ISO timestamp
- `properties` (Map<String, Object>): Event properties
- `apiKey` (String): API key

### ScreenTime

Represents screen time data.

**Fields:**
- `userId` (String): User identifier
- `screenName` (String): Screen name
- `durationMillis` (long): Duration in milliseconds
- `startTime` (String): Start timestamp
- `endTime` (String): End timestamp
- `apiKey` (String): API key

### LoginRequest

Login request data.

**Fields:**
- `email` (String): User email
- `password` (String): User password

### AuthResponse

Authentication response.

**Fields:**
- `token` (String): JWT token
- `userId` (String): User ID
- `email` (String): User email

## 🔧 Configuration

### Error Handling

The SDK handles errors gracefully:

- **Network errors**: Logged and retried automatically
- **Invalid API key**: Logged with clear error message
- **Missing initialization**: Methods return early with warning

### Logging

The SDK uses Android's Log system:

```java
Log.d("AnalyticsTracker", "Event sent successfully");
Log.e("AnalyticsTracker", "Network error occurred");
```

**Log Tags:**
- `AnalyticsTracker` - Main SDK operations
- `ApiClient` - Network operations

### Thread Safety

- All SDK methods are thread-safe
- Network calls are made asynchronously
- UI thread is never blocked

## 📱 Best Practices

### User ID Management

```java
// Good: Consistent user ID
String userId = UserManager.getCurrentUserId();
AnalyticsTracker.trackEvent(userId, "action", properties);

// Bad: Hardcoded or random IDs
AnalyticsTracker.trackEvent("user123", "action", properties);
```

### Event Naming

```java
// Good: Descriptive, consistent naming
AnalyticsTracker.trackEvent(userId, "click_category", properties);

// Bad: Vague or inconsistent naming
AnalyticsTracker.trackEvent(userId, "click", properties);
```

### Property Structure

```java
// Good: Structured, meaningful properties
Map<String, Object> properties = new HashMap<>();
properties.put("category", "ספורט");
properties.put("subcategory", "כדורגל");
properties.put("item", "כריסטיאנו רונאלדו");
properties.put("position", 0);

// Bad: Unstructured or meaningless properties
Map<String, Object> properties = new HashMap<>();
properties.put("data", "some_value");
```

## 🚨 Error Codes

Common error scenarios and their handling:

| Error | Description | Solution |
|-------|-------------|----------|
| `API Key not initialized` | SDK not initialized | Call `init()` first |
| `Network error` | Connection failed | Check internet connection |
| `Invalid API key` | Wrong or expired key | Verify key in dashboard |
| `Server error 500` | Backend issue | Contact support |

---

**For more examples, see [Examples Documentation](examples.md)**
