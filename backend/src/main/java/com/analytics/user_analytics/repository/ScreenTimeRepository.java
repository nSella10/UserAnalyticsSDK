package com.analytics.user_analytics.repository;

import com.analytics.user_analytics.model.ScreenTime;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScreenTimeRepository extends MongoRepository<ScreenTime, String> {
    
    // מציאת זמני מסך לפי משתמש
    List<ScreenTime> findByUserId(String userId);
    
    // מציאת זמני מסך לפי משתמש ומסך
    List<ScreenTime> findByUserIdAndScreenName(String userId, String screenName);
    
    // מציאת זמני מסך לפי טווח זמנים
    List<ScreenTime> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    
    // מציאת זמני מסך לפי משתמש וטווח זמנים
    List<ScreenTime> findByUserIdAndTimestampBetween(String userId, LocalDateTime start, LocalDateTime end);
    
    // מציאת זמני מסך לפי סשן
    List<ScreenTime> findBySessionId(String sessionId);
    
    // סכום זמני מסך לפי משתמש
    @Query("{ 'userId': ?0 }")
    List<ScreenTime> findAllByUserId(String userId);
    
    // מציאת זמני מסך ארוכים (מעל X מילישניות)
    List<ScreenTime> findByDurationGreaterThan(long minDuration);
    
    // מציאת זמני מסך לפי משתמש ומסך בטווח זמנים
    List<ScreenTime> findByUserIdAndScreenNameAndTimestampBetween(
        String userId, String screenName, LocalDateTime start, LocalDateTime end);

    // מציאת זמני מסך לפי API Key של האפליקציה
    List<ScreenTime> findByApiKey(String apiKey);

    // מציאת זמני מסך לפי משתמש ו-API Key
    List<ScreenTime> findByUserIdAndApiKey(String userId, String apiKey);

    // מציאת זמני מסך לפי API Key וטווח זמנים
    List<ScreenTime> findByApiKeyAndTimestampBetween(String apiKey, LocalDateTime start, LocalDateTime end);
}
