package com.shikahotel.controller;

import com.shikahotel.dto.LoginRequest;
import com.shikahotel.model.User;
import com.shikahotel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Enables Vite React frontend connection
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private static final String REQUIRED_PASSWORD = "Shika@hotel0309";

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request) {
        Map<String, String> response = new HashMap<>();

        // 1. Password Check Rule
        if (!REQUIRED_PASSWORD.equals(request.getPassword())) {
            response.put("message", "Enter the correct password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // 2. Save or Register User in Database
        User user = new User(
            request.getUserId(),
            request.getPassword(),
            request.getRole(),
            request.getDepartment() != null ? request.getDepartment() : "Management"
        );
        userRepository.save(user);

        // 3. Grant Access Response
        String grantMessage = request.getRole().equalsIgnoreCase("MANAGER") 
            ? "Manager Access Granted!" 
            : "Staff Access Granted!";

        response.put("message", grantMessage);
        response.put("status", "SUCCESS");
        return ResponseEntity.ok(response);
    }
}