package com.analytics.analyticstracker.config;

/**
 * קובץ דוגמה לקונפיגורציה של AnalyticsTracker
 * 
 * ⚠️ חשוב: 
 * 1. העתק קובץ זה ל-TrackerConfig.java
 * 2. שנה את הערכים לערכים האמיתיים שלך
 * 3. הקובץ TrackerConfig.java לא יועלה לגיט (מוגן על ידי .gitignore)
 */
public class TrackerConfig {

    /**
     * כתובת השרת הבסיסית
     * שנה לכתובת השרת שלך
     */
    public static final String BASE_URL = "http://YOUR_SERVER_IP:8080/";

    /**
     * API Key ברירת מחדל
     * שנה ל-API Key שלך מהדשבורד
     */
    public static final String DEFAULT_API_KEY = "YOUR_API_KEY_HERE";

    /**
     * הגדרות נוספות
     */
    public static final int CONNECTION_TIMEOUT = 30; // שניות
    public static final int READ_TIMEOUT = 30; // שניות
    public static final boolean DEBUG_MODE = true; // הפעל לוגים מפורטים
}
