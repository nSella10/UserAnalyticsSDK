package com.analytics.analyticstracker.model;

public class ScreenTime {
    private String userId;
    private String screenName;
    private long duration; // במילישניות
    private String startTime;
    private String endTime;
    private String sessionId; // מזהה סשן (אופציונלי)
    private String apiKey; // API Key של האפליקציה

    // Constructors
    public ScreenTime() {
    }

    public ScreenTime(String userId, String screenName, long duration, String startTime, String endTime) {
        this.userId = userId;
        this.screenName = screenName;
        this.duration = duration;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public ScreenTime(String userId, String screenName, long duration, String startTime, String endTime,
            String sessionId) {
        this.userId = userId;
        this.screenName = screenName;
        this.duration = duration;
        this.startTime = startTime;
        this.endTime = endTime;
        this.sessionId = sessionId;
    }

    public ScreenTime(String userId, String screenName, long duration, String startTime, String endTime,
            String sessionId, String apiKey) {
        this.userId = userId;
        this.screenName = screenName;
        this.duration = duration;
        this.startTime = startTime;
        this.endTime = endTime;
        this.sessionId = sessionId;
        this.apiKey = apiKey;
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getScreenName() {
        return screenName;
    }

    public void setScreenName(String screenName) {
        this.screenName = screenName;
    }

    public long getDuration() {
        return duration;
    }

    public void setDuration(long duration) {
        this.duration = duration;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    @Override
    public String toString() {
        return "ScreenTime{" +
                "userId='" + userId + '\'' +
                ", screenName='" + screenName + '\'' +
                ", duration=" + duration +
                ", startTime='" + startTime + '\'' +
                ", endTime='" + endTime + '\'' +
                ", sessionId='" + sessionId + '\'' +
                '}';
    }
}
