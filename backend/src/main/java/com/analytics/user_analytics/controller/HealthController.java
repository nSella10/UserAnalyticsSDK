package com.analytics.user_analytics.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Health Check Controller for Railway deployment
 * Railway checks /health endpoint to verify the service is running
 */
@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("service", "User Analytics Backend");
        response.put("version", "1.0.0");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User Analytics API is running");
        response.put("status", "OK");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("endpoints", new String[]{
            "/health - Health check",
            "/api/auth/register - User registration", 
            "/api/auth/login - User login",
            "/api/track - Track user actions",
            "/api/screen-time - Track screen time"
        });
        
        return ResponseEntity.ok(response);
    }
}
