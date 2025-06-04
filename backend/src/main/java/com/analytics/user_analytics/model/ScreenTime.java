package com.analytics.user_analytics.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "screen_times")
public class ScreenTime {
    @Id
    private String id;

    private String userId;
    private String screenName;

    @Field("startTime")
    private LocalDateTime startTime;

    @Field("endTime")
    private LocalDateTime endTime;

    @Field("timestamp")
    private LocalDateTime timestamp; // זמן יצירת הרשומה

    private long duration; // משך הזמן במילישניות
    private String sessionId; // מזהה סשן (אופציונלי)
    private String apiKey; // API Key של האפליקציה

    // קונסטרקטורים
    public ScreenTime() {
    }

    public ScreenTime(String userId, String screenName, LocalDateTime startTime, LocalDateTime endTime, long duration) {
        this.userId = userId;
        this.screenName = screenName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.duration = duration;
        this.timestamp = LocalDateTime.now();
    }

    public ScreenTime(String userId, String screenName, LocalDateTime startTime, LocalDateTime endTime, long duration,
            String sessionId) {
        this.userId = userId;
        this.screenName = screenName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.duration = duration;
        this.sessionId = sessionId;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public long getDuration() {
        return duration;
    }

    public void setDuration(long duration) {
        this.duration = duration;
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
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", screenName='" + screenName + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", timestamp=" + timestamp +
                ", duration=" + duration +
                ", sessionId='" + sessionId + '\'' +
                '}';
    }
}
