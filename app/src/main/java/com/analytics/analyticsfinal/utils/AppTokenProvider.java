package com.analytics.analyticsfinal.utils;

import android.content.Context;

import com.analytics.analyticstracker.api.TokenProvider;

public class AppTokenProvider implements TokenProvider {

    private final Context context;

    public AppTokenProvider(Context context) {
        this.context = context;
    }

    @Override
    public String getToken() {
        return TokenManager.getToken(context);
    }
}
