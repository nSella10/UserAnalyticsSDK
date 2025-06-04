package com.analytics.user_analytics.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;


@Document(collection = "users")
public class User {

    public enum Gender { MALE, FEMALE, OTHER }

    @Id
    private String id;
    private String firstName;
    private String lastName;
    // Email is unique for each user
    @Indexed(unique = true)
    private String email;
    private String password;
    private int age;
    private Gender gender;
    private LocalDateTime registerAt;
    private String apiKey; // API Key של המפתח שיצר את המשתמש
    private String appId; // ID של האפליקציה שהמשתמש שייך אליה

    // Default constructor
    public User() {}

    // Full constructor
    public User(String id, String firstName, String lastName, String email, String password, int age, Gender gender, LocalDateTime registerAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.age = age;
        this.gender = gender;
        this.registerAt = registerAt;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }

    public LocalDateTime getRegisterAt() { return registerAt; }
    public void setRegisterAt(LocalDateTime registerAt) { this.registerAt = registerAt; }

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }

    public String getAppId() { return appId; }
    public void setAppId(String appId) { this.appId = appId; }
}
