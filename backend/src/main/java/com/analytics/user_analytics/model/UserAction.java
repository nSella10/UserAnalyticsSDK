package com.analytics.user_analytics.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "user_actions")
public class UserAction {
    @Id
    private String id;

    private String userId;
    private String actionName;

    @Field("timestamp")
    private LocalDateTime timestamp;

    private String sessionId; // מזהה סשן (אופציונלי)
    private Map<String, Object> properties;

    //constructor
    public UserAction() {
    }

    public UserAction(String userId, String actionName, LocalDateTime timestamp, Map<String, Object> properties) {
        this.userId = userId;
        this.actionName = actionName;
        this.timestamp = timestamp;
        this.properties = properties;
    }

    public UserAction(String userId, String actionName, LocalDateTime timestamp, String sessionId, Map<String, Object> properties) {
        this.userId = userId;
        this.actionName = actionName;
        this.timestamp = timestamp;
        this.sessionId = sessionId;
        this.properties = properties;
    }

    //Getter & Setter

    public String getId() {
        return id;
    }



    public String getActionName() {
        return actionName;
    }

    public void setActionName(String actionName) {
        this.actionName = actionName;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Object> properties) {
        this.properties = properties;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    @Override
    public String toString() {
        return "UserAction{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", actionName='" + actionName + '\'' +
                ", timestamp=" + timestamp +
                ", sessionId='" + sessionId + '\'' +
                ", properties=" + properties +
                '}';
    }
}
