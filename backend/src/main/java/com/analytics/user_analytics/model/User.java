package com.analytics.user_analytics.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document (collection = "users")
public class User {
    
    @Id
    private String id;
    private String userName; 
    private String email ;
    private String password;
    private LocalDateTime registerAt;

    //constructor
    public User() {
    }

    public User(String userName, String email, String password, LocalDateTime registerAt) {
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.registerAt = registerAt;
    }


    //Getter & Setter
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getRegisterAt() {
        return registerAt;
    }

    public void setRegisterAt(LocalDateTime registerAt) {
        this.registerAt = registerAt;
    }
    






}