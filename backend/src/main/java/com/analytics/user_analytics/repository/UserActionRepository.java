 package com.analytics.user_analytics.repository;


import com.analytics.user_analytics.model.UserAction;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserActionRepository extends MongoRepository<UserAction, String> {

    // מציאת פעולות לפי API Key של האפליקציה
    java.util.List<UserAction> findByApiKey(String apiKey);

    // מציאת פעולות לפי משתמש ו-API Key
    java.util.List<UserAction> findByUserIdAndApiKey(String userId, String apiKey);

    // מציאת פעולות לפי API Key ושם פעולה
    java.util.List<UserAction> findByApiKeyAndActionName(String apiKey, String actionName);

}