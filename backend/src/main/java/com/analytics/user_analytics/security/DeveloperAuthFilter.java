package com.analytics.user_analytics.security;

import com.analytics.user_analytics.model.Developer;
import com.analytics.user_analytics.service.DeveloperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class DeveloperAuthFilter extends OncePerRequestFilter {

    @Autowired
    private DeveloperService developerService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // זמנית - נדלג על בדיקת API Key עבור endpoints מסוימים
        if (path.startsWith("/track/") || path.startsWith("/screen-time/")) {
            // TODO: הוסף בדיקת API Key כאן
            Developer tempDeveloper = new Developer();
            tempDeveloper.setId("temp_developer");
            request.setAttribute("developer", tempDeveloper);
        }

        // עבור endpoints אחרים, זמנית נדלג על בדיקת API Key
        else if (path.startsWith("/api/") && !path.contains("/developers/login")
                && !path.contains("/developers/register")) {
            // TODO: הוסף בדיקת API Key כאן
            Developer tempDeveloper = new Developer();
            tempDeveloper.setId("temp_developer");
            request.setAttribute("developer", tempDeveloper);
        }

        filterChain.doFilter(request, response);
    }
}
