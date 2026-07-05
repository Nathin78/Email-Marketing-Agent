package com.emailagent.ai;

import com.emailagent.exception.GeminiApiException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class GroqService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    @Value("${ai.groq.api-key}")
    private String apiKey;

    @Value("${ai.groq.model:llama-3.3-70b-versatile}")
    private String model;

    public GroqService() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(30000);
        requestFactory.setReadTimeout(60000);
        this.restTemplate = new RestTemplate(requestFactory);
    }

    @PostConstruct
    public void validateConfiguration() {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Groq API key is missing. Set ai.groq.api-key in application.properties.");
        }
        if (model == null || model.isBlank()) {
            throw new IllegalStateException("Groq model is missing. Set ai.groq.model in application.properties.");
        }

        // Log masked key for debugging
        String maskedKey = apiKey.length() > 8
                ? apiKey.substring(0, 4) + "****" + apiKey.substring(apiKey.length() - 4)
                : "****";
        System.out.println("🔑 Groq API Key (masked): " + maskedKey);
        System.out.println("🤖 Groq Model: " + model);

        if (!apiKey.startsWith("gsk_")) {
            System.err.println("⚠️ WARNING: Your Groq API key does not start with 'gsk_'. " +
                    "Valid Groq API keys start with 'gsk_'. " +
                    "Get a valid key from https://console.groq.com/keys");
        }

        System.out.println("✅ Groq AI service initialized.");
    }

    private void requireApiKey() {
        if (apiKey == null || apiKey.isBlank()) {
            throw new GeminiApiException("Groq API key is missing");
        }
    }

    public Map<String, Object> generate(String prompt) {
        requireApiKey();
        return callGroq(prompt);
    }

    public String generateResponse(String prompt) {
        Map<String, Object> response = generate(prompt);
        if (response.containsKey("reply")) {
            return String.valueOf(response.get("reply"));
        }
        if (response.containsKey("body")) {
            return String.valueOf(response.get("body"));
        }
        try {
            return objectMapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            throw new GeminiApiException("Unable to serialize Groq response", e);
        }
    }

    public Map<String, Object> generateEmail(String customerName, String product, String goal, String tone, String language) {
        String prompt = PromptTemplates.buildEmailPrompt(customerName, product, goal, tone, language, "Generate a highly personalized marketing email.");
        return generate(prompt);
    }

    public String rewriteEmail(String email, String tone) {
        String prompt = PromptTemplates.buildRewritePrompt(email, tone);
        return generateResponse(prompt);
    }

    public String translate(String text, String targetLanguage) {
        String prompt = PromptTemplates.buildTranslationPrompt(text, targetLanguage);
        return generateResponse(prompt);
    }

    public String analyzeCampaign(String campaignDetails) {
        String prompt = PromptTemplates.buildCampaignAnalysisPrompt(campaignDetails);
        return generateResponse(prompt);
    }

    private Map<String, Object> callGroq(String prompt) {
        try {
            // Build OpenAI-compatible request body
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("model", model);
            body.put("messages", List.of(
                    Map.of("role", "system", "content", PromptTemplates.SYSTEM_PROMPT),
                    Map.of("role", "user", "content", prompt)
            ));
            body.put("response_format", Map.of("type", "json_object"));
            body.put("temperature", 0.7);
            body.put("max_tokens", 4096);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            System.out.println("📤 Sending prompt to Groq (" + model + ")...");

            ResponseEntity<Map> responseEntity = restTemplate.exchange(GROQ_API_URL, HttpMethod.POST, entity, Map.class);
            int statusCode = responseEntity.getStatusCodeValue();
            System.out.println("✅ Groq HTTP Status: " + statusCode);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = responseEntity.getBody();
            if (response == null || response.get("choices") == null) {
                System.err.println("❌ Groq response body: " + response);
                throw new GeminiApiException("Empty Groq response — no choices returned.");
            }

            // Extract text from OpenAI-compatible response: choices[0].message.content
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices.isEmpty()) {
                throw new GeminiApiException("Groq returned empty choices array.");
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String textOutput = String.valueOf(message.get("content"));

            System.out.println("📥 Groq Response: " + (textOutput.length() > 200 ? textOutput.substring(0, 200) + "..." : textOutput));

            if (textOutput == null || textOutput.isBlank() || "null".equals(textOutput)) {
                throw new GeminiApiException("Groq returned empty text in response.");
            }

            // Parse JSON response
            try {
                return objectMapper.readValue(textOutput, Map.class);
            } catch (JsonProcessingException e) {
                // If not valid JSON, wrap it
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("reply", textOutput);
                return map;
            }
        } catch (HttpClientErrorException e) {
            String errorBody = e.getResponseBodyAsString();
            System.err.println("❌ Groq API Error (HTTP " + e.getStatusCode().value() + "): " + errorBody);
            throw new GeminiApiException("Groq API error (HTTP " + e.getStatusCode().value() + "): " + extractErrorMessage(errorBody), e);
        } catch (HttpServerErrorException e) {
            String errorBody = e.getResponseBodyAsString();
            System.err.println("❌ Groq Server Error (HTTP " + e.getStatusCode().value() + "): " + errorBody);
            throw new GeminiApiException("Groq server error (HTTP " + e.getStatusCode().value() + "). Please try again later.", e);
        } catch (RestClientException e) {
            System.err.println("❌ Network error contacting Groq: " + e.getMessage());
            throw new GeminiApiException("Unable to contact Groq API — check your internet connection. Details: " + e.getMessage(), e);
        } catch (ClassCastException e) {
            System.err.println("❌ Unexpected Groq response format: " + e.getMessage());
            throw new GeminiApiException("Unexpected response format from Groq API", e);
        }
    }

    /**
     * Extract a human-readable error message from Groq's JSON error response.
     */
    private String extractErrorMessage(String errorBody) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> errorMap = objectMapper.readValue(errorBody, Map.class);
            if (errorMap.containsKey("error")) {
                Object errorObj = errorMap.get("error");
                if (errorObj instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> error = (Map<String, Object>) errorObj;
                    return String.valueOf(error.getOrDefault("message", "Unknown error"));
                }
                return String.valueOf(errorObj);
            }
        } catch (Exception ignored) {
            // Fall back to raw body
        }
        return errorBody.length() > 300 ? errorBody.substring(0, 300) + "..." : errorBody;
    }
}
