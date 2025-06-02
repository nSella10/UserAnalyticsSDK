package com.analytics.user_analytics.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "apps")
public class App {
    
    @Id
    private String id;
    
    private String appName;
    
    @Indexed(unique = true)
    private String apiKey;
    
    private String developerId; // קישור למפתח
    
    private String description;
    
    private LocalDateTime createdAt;
    
    private boolean isActive;
    
    // Default constructor
    public App() {
        this.createdAt = LocalDateTime.now();
        this.isActive = true;
    }
    
    // Constructor
    public App(String appName, String apiKey, String developerId) {
        this();
        this.appName = appName;
        this.apiKey = apiKey;
        this.developerId = developerId;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getAppName() {
        return appName;
    }
    
    public void setAppName(String appName) {
        this.appName = appName;
    }
    
    public String getApiKey() {
        return apiKey;
    }
    
    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
    
    public String getDeveloperId() {
        return developerId;
    }
    
    public void setDeveloperId(String developerId) {
        this.developerId = developerId;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
}
