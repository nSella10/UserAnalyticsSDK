package com.analytics.analyticsfinal;

import android.os.Bundle;
import com.analytics.analyticstracker.AnalyticsTracker;


import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

import java.util.HashMap;
import java.util.Map;


public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        AnalyticsTracker.init("http://192.168.1.152:8080");

        Map<String, Object> props = new HashMap<>();
        props.put("screen", "main");
        props.put("buttonId", "btn-login");

        // שלח אירוע לדוגמה
        AnalyticsTracker.trackEvent("user_456", "login", props);

    }
}