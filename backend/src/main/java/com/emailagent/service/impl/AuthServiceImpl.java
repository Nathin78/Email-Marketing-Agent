package com.emailagent.service.impl;

import com.emailagent.dto.AuthResponse;
import com.emailagent.dto.LoginRequest;
import com.emailagent.dto.RegisterRequest;
import com.emailagent.entity.LoginHistory;
import com.emailagent.entity.User;
import com.emailagent.repository.LoginHistoryRepository;
import com.emailagent.repository.UserRepository;
import com.emailagent.security.JwtService;
import com.emailagent.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final LoginHistoryRepository loginHistoryRepository;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();

        userRepository.save(user);
        String token = jwtService.generateToken(org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole())
                .build());

        return AuthResponse.builder().token(token).role(user.getRole()).name(user.getName()).email(user.getEmail()).build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));

        LoginHistory history = LoginHistory.builder().user(user).loginTime(LocalDateTime.now()).build();
        loginHistoryRepository.save(history);

        String token = jwtService.generateToken(org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole())
                .build());

        return AuthResponse.builder().token(token).role(user.getRole()).name(user.getName()).email(user.getEmail()).build();
    }
}
