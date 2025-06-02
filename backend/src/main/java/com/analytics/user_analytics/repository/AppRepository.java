package com.analytics.user_analytics.repository;

import com.analytics.user_analytics.model.App;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppRepository extends MongoRepository<App, String> {
    
    // מציאת אפליקציות לפי מפתח
    List<App> findByDeveloperId(String developerId);
    
    // מציאת אפליקציה לפי API Key
    App findByApiKey(String apiKey);
    
    // מציאת אפליקציות פעילות לפי מפתח
    List<App> findByDeveloperIdAndIsActiveTrue(String developerId);
    
    // בדיקה אם API Key קיים
    boolean existsByApiKey(String apiKey);
    
    // מציאת אפליקציה לפי שם ומפתח
    App findByAppNameAndDeveloperId(String appName, String developerId);
    
    // בדיקה אם שם אפליקציה קיים אצל מפתח
    boolean existsByAppNameAndDeveloperId(String appName, String developerId);
}
