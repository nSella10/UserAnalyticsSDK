package com.analytics.user_analytics.dto;

public class DeveloperLoginRequest {
    private String email;
    private String password;

    // Default constructor
    public DeveloperLoginRequest() {}

    // Constructor
    public DeveloperLoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "DeveloperLoginRequest{" +
                "email='" + email + '\'' +
                '}';
    }
}
