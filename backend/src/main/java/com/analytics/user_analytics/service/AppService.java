package com.analytics.user_analytics.service;

import com.analytics.user_analytics.model.App;
import com.analytics.user_analytics.repository.AppRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AppService {
    
    @Autowired
    private AppRepository appRepository;
    
    /**
     * יצירת אפליקציה חדשה
     */
    public App createApp(String appName, String developerId, String description) {
        // בדיקה אם שם האפליקציה כבר קיים אצל המפתח
        if (appRepository.existsByAppNameAndDeveloperId(appName, developerId)) {
            throw new RuntimeException("App name already exists for this developer");
        }
        
        // יצירת API Key ייחודי
        String apiKey = generateUniqueApiKey();
        
        // יצירת האפליקציה
        App app = new App(appName, apiKey, developerId);
        app.setDescription(description);
        
        return appRepository.save(app);
    }
    
    /**
     * קבלת כל האפליקציות של מפתח
     */
    public List<App> getAppsByDeveloper(String developerId) {
        return appRepository.findByDeveloperIdAndIsActiveTrue(developerId);
    }
    
    /**
     * קבלת אפליקציה לפי API Key
     */
    public App getAppByApiKey(String apiKey) {
        return appRepository.findByApiKey(apiKey);
    }
    
    /**
     * עדכון אפליקציה
     */
    public App updateApp(String appId, String appName, String description) {
        App app = appRepository.findById(appId).orElse(null);
        if (app == null) {
            throw new RuntimeException("App not found");
        }
        
        app.setAppName(appName);
        app.setDescription(description);
        
        return appRepository.save(app);
    }
    
    /**
     * מחיקת אפליקציה (סימון כלא פעילה)
     */
    public void deleteApp(String appId) {
        App app = appRepository.findById(appId).orElse(null);
        if (app != null) {
            app.setActive(false);
            appRepository.save(app);
        }
    }
    
    /**
     * יצירת API Key ייחודי
     */
    private String generateUniqueApiKey() {
        String apiKey;
        do {
            apiKey = "ak_" + UUID.randomUUID().toString().replace("-", "").substring(0, 24);
        } while (appRepository.existsByApiKey(apiKey));
        
        return apiKey;
    }
    
    /**
     * קבלת מספר משתמשים לפי אפליקציה
     */
    public long getUserCountByApp(String apiKey) {
        // כאן נוסיף לוגיקה לספירת משתמשים לפי API Key
        // זה יחייב עדכון של מודל User
        return 0; // זמני
    }
}
