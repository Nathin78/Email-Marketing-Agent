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

import com.emailagent.dto.ForgotPasswordRequest;
import com.emailagent.dto.ResetPasswordRequest;

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

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset code")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Reset code generated").build());
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using verification code")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Password reset successful").build());
    }
}
