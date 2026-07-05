package com.emailagent.controller;

import com.emailagent.dto.ApiResponse;
import com.emailagent.entity.GeneratedEmail;
import com.emailagent.entity.User;
import com.emailagent.exception.ResourceNotFoundException;
import com.emailagent.repository.GeneratedEmailRepository;
import com.emailagent.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
@Tag(name = "History")
public class HistoryController {
    private final GeneratedEmailRepository generatedEmailRepository;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get generated email history")
    public ResponseEntity<ApiResponse<List<GeneratedEmail>>> getHistory() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(ApiResponse.<List<GeneratedEmail>>builder().success(true).message("History retrieved").data(generatedEmailRepository.findByCampaignUserId(user.getId())).build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete generated email history")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        generatedEmailRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("History deleted").build());
    }
}
