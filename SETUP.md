# הגדרת הפרויקט - Analytics Final

## קבצי קונפיגורציה נדרשים

### 1. Android App - קובץ local.properties

צור קובץ `local.properties` בשורש הפרויקט עם התוכן הבא:

```properties
# Android SDK path (יתעדכן אוטומטית)
sdk.dir=YOUR_ANDROID_SDK_PATH

# ===== נתונים רגישים - לא לעלות ל-Git =====
# כתובת השרת (עדכן לפי הסביבה שלך)
BASE_URL=http://YOUR_SERVER_IP:8080/

# API Key של האפליקציה (קבל מהדשבורד)
API_KEY=your_api_key_here
```

### 2. Backend - קובץ application.properties

צור קובץ `backend/src/main/resources/application.properties` עם התוכן הבא:

```properties
#spring.application.name=User Analytics

# MongoDB Configuration
# For production, use MongoDB Atlas:
spring.data.mongodb.uri=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority&appName=CLUSTER_NAME

# For local development, use local MongoDB:
# spring.data.mongodb.uri=mongodb://localhost:27017/user-analytics

# MongoDB Configuration
spring.data.mongodb.auto-index-creation=true

# Server Configuration
server.port=8080
server.address=0.0.0.0

# JWT Configuration
# Generate a secure secret key for production
jwt.secret=YOUR_SECURE_JWT_SECRET_KEY_HERE

# Logging Configuration (for debugging)
logging.level.com.analytics.user_analytics.controller=DEBUG
logging.level.com.analytics.user_analytics.service=DEBUG
logging.level.org.springframework.data.mongodb=DEBUG
logging.level.org.springframework.web=DEBUG
```

### 3. Frontend - קובץ .env

צור קובץ `frontend/.env` עם התוכן הבא:

```env
# Server URL
REACT_APP_API_URL=http://YOUR_SERVER_IP:8080

# Other environment variables
REACT_APP_ENV=development
```

## הוראות הגדרה

### 1. הגדרת MongoDB
- צור חשבון ב-MongoDB Atlas או התקן MongoDB מקומי
- עדכן את connection string ב-application.properties

### 2. הגדרת JWT Secret
- צור מפתח JWT חזק (לפחות 256 ביט)
- עדכן את jwt.secret ב-application.properties

### 3. הגדרת כתובת השרת
- עדכן את BASE_URL ב-local.properties
- עדכן את REACT_APP_API_URL ב-frontend/.env
- הוסף את הכתובת ל-network_security_config.xml אם נדרש

### 4. הגדרת API Key
- הרץ את השרת ופתח את הדשבורד
- צור אפליקציה חדשה וקבל API Key
- עדכן את API_KEY ב-local.properties

## קבצים שלא עולים ל-Git

הקבצים הבאים נמצאים ב-.gitignore ולא יעלו ל-Git:
- `local.properties`
- `backend/src/main/resources/application.properties`
- `frontend/.env`

## בדיקת הגדרה

1. ודא שכל הקבצים נוצרו
2. הרץ את הבקאנד: `cd backend && ./gradlew bootRun`
3. הרץ את הפרונטאנד: `cd frontend && npm start`
4. בנה את האפליקציה: `./gradlew assembleDebug`

## אבטחה

⚠️ **חשוב**: אל תעלה קבצי קונפיגורציה עם נתונים רגישים ל-Git!

- השתמש בסיסמאות חזקות
- החלף JWT secrets בפרודקשן
- השתמש ב-HTTPS בפרודקשן
- הגבל גישה למסד הנתונים
