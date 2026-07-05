package com.emailagent.service.impl;

import com.emailagent.dto.AiEmailRequest;
import com.emailagent.entity.Campaign;
import com.emailagent.entity.Customer;
import com.emailagent.entity.GeneratedEmail;
import com.emailagent.entity.User;
import com.emailagent.ai.GroqService;
import com.emailagent.ai.PromptBuilder;
import com.emailagent.exception.ResourceNotFoundException;
import com.emailagent.repository.CampaignRepository;
import com.emailagent.repository.CustomerRepository;
import com.emailagent.repository.GeneratedEmailRepository;
import com.emailagent.repository.UserRepository;
import com.emailagent.service.AiEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiEmailServiceImpl implements AiEmailService {
    private final GeneratedEmailRepository generatedEmailRepository;
    private final CustomerRepository customerRepository;
    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;
    private final GroqService groqService;

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

        Campaign campaign = Campaign.builder()
                .campaignName(request.getCampaignName())
                .productName(request.getProduct())
                .goal(request.getGoal())
                .tone(request.getTone())
                .language(request.getLanguage())
                .createdDate(LocalDateTime.now())
                .user(user)
                .build();
        campaign = campaignRepository.save(campaign);

        Map<String, Object> aiResult = groqService.generate(
                PromptBuilder.buildEmailGenerationPrompt(request)
        );

        GeneratedEmail generatedEmail = GeneratedEmail.builder()
                .subject((String) aiResult.get("subject"))
                .preview((String) aiResult.get("preview"))
                .body((String) aiResult.get("body"))
                .cta((String) aiResult.get("cta"))
                .score(aiResult.get("score") instanceof Number ? ((Number) aiResult.get("score")).intValue() : 0)
                .spamScore(aiResult.get("spamScore") instanceof Number ? ((Number) aiResult.get("spamScore")).doubleValue() : 0.0)
                .readability((String) aiResult.get("readability"))
                .tips(String.valueOf(aiResult.get("tips")))
                .generatedAt(LocalDateTime.now())
                .customer(customer)
                .campaign(campaign)
                .build();

        return generatedEmailRepository.save(generatedEmail);
    }
}
