package com.emailagent.service;

import com.emailagent.dto.AuthResponse;
import com.emailagent.dto.LoginRequest;
import com.emailagent.dto.RegisterRequest;

import com.emailagent.dto.ForgotPasswordRequest;
import com.emailagent.dto.ResetPasswordRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}
