package com.analytics.analyticstracker.model;

import java.util.Map;

public class ActionEvent {

    private String userId;
    private String actionName;

    private String timestamp;

    private Map<String, Object> properties;
    private String apiKey;

    // Constructor
    public ActionEvent() {
    }

    public ActionEvent(String userId, String actionName, String timestamp, Map<String, Object> properties) {
        this.userId = userId;
        this.actionName = actionName;
        this.timestamp = timestamp;
        this.properties = properties;
    }

    public ActionEvent(String userId, String actionName, String timestamp, Map<String, Object> properties,
            String apiKey) {
        this.userId = userId;
        this.actionName = actionName;
        this.timestamp = timestamp;
        this.properties = properties;
        this.apiKey = apiKey;
    }

    // Getters and Setters

    public String getActionName() {
        return actionName;
    }

    public void setActionName(String actionName) {
        this.actionName = actionName;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Object> properties) {
        this.properties = properties;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
}
