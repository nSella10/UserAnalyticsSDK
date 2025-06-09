# 🔒 הגדרת אבטחה לפרויקט Analytics

## ⚠️ חשוב לפני העלאה לגיט!

### קבצים שאסור להעלות:
- `TrackerConfig.java` - מכיל API Keys ו-URLs רגישים
- `local.properties` - מכיל נתיבי SDK
- כל קובץ עם מידע רגיש

### 🛠️ הוראות הגדרה:

#### 1. הגדרת TrackerConfig:
```bash
# העתק את קובץ הדוגמה
cp analyticstracker/src/main/java/com/analytics/analyticstracker/config/TrackerConfig.example.java \
   analyticstracker/src/main/java/com/analytics/analyticstracker/config/TrackerConfig.java
```

#### 2. ערוך את TrackerConfig.java:
```java
public static final String BASE_URL = "http://YOUR_SERVER_IP:8080/";
public static final String DEFAULT_API_KEY = "YOUR_ACTUAL_API_KEY";
```

#### 3. וודא ש-.gitignore מוגדר נכון:
הקובץ `.gitignore` כבר מוגדר לחסום קבצים רגישים.

### 🔐 עצות אבטחה:

1. **אל תשתף API Keys** בצ'אטים או אימיילים
2. **החלף API Keys** אם הם נחשפו
3. **השתמש ב-HTTPS** בפרודקשן
4. **הגבל גישה** לשרת לפי IP
5. **עקוב אחר לוגים** לזיהוי שימוש חשוד

### 🚨 אם API Key נחשף:
1. היכנס לדשבורד המפתחים
2. צור אפליקציה חדשה עם API Key חדש
3. עדכן את הקוד עם ה-API Key החדש
4. מחק את האפליקציה הישנה

### 📞 צור קשר:
אם יש בעיות אבטחה, צור קשר מיד!
