package com.analytics.analyticsfinal.config;

import com.analytics.analyticsfinal.BuildConfig;

/**
 * קובץ קונפיגורציה מרכזי לכל הקבועים של האפליקציה
 * הערכים הרגישים נטענים מ-BuildConfig שנוצר מ-local.properties
 */
public class Config {

    // כתובת השרת הבסיסית - נטען מ-BuildConfig
    public static final String BASE_URL = BuildConfig.BASE_URL;

    // API Key של האפליקציה - נטען מ-BuildConfig
    public static final String API_KEY = BuildConfig.API_KEY;

    // קבועים נוספים שיכולים להיות שימושיים
    public static final int CONNECTION_TIMEOUT = 30; // שניות
    public static final int READ_TIMEOUT = 30; // שניות

    // הגדרות לוגים
    public static final boolean DEBUG_MODE = BuildConfig.DEBUG;
    public static final String LOG_TAG = "MyInterest";

    // Private constructor למניעת יצירת instance
    private Config() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }
}
