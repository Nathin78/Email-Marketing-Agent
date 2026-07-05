package com.emailagent.controller;

import com.emailagent.dto.AiEmailRequest;
import com.emailagent.dto.ApiResponse;
import com.emailagent.dto.ChatRequest;
import com.emailagent.dto.ChatResponse;
import com.emailagent.entity.GeneratedEmail;
import com.emailagent.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI")
public class AiController {
    private final AiService aiService;

    @PostMapping("/generate-email")
    @Operation(summary = "Generate AI email")
    public ResponseEntity<ApiResponse<GeneratedEmail>> generateEmail(@Valid @RequestBody AiEmailRequest request) {
        return ResponseEntity.ok(ApiResponse.<GeneratedEmail>builder()
                .success(true)
                .message("Email generated successfully")
                .data(aiService.generateEmail(request))
                .build());
    }

    @PostMapping("/chat")
    @Operation(summary = "Chat with NovaMail AI")
    public ResponseEntity<ApiResponse<Map<String, Object>>> chat(@Valid @RequestBody ChatRequest request) {
        ChatResponse chatResponse = aiService.chat(request);
        Map<String, Object> data = new HashMap<>();
        data.put("response", chatResponse.getReply());
        data.put("mode", chatResponse.getMode());
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Chat response generated")
                .data(data)
                .build());
    }
}
