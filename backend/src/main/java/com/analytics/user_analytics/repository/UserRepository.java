package com.analytics.user_analytics.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.analytics.user_analytics.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    User findByEmail(String email);

    // מציאת משתמשים לפי API Key של האפליקציה
    java.util.List<User> findByApiKey(String apiKey);

}
