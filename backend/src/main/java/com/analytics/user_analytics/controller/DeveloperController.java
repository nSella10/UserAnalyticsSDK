package com.analytics.user_analytics.controller;

import com.analytics.user_analytics.dto.DeveloperAuthResponse;
import com.analytics.user_analytics.dto.DeveloperLoginRequest;
import com.analytics.user_analytics.dto.DeveloperRegisterRequest;
import com.analytics.user_analytics.model.Developer;
import com.analytics.user_analytics.security.JwtUtil;
import com.analytics.user_analytics.service.DeveloperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "${CORS_ORIGINS:*}"})
@RestController
@RequestMapping("/developers")
public class DeveloperController {

    @Autowired
    private DeveloperService developerService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * רישום מפתח חדש
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerDeveloper(@RequestBody DeveloperRegisterRequest request) {
        try {
            System.out.println("🔧 Developer registration attempt: " + request.getEmail());

            Developer developer = developerService.registerDeveloper(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPassword(),
                request.getCompanyName()
            );

            System.out.println("✅ Developer registered successfully: " + developer.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Developer registered successfully");
            response.put("developer", developer);
            response.put("developerId", developer.getId());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            System.out.println("❌ Registration failed: " + e.getMessage());
            
            if (e.getMessage().equals("Email already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already exists"));
            }
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
                
        } catch (Exception e) {
            System.out.println("💥 Server error during registration: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Server error"));
        }
    }

    /**
     * התחברות מפתח
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginDeveloper(@RequestBody DeveloperLoginRequest request) {
        try {
            System.out.println("🔧 Developer login attempt: " + request.getEmail());

            Developer developer = developerService.authenticateDeveloper(
                request.getEmail(), 
                request.getPassword()
            );

            // יצירת JWT token
            String token = jwtUtil.generateToken(developer.getEmail());

            System.out.println("✅ Developer login successful: " + developer.getEmail());

            DeveloperAuthResponse response = new DeveloperAuthResponse(token, developer);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            System.out.println("❌ Login failed: " + e.getMessage());
            
            if (e.getMessage().equals("Developer not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Developer not found"));
            } else if (e.getMessage().equals("Invalid password")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid password"));
            } else if (e.getMessage().equals("Developer account is inactive")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Account is inactive"));
            }
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
                
        } catch (Exception e) {
            System.out.println("💥 Server error during login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Server error"));
        }
    }

    // הסרנו profile ו-regenerate-api-key כי עכשיו API Key מנוהל ברמת האפליקציה
}
