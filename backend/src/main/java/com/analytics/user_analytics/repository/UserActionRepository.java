 package com.analytics.user_analytics.repository;


import com.analytics.user_analytics.model.UserAction;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserActionRepository extends MongoRepository<UserAction, String> {

}