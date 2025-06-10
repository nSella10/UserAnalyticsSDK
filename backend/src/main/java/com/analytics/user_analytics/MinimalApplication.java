package com.analytics.user_analytics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication(exclude = {
    MongoAutoConfiguration.class,
    MongoDataAutoConfiguration.class,
    MongoRepositoriesAutoConfiguration.class
})
@RestController
public class MinimalApplication {

    public static void main(String[] args) {
        System.out.println("🚀 Starting MINIMAL User Analytics Application...");
        System.out.println("📊 Environment Variables:");
        System.out.println("   PORT: " + System.getenv("PORT"));
        
        try {
            System.out.println("🔄 Calling SpringApplication.run()...");
            SpringApplication.run(MinimalApplication.class, args);
            System.out.println("✅ SpringApplication.run() completed successfully!");
        } catch (Exception e) {
            System.err.println("❌ SpringApplication.run() failed: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
        System.out.println("✅ MINIMAL Application started successfully!");
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        System.out.println("🌐 Root endpoint called - MINIMAL server is working!");
        Map<String, Object> response = new HashMap<>();
        response.put("message", "MINIMAL User Analytics API is running");
        response.put("status", "OK");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("version", "1.0.0-minimal");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        System.out.println("🏥 Health endpoint called - MINIMAL server is responding!");
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("service", "MINIMAL User Analytics Backend");
        response.put("version", "1.0.0-minimal");
        System.out.println("✅ Health check successful - returning UP status");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        System.out.println("🧪 Test endpoint called on MINIMAL server");
        Map<String, Object> response = new HashMap<>();
        response.put("message", "MINIMAL Test endpoint working");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("server", "Railway-Minimal");
        
        return ResponseEntity.ok(response);
    }
}
