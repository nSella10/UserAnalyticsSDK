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
//import com.analytics.analyticstracker.model.LoginRequest;
//import com.analytics.analyticstracker.model.User;
//
//import java.text.SimpleDateFormat;
//import java.util.Date;
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
//    public static void init(String baseUrl) {
//        BASE_URL = baseUrl;
//    }
//
//    public static void trackEvent(String userId, String actionName, Map<String, Object> properties) {
//        String timestamp = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault()).format(new Date());
//
//        ActionEvent event = new ActionEvent(userId, actionName, timestamp, properties);
//
//        TrackerApi api = ApiClient.getClient(BASE_URL).create(TrackerApi.class);
//
//        Call<Void> call = api.sendEvent(event);
//
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
//    public static void signupUser(User user, Callback<Void> callback) {
//        UserApi userApi = ApiClient.getClient(BASE_URL).create(UserApi.class);
//        Call<Void> call = userApi.registerUser(user);
//        call.enqueue(callback);
//    }
//
//    public static void loginUser(String email, String password, Callback<AuthResponse> callback) {
//        UserApi userApi = ApiClient.getClient(BASE_URL).create(UserApi.class);
//        LoginRequest request = new LoginRequest(email, password);
//        Call<AuthResponse> call = userApi.loginUser(request);
//        call.enqueue(callback);
//    }
//
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
import com.analytics.analyticstracker.model.User;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AnalyticsTracker {

    private static String BASE_URL = "http://192.168.7.7:8080/"; // Default base URL

    public static void init(String baseUrl) {
        BASE_URL = baseUrl;
    }

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

    public static void signupUser(User user, Callback<Void> callback) {
        UserApi userApi = ApiClient.getClient(BASE_URL).create(UserApi.class);
        Call<Void> call = userApi.registerUser(user);
        call.enqueue(callback);
    }

    public static void loginUser(LoginRequest request, Callback<AuthResponse> callback) {
        UserApi userApi = ApiClient.getClient(BASE_URL).create(UserApi.class);
        Call<AuthResponse> call = userApi.loginUser(request);
        call.enqueue(callback);
    }

}
