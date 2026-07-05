package com.emailagent.controller;

import com.emailagent.dto.ApiResponse;
import com.emailagent.entity.User;
import com.emailagent.exception.ResourceNotFoundException;
import com.emailagent.repository.CampaignRepository;
import com.emailagent.repository.CustomerRepository;
import com.emailagent.repository.GeneratedEmailRepository;
import com.emailagent.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard")
public class DashboardController {
    private final CustomerRepository customerRepository;
    private final CampaignRepository campaignRepository;
    private final GeneratedEmailRepository generatedEmailRepository;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long customers = customerRepository.count();
        long campaigns = campaignRepository.findByUserId(user.getId()).size();
        long emailsGenerated = generatedEmailRepository.findByCampaignUserId(user.getId()).size();
        double averageScore = generatedEmailRepository.findByCampaignUserId(user.getId()).stream().mapToInt(e -> e.getScore() == null ? 0 : e.getScore()).average().orElse(0.0);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("customers", customers);
        data.put("campaigns", campaigns);
        data.put("emailsGenerated", emailsGenerated);
        data.put("averageScore", Math.round(averageScore));

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder().success(true).message("Dashboard data retrieved").data(data).build());
    }
}
