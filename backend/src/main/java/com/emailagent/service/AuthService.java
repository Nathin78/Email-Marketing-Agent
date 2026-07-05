package com.emailagent.service;

import com.emailagent.dto.AuthResponse;
import com.emailagent.dto.LoginRequest;
import com.emailagent.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
