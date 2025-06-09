package com.analytics.user_analytics.security;

import com.analytics.user_analytics.model.App;
import com.analytics.user_analytics.model.Developer;
import com.analytics.user_analytics.service.AppService;
import com.analytics.user_analytics.service.DeveloperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Filter לבדיקת בעלות על API Key
 * מוודא שהמפתח שמחובר הוא הבעלים של ה-API Key שהוא משתמש בו
 */
@Component
public class ApiKeyAuthFilter extends OncePerRequestFilter {

    @Autowired
    private AppService appService;
    
    @Autowired
    private DeveloperService developerService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String path = request.getRequestURI();
        
        // בדיקה רק עבור endpoints שמשתמשים ב-API Key
        if (requiresApiKeyValidation(path)) {
            String apiKey = extractApiKey(request);
            String authHeader = request.getHeader("Authorization");
            
            if (apiKey != null && authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                
                if (jwtUtil.validateToken(token)) {
                    String developerEmail = jwtUtil.extractEmail(token);
                    Developer developer = developerService.findByEmail(developerEmail);
                    
                    if (developer != null) {
                        // בדיקה שה-API Key שייך למפתח
                        App app = appService.findByApiKey(apiKey);
                        
                        if (app == null || !app.getDeveloperId().equals(developer.getId())) {
                            System.out.println("🚨 SECURITY VIOLATION: Developer " + developer.getEmail() + 
                                             " tried to access API Key " + apiKey + " that doesn't belong to them!");
                            
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\":\"Access denied: API Key does not belong to authenticated developer\"}");
                            return;
                        }
                        
                        System.out.println("✅ API Key validation passed for developer: " + developer.getEmail());
                        request.setAttribute("developer", developer);
                        request.setAttribute("app", app);
                    }
                }
            }
        }
        
        filterChain.doFilter(request, response);
    }
    
    /**
     * בדיקה אם ה-endpoint דורש בדיקת API Key
     */
    private boolean requiresApiKeyValidation(String path) {
        return path.startsWith("/track/stats/") || 
               path.startsWith("/screen-time/") ||
               path.contains("apiKey=");
    }
    
    /**
     * חילוץ API Key מהבקשה
     */
    private String extractApiKey(HttpServletRequest request) {
        // מהפרמטרים
        String apiKey = request.getParameter("apiKey");
        if (apiKey != null) {
            return apiKey;
        }
        
        // מה-headers
        apiKey = request.getHeader("X-API-Key");
        if (apiKey != null) {
            return apiKey;
        }
        
        return null;
    }
}
