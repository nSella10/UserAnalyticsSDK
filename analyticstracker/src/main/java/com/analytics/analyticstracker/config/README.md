# 🔧 Configuration Setup

## ⚠️ חשוב - הגדרת קונפיגורציה

קובץ `TrackerConfig.java` מכיל מידע רגיש ולכן **אסור** שיהיה ב-Git.

### 📋 הוראות הגדרה:

1. **צור קובץ חדש:**
   צור קובץ בשם `TrackerConfig.java` בתיקיה הזו

2. **העתק את הקוד הבא לקובץ:**
   ```java
   package com.analytics.analyticstracker.config;

   public class TrackerConfig {
       public static final String BASE_URL = "http://YOUR_SERVER_IP:8080/";
       public static final String DEFAULT_API_KEY = "YOUR_API_KEY_HERE";

       public static final int CONNECTION_TIMEOUT = 30;
       public static final int READ_TIMEOUT = 30;
       public static final boolean DEBUG_MODE = true;
   }
   ```

3. **החלף את הערכים:**
   - החלף `YOUR_SERVER_IP` ב-IP של השרת שלך
   - החלף `YOUR_API_KEY_HERE` ב-API Key שלך

4. **דוגמה:**
   ```java
   public static final String BASE_URL = "http://192.168.1.100:8080/";
   public static final String DEFAULT_API_KEY = "ak_4a2c2b0243684e448016cb1a";
   ```

### 🔒 אבטחה

- ✅ `TrackerConfig.java.template` - נמצא ב-Git (בטוח)
- ❌ `TrackerConfig.java` - **לא** נמצא ב-Git (מוגן ב-.gitignore)

### 🚀 לפרודקשן

בפרודקשן, העבר את הערכים למשתני סביבה:
```java
public static final String BASE_URL = System.getenv("ANALYTICS_BASE_URL");
public static final String DEFAULT_API_KEY = System.getenv("ANALYTICS_API_KEY");
```
