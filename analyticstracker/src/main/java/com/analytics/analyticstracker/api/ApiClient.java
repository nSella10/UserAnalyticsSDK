package com.analytics.analyticstracker.api;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiClient {
    private static Retrofit retrofit = null;
    private static String currentBaseUrl = null;

    public static Retrofit getClient(String baseUrl) {
        // אם ה-URL השתנה או שזה הפעם הראשונה, צור Retrofit חדש
        if (retrofit == null || !baseUrl.equals(currentBaseUrl)) {
            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);

            OkHttpClient client = new OkHttpClient.Builder()
                    .addInterceptor(logging)
                    .build();

            retrofit = new Retrofit.Builder()
                    .baseUrl(baseUrl)
                    .client(client)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

            currentBaseUrl = baseUrl;
            android.util.Log.d("ApiClient", "🔗 Created new Retrofit client for: " + baseUrl);
        }

        return retrofit;
    }

    public static void reset() {
        retrofit = null;
    }
}
