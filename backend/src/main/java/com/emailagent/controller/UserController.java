package com.emailagent.controller;

import com.emailagent.dto.ApiResponse;
import com.emailagent.dto.UpdateProfileRequest;
import com.emailagent.dto.UserProfileDto;
import com.emailagent.entity.User;
import com.emailagent.exception.ResourceNotFoundException;
import com.emailagent.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Profile")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/profile")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfileDto dto = UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .companyName(user.getCompanyName())
                .industry(user.getIndustry())
                .role(user.getRole())
                .build();

        return ResponseEntity.ok(ApiResponse.<UserProfileDto>builder()
                .success(true)
                .message("Profile retrieved successfully")
                .data(dto)
                .build());
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setName(request.getName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setCompanyName(request.getCompanyName());
        user.setIndustry(request.getIndustry());

        userRepository.save(user);

        UserProfileDto dto = UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .companyName(user.getCompanyName())
                .industry(user.getIndustry())
                .role(user.getRole())
                .build();

        return ResponseEntity.ok(ApiResponse.<UserProfileDto>builder()
                .success(true)
                .message("Profile updated successfully")
                .data(dto)
                .build());
    }
}
