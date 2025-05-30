//package com.analytics.analyticstracker;
//
//import android.util.Log;
//
//import androidx.annotation.NonNull;
//
//import com.analytics.analyticstracker.api.ApiClient;
//import com.analytics.analyticstracker.api.TrackerApi;
//import com.analytics.analyticstracker.api.UserApi;
//import com.analytics.analyticstracker.model.ActionEvent;
//import com.analytics.analyticstracker.model.AuthResponse;
//import com.analytics.analyticstracker.model.LoginRequest;
//import com.analytics.analyticstracker.model.UpdateNameRequest;
//import com.analytics.analyticstracker.model.User;
//
//import java.text.SimpleDateFormat;
//import java.util.Date;
//import java.util.HashMap;
//import java.util.Locale;
//import java.util.Map;
//
//import retrofit2.Call;
//import retrofit2.Callback;
//import retrofit2.Response;
//
//public class AnalyticsTracker {
//
//    private static String BASE_URL = "http://192.168.7.7:8080/"; // Default base URL
//
//    private static String currentScreen = null;
//    private static long screenEnterTime = 0;
//
//    // אתחול כתובת ה-API
//    public static void init(String baseUrl) {
//        BASE_URL = baseUrl;
//    }
//
//    // שליחת פעולה (event) לשרת
//    public static void trackEvent(String userId, String actionName, Map<String, Object> properties) {
//        String timestamp = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault()).format(new Date());
//
//        ActionEvent event = new ActionEvent(userId, actionName, timestamp, properties);
//        TrackerApi api = ApiClient.getClient(BASE_URL).create(TrackerApi.class);
//
//        Call<Void> call = api.sendEvent(event);
//        call.enqueue(new Callback<Void>() {
//            @Override
//            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
//                Log.d("AnalyticsTracker", "Event sent successfully: " + actionName);
//            }
//
//            @Override
//            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
//                Log.e("AnalyticsTracker", "Failed to send event: " + t.getMessage());
//            }
//        });
//    }
//
//    // מדידת זמן שהייה במסך – התחלה
//    public static void startScreen(String screenName) {
//        currentScreen = screenName;
//        screenEnterTime = System.currentTimeMillis();
//    }
//
//    // מדידת זמן שהייה במסך – סיום ושליחה לשרת
//    public static void endScreen(String userId) {
//        if (currentScreen == null || screenEnterTime == 0) {
//            return;
//        }
//
//        long durationMillis = System.currentTimeMillis() - screenEnterTime;
//        long durationSeconds = durationMillis / 1000;
//
//        Map<String, Object> props = new HashMap<>();
//        props.put("screen", currentScreen);
//        props.put("durationSeconds", durationSeconds);
//
//        trackEvent(userId, "screen_duration", props);
//
//        // איפוס
//        currentScreen = null;
//        screenEnterTime = 0;
//    }
//
//    // רישום משתמש
//    public static void signupUser(User user, Callback<Void> callback) {
//        UserApi userApi = ApiClient.getClient(BASE_URL).create(UserApi.class);
//        Call<Void> call = userApi.registerUser(user);
//        call.enqueue(callback);
//    }
//
//    // התחברות משתמש
//    public static void loginUser(LoginRequest request, Callback<AuthResponse> callback) {
//        UserApi userApi = ApiClient.getClient(BASE_URL).create(UserApi.class);
//        Call<AuthResponse> call = userApi.loginUser(request);
//        call.enqueue(callback);
//    }
//
//    // עדכון שם משתמש
//    public static void updateUserName(String userId, String firstName, String lastName, Callback<Void> callback) {
//        UserApi userApi = ApiClient.getClient(BASE_URL).create(UserApi.class);
//        UpdateNameRequest request = new UpdateNameRequest(userId, firstName, lastName);
//        Call<Void> call = userApi.updateUserName(request);
//        call.enqueue(callback);
//    }
//}


package com.analytics.analyticstracker;

import android.util.Log;

import androidx.annotation.NonNull;

import com.analytics.analyticstracker.api.ApiClient;
import com.analytics.analyticstracker.api.TrackerApi;
import com.analytics.analyticstracker.api.UserApi;
import com.analytics.analyticstracker.model.ActionEvent;
import com.analytics.analyticstracker.model.AuthResponse;
import com.analytics.analyticstracker.model.LoginRequest;
import com.analytics.analyticstracker.model.UpdateNameRequest;
import com.analytics.analyticstracker.model.User;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AnalyticsTracker {

    private static String BASE_URL = "https://7782-62-219-65-138.ngrok-free.app"; // Default base URL

    private static String currentScreen = null;
    private static long screenEnterTime = 0;

    // אתחול כתובת ה-API
    public static void init(String baseUrl) {
        BASE_URL = baseUrl;
    }

    // שליחת פעולה (event) לשרת
    public static void trackEvent(String userId, String actionName, Map<String, Object> properties) {
        String timestamp = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault()).format(new Date());

        ActionEvent event = new ActionEvent(userId, actionName, timestamp, properties);
        TrackerApi api = ApiClient.getClient(BASE_URL).create(TrackerApi.class);

        Call<Void> call = api.sendEvent(event);
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                Log.d("AnalyticsTracker", "Event sent successfully: " + actionName);
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                Log.e("AnalyticsTracker", "Failed to send event: " + t.getMessage());
            }
        });
    }

    // מדידת זמן שהייה במסך – התחלה
    public static void startScreen(String screenName) {
        // איפוס קודם, גם אם שכחנו לסיים מסך קודם
        currentScreen = screenName;
        screenEnterTime = System.currentTimeMillis();
        Log.d("AnalyticsTracker", "Started tracking screen: " + screenName);
    }

    // מדידת זמן שהייה במסך – סיום ושליחה לשרת
    public static void endScreen(String userId) {
        if (currentScreen == null || screenEnterTime == 0) {
            Log.w("AnalyticsTracker", "endScreen called but no active screen.");
            return;
        }

        long durationMillis = System.currentTimeMillis() - screenEnterTime;
        long durationSeconds = durationMillis / 1000;

        Map<String, Object> props = new HashMap<>();
        props.put("screen", currentScreen);
        props.put("durationSeconds", durationSeconds);

        trackEvent(userId, "screen_duration", props);

        // איפוס
        Log.d("AnalyticsTracker", "Ended tracking screen: " + currentScreen + " | Duration: " + durationSeconds + " seconds");
        currentScreen = null;
        screenEnterTime = 0;
    }

    // רישום משתמש
    public static void signupUser(User user, Callback<Void> callback) {
        UserApi userApi = ApiClient.getClient(BASE_URL).create(UserApi.class);
        Call<Void> call = userApi.registerUser(user);
        call.enqueue(callback);
    }

    // התחברות משתמש
    public static void loginUser(LoginRequest request, Callback<AuthResponse> callback) {
        UserApi userApi = ApiClient.getClient(BASE_URL).create(UserApi.class);
        Call<AuthResponse> call = userApi.loginUser(request);
        call.enqueue(callback);
    }

    // עדכון שם משתמש
    public static void updateUserName(String userId, String firstName, String lastName, Callback<Void> callback) {
        UserApi userApi = ApiClient.getClient(BASE_URL).create(UserApi.class);
        UpdateNameRequest request = new UpdateNameRequest(userId, firstName, lastName);
        Call<Void> call = userApi.updateUserName(request);
        call.enqueue(callback);
    }
}
