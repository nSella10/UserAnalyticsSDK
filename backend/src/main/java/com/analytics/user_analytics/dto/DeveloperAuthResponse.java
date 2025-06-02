package com.analytics.user_analytics.dto;

import com.analytics.user_analytics.model.Developer;

public class DeveloperAuthResponse {
    private String token;
    private Developer developer;
    private String apiKey;

    // Default constructor
    public DeveloperAuthResponse() {}

    // Constructor
    public DeveloperAuthResponse(String token, Developer developer) {
        this.token = token;
        this.developer = developer;
        this.apiKey = null; // לא רלוונטי יותר - API Key ברמת האפליקציה
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Developer getDeveloper() {
        return developer;
    }

    public void setDeveloper(Developer developer) {
        this.developer = developer;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    @Override
    public String toString() {
        return "DeveloperAuthResponse{" +
                "token='" + token + '\'' +
                ", developer=" + developer +
                ", apiKey='" + apiKey + '\'' +
                '}';
    }
}
