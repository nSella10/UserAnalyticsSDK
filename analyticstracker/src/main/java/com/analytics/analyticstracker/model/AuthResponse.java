package com.analytics.analyticstracker.model;

import com.analytics.analyticstracker.model.User;

public class AuthResponse {
    private String token;
    private User user;

    public String getToken() {
        return token;
    }

    public User getUser() {
        return user;
    }
}