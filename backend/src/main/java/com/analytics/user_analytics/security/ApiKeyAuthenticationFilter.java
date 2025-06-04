package com.analytics.user_analytics.security;

import com.analytics.user_analytics.model.App;
import com.analytics.user_analytics.model.Developer;
import com.analytics.user_analytics.service.AppService;
import com.analytics.user_analytics.service.DeveloperService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {

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
        String method = request.getMethod();

        // אפשר CORS preflight requests
        if ("OPTIONS".equals(method)) {
            response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // הוסף CORS headers לכל התגובות
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        // דלג על endpoints שלא צריכים אימות
        if (shouldSkipAuthentication(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        // בדיקת JWT token למפתחים
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("🔍 JWT Token received: " + token.substring(0, Math.min(20, token.length())) + "...");

            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.extractEmail(token);
                System.out.println("✅ JWT Token valid, email: " + email);
                Developer developer = developerService.findByEmail(email);

                if (developer != null) {
                    System.out.println("✅ Developer found: " + developer.getEmail());
                    // הוספת המפתח ל-request attributes
                    request.setAttribute("developer", developer);

                    // בדיקת API Key אם נדרש
                    String apiKey = request.getParameter("apiKey");
                    if (apiKey != null) {
                        App app = appService.findByApiKey(apiKey);
                        if (app == null || !app.getDeveloperId().equals(developer.getId())) {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter().write("{\"error\":\"Access denied to this app\"}");
                            return;
                        }
                        request.setAttribute("app", app);
                    }

                    filterChain.doFilter(request, response);
                    return;
                } else {
                    System.out.println("❌ Developer not found for email: " + email);
                }
            } else {
                System.out.println("❌ JWT Token invalid");
            }
        } else {
            System.out.println("❌ No Authorization header or invalid format");
        }

        // בדיקת API Key ישירה (לSDK)
        String apiKey = request.getParameter("apiKey");
        if (apiKey == null) {
            apiKey = request.getHeader("X-API-Key");
        }
        
        if (apiKey != null) {
            App app = appService.findByApiKey(apiKey);
            if (app != null && app.isActive()) {
                request.setAttribute("app", app);
                filterChain.doFilter(request, response);
                return;
            }
        }

        // אם הגענו לכאן, אין הרשאה
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("{\"error\":\"Authentication required\"}");
    }

    private boolean shouldSkipAuthentication(String path) {
        return path.startsWith("/developers/register") ||
               path.startsWith("/developers/login") ||
               path.startsWith("/users/register") ||
               path.startsWith("/users/login") ||
               path.startsWith("/h2-console") ||
               path.startsWith("/actuator") ||
               path.equals("/");
    }
}
