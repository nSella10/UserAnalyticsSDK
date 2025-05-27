package com.analytics.analyticsfinal.utils;

import android.content.Context;
import android.content.SharedPreferences;

public class UserManager {

    private static final String PREF_USER = "user";
    private static final String PREF_AUTH = "auth";

    private static final String KEY_FIRST_NAME = "firstName";
    private static final String KEY_LAST_NAME = "lastName";
    private static final String KEY_EMAIL = "email";
    private static final String KEY_AGE = "age";
    private static final String KEY_GENDER = "gender";
    private static final String KEY_USER_ID = "user_id";

    // שמירה של מזהה יוזר
    public static void saveUserId(Context context, String userId) {
        SharedPreferences prefs = context.getSharedPreferences(PREF_AUTH, Context.MODE_PRIVATE);
        prefs.edit().putString(KEY_USER_ID, userId).apply();
    }

    public static String getUserId(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREF_AUTH, Context.MODE_PRIVATE);
        return prefs.getString(KEY_USER_ID, null);
    }

    // שמירה של פרטים אישיים
    public static void setFirstName(Context context, String firstName) {
        context.getSharedPreferences(PREF_USER, Context.MODE_PRIVATE)
                .edit().putString(KEY_FIRST_NAME, firstName).apply();
    }

    public static void setLastName(Context context, String lastName) {
        context.getSharedPreferences(PREF_USER, Context.MODE_PRIVATE)
                .edit().putString(KEY_LAST_NAME, lastName).apply();
    }

    public static void setEmail(Context context, String email) {
        context.getSharedPreferences(PREF_USER, Context.MODE_PRIVATE)
                .edit().putString(KEY_EMAIL, email).apply();
    }

    public static void setAge(Context context, int age) {
        context.getSharedPreferences(PREF_USER, Context.MODE_PRIVATE)
                .edit().putInt(KEY_AGE, age).apply();
    }

    public static void setGender(Context context, String gender) {
        context.getSharedPreferences(PREF_USER, Context.MODE_PRIVATE)
                .edit().putString(KEY_GENDER, gender).apply();
    }

    // שליפה של פרטים
    public static String getFirstName(Context context) {
        return context.getSharedPreferences(PREF_USER, Context.MODE_PRIVATE)
                .getString(KEY_FIRST_NAME, "לא ידוע");
    }

    public static String getLastName(Context context) {
        return context.getSharedPreferences(PREF_USER, Context.MODE_PRIVATE)
                .getString(KEY_LAST_NAME, "לא ידוע");
    }

    public static String getEmail(Context context) {
        return context.getSharedPreferences(PREF_USER, Context.MODE_PRIVATE)
                .getString(KEY_EMAIL, "לא ידוע");
    }

    public static int getAge(Context context) {
        return context.getSharedPreferences(PREF_USER, Context.MODE_PRIVATE)
                .getInt(KEY_AGE, 0);
    }

    public static String getGender(Context context) {
        return context.getSharedPreferences(PREF_USER, Context.MODE_PRIVATE)
                .getString(KEY_GENDER, "לא ידוע");
    }

    // ניקוי כל פרטי המשתמש (לוגאאוט)
    public static void clearUser(Context context) {
        context.getSharedPreferences(PREF_USER, Context.MODE_PRIVATE)
                .edit().clear().apply();
        context.getSharedPreferences(PREF_AUTH, Context.MODE_PRIVATE)
                .edit().clear().apply();
    }
}
