package com.emailagent.service.impl;

import com.emailagent.ai.GroqService;
import com.emailagent.ai.PromptBuilder;
import com.emailagent.dto.AiEmailRequest;
import com.emailagent.dto.ChatRequest;
import com.emailagent.dto.ChatResponse;
import com.emailagent.entity.Campaign;
import com.emailagent.entity.Customer;
import com.emailagent.entity.GeneratedEmail;
import com.emailagent.entity.User;
import com.emailagent.exception.ResourceNotFoundException;
import com.emailagent.repository.CampaignRepository;
import com.emailagent.repository.CustomerRepository;
import com.emailagent.repository.GeneratedEmailRepository;
import com.emailagent.repository.UserRepository;
import com.emailagent.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {
    private final GroqService groqService;
    private final GeneratedEmailRepository generatedEmailRepository;
    private final CampaignRepository campaignRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    @Override
    public GeneratedEmail generateEmail(AiEmailRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Customer customer = customerRepository.findById(1L).orElseGet(() -> {
            Customer c = new Customer();
            c.setName(request.getCustomerName());
            c.setEmail("customer@example.com");
            return customerRepository.save(c);
        });

        Campaign campaign = campaignRepository.save(Campaign.builder()
                .campaignName(request.getCampaignName())
                .productName(request.getProduct())
                .goal(request.getGoal())
                .tone(request.getTone())
                .language(request.getLanguage())
                .createdDate(LocalDateTime.now())
                .user(user)
                .build());

        Map<String, Object> aiResult = groqService.generate(PromptBuilder.buildEmailGenerationPrompt(request));

        GeneratedEmail generatedEmail = GeneratedEmail.builder()
                .subject(String.valueOf(aiResult.getOrDefault("subject", "AI Draft")))
                .preview(String.valueOf(aiResult.getOrDefault("preview", "")))
                .body(String.valueOf(aiResult.getOrDefault("body", "")))
                .cta(String.valueOf(aiResult.getOrDefault("cta", "Book a demo")))
                .score(aiResult.get("readabilityScore") instanceof Number ? ((Number) aiResult.get("readabilityScore")).intValue() : 90)
                .spamScore(aiResult.get("spamScore") instanceof Number ? ((Number) aiResult.get("spamScore")).doubleValue() : 2.0)
                .readability(String.valueOf(aiResult.getOrDefault("readabilityScore", "High")))
                .tips(String.valueOf(aiResult.getOrDefault("marketingTips", "")))
                .generatedAt(LocalDateTime.now())
                .customer(customer)
                .campaign(campaign)
                .build();

        return generatedEmailRepository.save(generatedEmail);
    }

    @Override
    public ChatResponse chat(ChatRequest request) {
        Map<String, Object> aiResult = groqService.generate(PromptBuilder.buildChatPrompt(request));
        Object replyCandidate = aiResult.containsKey("reply") ? aiResult.get("reply") : aiResult.get("body");
        if (replyCandidate == null) {
            throw new IllegalStateException("Groq AI returned no chat reply.");
        }
        String reply = String.valueOf(replyCandidate);
        String mode = String.valueOf(aiResult.getOrDefault("mode", "gemini"));
        return ChatResponse.builder().reply(reply).mode(mode).build();
    }
}
