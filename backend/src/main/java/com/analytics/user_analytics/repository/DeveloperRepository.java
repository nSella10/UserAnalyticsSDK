package com.analytics.user_analytics.repository;

import com.analytics.user_analytics.model.Developer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DeveloperRepository extends MongoRepository<Developer, String> {
    
    // מציאת מפתח לפי אימייל
    Developer findByEmail(String email);
    
    // בדיקה אם אימייל קיים
    boolean existsByEmail(String email);

    // הסרנו findByApiKey ו-existsByApiKey כי עכשיו API Key קשור לאפליקציה
    
    // מציאת מפתחים פעילים
    java.util.List<Developer> findByIsActiveTrue();
    
    // מציאת מפתח לפי חברה
    java.util.List<Developer> findByCompanyName(String companyName);
}
