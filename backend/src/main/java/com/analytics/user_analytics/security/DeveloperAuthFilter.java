package com.analytics.user_analytics.security;

// import com.analytics.user_analytics.service.DeveloperService;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class DeveloperAuthFilter extends OncePerRequestFilter {

    // @Autowired
    // private DeveloperService developerService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // This filter is currently disabled - all authentication is handled by
        // ApiKeyAuthFilter
        // Simply pass through all requests without any processing
        filterChain.doFilter(request, response);
    }
}
