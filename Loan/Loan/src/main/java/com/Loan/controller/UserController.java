package com.Loan.controller;

import com.Loan.entity.User;
import com.Loan.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allow frontend access
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private com.Loan.security.JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<com.Loan.dto.AuthResponse> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        logger.info("Login request received for email: {}", email);
        
        try {
            User user = userService.authenticate(email, password);
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());
            logger.info("Login successful for email: {}. Token generated.", email);
            return ResponseEntity.ok(new com.Loan.dto.AuthResponse(token, user));
        } catch (RuntimeException e) {
            logger.error("Login failed for email: {} - Reason: {}", email, e.getMessage());
            throw e; // Rethrow to let global exception handler (if any) or Spring handle it
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getProfile(@PathVariable UUID id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
