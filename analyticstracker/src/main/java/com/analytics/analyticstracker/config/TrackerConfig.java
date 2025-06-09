package com.analytics.analyticstracker.config;

/**
 * קובץ קונפיגורציה מרכזי עבור AnalyticsTracker
 *
 * ⚠️ חשוב: קובץ זה מכיל מידע רגיש ולא צריך להיות מועלה לגיט!
 * הקובץ כבר נוסף ל-.gitignore
 */
public class TrackerConfig {

    /**
     * כתובת השרת הבסיסית
     * TODO: בפרודקשן - העבר למשתני סביבה או BuildConfig
     */
    public static final String BASE_URL = "http://192.168.7.7:8080/";

//    /**
//     * API Key ברירת מחדל
//     * TODO: בפרודקשן - העבר למשתני סביבה או BuildConfig
//     */
    public static final String DEFAULT_API_KEY = "ak_4a2c2b0243684e448016cb1a";
    //public static final String DEFAULT_API_KEY = "ak_3e79afcb469e437c86b3c28b";

    /**
     * הגדרות נוספות
     */
    public static final int CONNECTION_TIMEOUT = 30; // שניות
    public static final int READ_TIMEOUT = 30; // שניות
    public static final boolean DEBUG_MODE = true; // הפעל לוגים מפורטים
}
