package com.analytics.user_analytics.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.analytics.user_analytics.dto.AuthResponse;
import com.analytics.user_analytics.dto.LoginRequest;
import com.analytics.user_analytics.model.User;
import com.analytics.user_analytics.repository.UserRepository;
import com.analytics.user_analytics.security.JwtUtil;
import com.analytics.user_analytics.dto.UpdateNameRequest;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;


import org.springframework.dao.DuplicateKeyException;


@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;


    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            User existingUser = userRepository.findByEmail(user.getEmail());
            if (existingUser != null) {
                System.out.println("⚠️ Email already exists: " + user.getEmail());
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
            }

            user.setRegisterAt(LocalDateTime.now());
            userRepository.save(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, user));
    }


    @PostMapping("/update-name")
    public ResponseEntity<?> updateUserName(@RequestBody UpdateNameRequest request) {
        System.out.println("📩 הגיעו נתונים לעדכון: " + request.getUserId());
        try {
            User user = userRepository.findById(request.getUserId()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            userRepository.save(user);

            return ResponseEntity.ok("User name updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update failed");
        }
    }





}
