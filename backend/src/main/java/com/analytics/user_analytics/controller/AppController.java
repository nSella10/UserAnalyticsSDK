package com.analytics.user_analytics.controller;

import com.analytics.user_analytics.model.App;
import com.analytics.user_analytics.model.Developer;
import com.analytics.user_analytics.service.AppService;
import com.analytics.user_analytics.service.DeveloperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"})
@RestController
@RequestMapping("/apps")
public class AppController {
    
    @Autowired
    private AppService appService;
    
    @Autowired
    private DeveloperService developerService;
    
    /**
     * יצירת אפליקציה חדשה
     */
    @PostMapping("/create")
    public ResponseEntity<?> createApp(@RequestBody CreateAppRequest request) {
        try {
            System.out.println("🔧 Creating new app: " + request.getAppName());

            // בדיקת קיום המפתח לפי ID במקום API Key
            Developer developer = developerService.findByEmail(request.getDeveloperEmail());
            if (developer == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid developer"));
            }
            
            // יצירת האפליקציה
            App app = appService.createApp(
                request.getAppName(),
                developer.getId(),
                request.getDescription()
            );
            
            System.out.println("✅ App created successfully: " + app.getApiKey());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "app", app,
                "message", "App created successfully"
            ));
            
        } catch (Exception e) {
            System.out.println("💥 Error creating app: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * קבלת כל האפליקציות של מפתח
     */
    @GetMapping("/my-apps")
    public ResponseEntity<?> getMyApps(@RequestParam String developerEmail) {
        try {
            // בדיקת קיום המפתח
            Developer developer = developerService.findByEmail(developerEmail);
            if (developer == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid developer"));
            }
            
            // קבלת האפליקציות
            List<App> apps = appService.getAppsByDeveloper(developer.getId());
            
            return ResponseEntity.ok(apps);
            
        } catch (Exception e) {
            System.out.println("💥 Error getting apps: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Server error"));
        }
    }
    
    /**
     * עדכון אפליקציה
     */
    @PutMapping("/{appId}")
    public ResponseEntity<?> updateApp(
            @PathVariable String appId,
            @RequestBody UpdateAppRequest request) {
        try {
            App app = appService.updateApp(appId, request.getAppName(), request.getDescription());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "app", app,
                "message", "App updated successfully"
            ));
            
        } catch (Exception e) {
            System.out.println("💥 Error updating app: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * מחיקת אפליקציה
     */
    @DeleteMapping("/{appId}")
    public ResponseEntity<?> deleteApp(@PathVariable String appId) {
        try {
            appService.deleteApp(appId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "App deleted successfully"
            ));
            
        } catch (Exception e) {
            System.out.println("💥 Error deleting app: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // DTOs
    public static class CreateAppRequest {
        private String appName;
        private String description;
        private String developerEmail;

        // Getters and Setters
        public String getAppName() { return appName; }
        public void setAppName(String appName) { this.appName = appName; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getDeveloperEmail() { return developerEmail; }
        public void setDeveloperEmail(String developerEmail) { this.developerEmail = developerEmail; }
    }
    
    public static class UpdateAppRequest {
        private String appName;
        private String description;
        
        // Getters and Setters
        public String getAppName() { return appName; }
        public void setAppName(String appName) { this.appName = appName; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}
