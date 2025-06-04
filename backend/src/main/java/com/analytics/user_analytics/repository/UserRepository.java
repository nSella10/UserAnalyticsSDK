package com.analytics.user_analytics.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

import com.analytics.user_analytics.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    User findByEmail(String email);

    // מציאת משתמשים לפי API Key
    List<User> findByApiKey(String apiKey);

    // מציאת משתמשים לפי App ID
    List<User> findByAppId(String appId);

}
