package com.emailagent.service.impl;

import com.emailagent.dto.AuthResponse;
import com.emailagent.dto.LoginRequest;
import com.emailagent.dto.RegisterRequest;
import com.emailagent.dto.ForgotPasswordRequest;
import com.emailagent.dto.ResetPasswordRequest;
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
                .companyName(request.getCompanyName())
                .phoneNumber(request.getPhoneNumber())
                .industry(request.getIndustry())
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

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String code = String.format("%06d", new java.util.Random().nextInt(1000000));
        user.setResetCode(code);
        userRepository.save(user);
        
        System.out.println("==================================================");
        System.out.println("PASSWORD RESET CODE FOR " + user.getEmail() + " IS: " + code);
        System.out.println("==================================================");
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getResetCode() == null || !user.getResetCode().equals(request.getCode())) {
            throw new RuntimeException("Invalid reset code");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetCode(null);
        userRepository.save(user);
    }
}
