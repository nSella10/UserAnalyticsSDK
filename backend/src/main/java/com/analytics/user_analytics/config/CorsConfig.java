package com.analytics.user_analytics.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "https://d1xb34m3k0zeus.cloudfront.net","http://localhost:3000"
                        ) 
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(true);

            }
        };
    }

}
