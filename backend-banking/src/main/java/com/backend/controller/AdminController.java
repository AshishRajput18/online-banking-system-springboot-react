package com.backend.controller;

import com.backend.dto.BankManagerRequest;
import com.backend.service.AdminService;
import com.backend.config.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;
    private final JwtUtil jwtUtil;

    public AdminController(AdminService adminService, JwtUtil jwtUtil) {
        this.adminService = adminService;
        this.jwtUtil = jwtUtil;
    }

    // ✅ Register Bank Manager
    @PostMapping("/bank-manager/register")
    public ResponseEntity<?> registerBankManager(
            @RequestBody BankManagerRequest request,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Missing or invalid Authorization header"));
        }

        // ✅ Extract token and admin email
        String token = authHeader.substring(7);
        if (!jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Token expired or invalid"));
        }

        String adminEmail = jwtUtil.extractUsername(token);

        // ✅ Register Bank Manager with admin automatically linked
        adminService.registerBankManager(request, adminEmail);

        return ResponseEntity.ok(Map.of("message", "Bank Manager registered successfully with role BANK"));
    }

  
}
