package com.analytics.user_analytics.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Simple Test Controller - No MongoDB dependencies
 */
@RestController
public class SimpleTestController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        System.out.println("🌐 Root endpoint called - server is working!");
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User Analytics API is running");
        response.put("status", "OK");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("version", "1.0.0-test");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        System.out.println("🏥 Health endpoint called - server is responding!");
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("service", "User Analytics Backend");
        response.put("version", "1.0.0-test");
        System.out.println("✅ Health check successful - returning UP status");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        System.out.println("🧪 Test endpoint called");
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Test endpoint working");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("server", "Railway");
        
        return ResponseEntity.ok(response);
    }
}
