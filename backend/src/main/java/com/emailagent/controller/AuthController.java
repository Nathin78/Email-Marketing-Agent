package com.emailagent.controller;

import com.emailagent.dto.ApiResponse;
import com.emailagent.dto.AuthResponse;
import com.emailagent.dto.LoginRequest;
import com.emailagent.dto.RegisterRequest;
import com.emailagent.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder().success(true).message("Registration successful").data(authService.register(request)).build());
    }

    @PostMapping("/login")
    @Operation(summary = "Login a user")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder().success(true).message("Login successful").data(authService.login(request)).build());
    }
}
