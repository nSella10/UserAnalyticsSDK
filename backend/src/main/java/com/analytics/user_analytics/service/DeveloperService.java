package com.analytics.user_analytics.service;

import com.analytics.user_analytics.model.Developer;
import com.analytics.user_analytics.repository.DeveloperRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DeveloperService {

    @Autowired
    private DeveloperRepository developerRepository;

    // הסרנו קבועי API Key כי עכשיו API Key מנוהל ברמת האפליקציה

    // הסרנו generateRandomString כי לא בשימוש יותר

    /**
     * רישום מפתח חדש
     */
    public Developer registerDeveloper(String firstName, String lastName, String email,
                                     String password, String companyName) {
        // בדיקה אם האימייל כבר קיים
        if (developerRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        // יצירת מפתח חדש (ללא API Key - יווצר עבור כל אפליקציה)
        Developer developer = new Developer(firstName, lastName, email, password, companyName);

        return developerRepository.save(developer);
    }

    /**
     * התחברות מפתח
     */
    public Developer authenticateDeveloper(String email, String password) {
        Developer developer = developerRepository.findByEmail(email);
        
        if (developer == null) {
            throw new RuntimeException("Developer not found");
        }

        if (!developer.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        if (!developer.isActive()) {
            throw new RuntimeException("Developer account is inactive");
        }

        // עדכון זמן התחברות אחרון
        developer.setLastLoginAt(LocalDateTime.now());
        developerRepository.save(developer);

        return developer;
    }

    // הסרנו findByApiKey כי עכשיו API Key קשור לאפליקציה ולא למפתח

    /**
     * מציאת מפתח לפי אימייל
     */
    public Developer findByEmail(String email) {
        return developerRepository.findByEmail(email);
    }

    /**
     * עדכון פרטי מפתח
     */
    public Developer updateDeveloper(Developer developer) {
        return developerRepository.save(developer);
    }

    /**
     * השבתת מפתח
     */
    public void deactivateDeveloper(String developerId) {
        Developer developer = developerRepository.findById(developerId)
                .orElseThrow(() -> new RuntimeException("Developer not found"));
        
        developer.setActive(false);
        developerRepository.save(developer);
    }

    // הסרנו regenerateApiKey כי עכשיו API Key מנוהל ברמת האפליקציה
}
