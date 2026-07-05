package com.emailagent.service.impl;

import com.emailagent.ai.GroqService;
import com.emailagent.dto.AiEmailRequest;
import com.emailagent.entity.Campaign;
import com.emailagent.entity.Customer;
import com.emailagent.entity.GeneratedEmail;
import com.emailagent.entity.User;
import com.emailagent.repository.CampaignRepository;
import com.emailagent.repository.CustomerRepository;
import com.emailagent.repository.GeneratedEmailRepository;
import com.emailagent.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiEmailServiceImplTest {

    @Mock
    private GeneratedEmailRepository generatedEmailRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private CampaignRepository campaignRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private GroqService groqService;

    @InjectMocks
    private AiEmailServiceImpl aiEmailService;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("user@example.com", null, List.of())
        );
    }

    @Test
    void generateEmailUsesGeminiServiceResult() {
        User user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(customerRepository.findById(1L)).thenReturn(Optional.empty());
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> {
            Customer customer = invocation.getArgument(0);
            customer.setId(7L);
            return customer;
        });
        when(campaignRepository.save(any(Campaign.class))).thenAnswer(invocation -> {
            Campaign campaign = invocation.getArgument(0);
            campaign.setId(11L);
            return campaign;
        });
        when(generatedEmailRepository.save(any(GeneratedEmail.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(groqService.generate(anyString())).thenReturn(Map.of(
                "subject", "Spring Launch Email",
                "preview", "Short preview of AI CRM Suite",
                "body", "Hello Ava, this email highlights AI CRM Suite for SMB founders.",
                "cta", "Book a demo",
                "score", 92,
                "spamScore", 1.7,
                "readability", "High",
                "tips", "Keep the message clear and actionable."
        ));

        AiEmailRequest request = new AiEmailRequest();
        request.setCampaignName("Spring Launch");
        request.setProduct("AI CRM Suite");
        request.setTargetAudience("SMB founders");
        request.setCustomerName("Ava");
        request.setGoal("Drive demo requests");
        request.setTone("friendly");
        request.setLanguage("English");

        GeneratedEmail result = aiEmailService.generateEmail(request);

        assertNotNull(result);
        assertEquals("Spring Launch Email", result.getSubject());
        assertTrue(result.getBody().contains("Ava"));
        assertTrue(result.getBody().contains("AI CRM Suite"));
        assertEquals("Book a demo", result.getCta());
        assertEquals(92, result.getScore());
        assertEquals(1.7, result.getSpamScore());
        assertEquals("High", result.getReadability());
    }
}
