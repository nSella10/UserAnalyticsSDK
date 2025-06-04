# מדריך למפתחים - Analytics SDK

## איך המערכת עובדת?

### 1. רישום והתחברות
1. המפתח נרשם למערכת עם פרטיו האישיים וחברה
2. המפתח מתחבר לדשבורד עם האימייל והסיסמה שלו

### 2. יצירת אפליקציה
1. המפתח יוצר אפליקציה חדשה בדשבורד
2. המערכת מייצרת **API Key ייחודי** לאפליקציה זו
3. ה-API Key נראה כך: `ak_827aeb412aed4b23b8260432`

### 3. אינטגרציה באפליקציית Android

#### שלב א: הוספת ה-SDK לפרויקט
```gradle
// בקובץ build.gradle (Module: app)
dependencies {
    implementation project(':analyticstracker')
}
```

#### שלב ב: אתחול ה-SDK
```java
// בקובץ MainActivity.java
import com.analytics.analyticstracker.AnalyticsTracker;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // אתחול ה-SDK עם ה-API Key שלך
        AnalyticsTracker.init("http://localhost:8080/", "YOUR_API_KEY_HERE");
    }
}
```

#### שלב ג: שליחת אירועים
```java
// שליחת אירוע כשהמשתמש לוחץ על קטגוריה
Map<String, Object> properties = new HashMap<>();
properties.put("category", "ספורט");
AnalyticsTracker.trackEvent("user123", "click_category", properties);
```

#### שלב ד: מדידת זמן מסך
```java
@Override
protected void onResume() {
    super.onResume();
    AnalyticsTracker.startScreen("MainActivity");
}

@Override
protected void onPause() {
    super.onPause();
    String userId = "user123"; // ID של המשתמש הנוכחי
    AnalyticsTracker.endScreen(userId);
}
```

### 4. איך ה-API Key עובד?

#### בצד הלקוח (Android):
- כל בקשה שנשלחת מה-SDK כוללת את ה-API Key
- ה-API Key מזהה את האפליקציה שלך

#### בצד השרת:
- השרת מקבל את הנתונים עם ה-API Key
- השרת שומר את הנתונים עם ה-API Key המתאים
- כשהמפתח נכנס לדשבורד, הוא רואה רק נתונים מהאפליקציות שלו

#### בדשבורד:
- המפתח בוחר אפליקציה מהרשימה שלו
- הדשבורד מציג רק נתונים עם ה-API Key של האפליקציה הנבחרת
- נתונים מאפליקציות אחרות לא מוצגים

### 5. דוגמה מלאה

```java
public class MainActivity extends AppCompatActivity {
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // אתחול עם ה-API Key שקיבלת מהדשבורד
        AnalyticsTracker.init("http://localhost:8080/", "ak_827aeb412aed4b23b8260432");
        
        // דוגמה לשליחת אירוע פתיחת אפליקציה
        String userId = UserManager.getUserId(this); // קבל ID מהמערכת שלך
        Map<String, Object> props = new HashMap<>();
        props.put("screen", "MainActivity");
        AnalyticsTracker.trackEvent(userId, "app_opened", props);
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        AnalyticsTracker.startScreen("MainActivity");
    }
    
    @Override
    protected void onPause() {
        super.onPause();
        String userId = UserManager.getUserId(this);
        AnalyticsTracker.endScreen(userId);
    }
    
    private void onCategoryClick(String categoryName) {
        String userId = UserManager.getUserId(this);
        Map<String, Object> props = new HashMap<>();
        props.put("category", categoryName);
        AnalyticsTracker.trackEvent(userId, "click_category", props);
    }
}
```

### 6. בדיקת התקנה

1. הרץ את האפליקציה שלך
2. בצע כמה פעולות (לחיצות, מעברים בין מסכים)
3. היכנס לדשבורד ובחר את האפליקציה שלך
4. בדוק שהנתונים מופיעים בגרפים

### 7. הערות חשובות

- **אבטחה**: שמור את ה-API Key במקום בטוח
- **משתמשים**: כל משתמש צריך ID ייחודי עקבי
- **בידוד נתונים**: כל אפליקציה רואה רק את הנתונים שלה
- **זמן אמת**: הנתונים מופיעים בדשבורד תוך שניות

### 8. פתרון בעיות

#### הנתונים לא מופיעים בדשבורד:
1. בדוק שה-API Key נכון
2. בדוק שהשרת זמין
3. בדוק את הלוגים באפליקציה
4. וודא שבחרת את האפליקציה הנכונה בדשבורד

#### רואה נתונים מאפליקציות אחרות:
- זה לא אמור לקרות! כל אפליקציה מבודדת לפי ה-API Key שלה
