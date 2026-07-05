package com.emailagent.ai;

import com.emailagent.dto.AiEmailRequest;
import com.emailagent.dto.ChatRequest;

public final class PromptBuilder {
    private PromptBuilder() {}

    public static String buildEmailGenerationPrompt(AiEmailRequest request) {
        return PromptTemplates.buildEmailPrompt(
                request.getCustomerName(),
                request.getProduct(),
                request.getGoal(),
                request.getTone(),
                request.getLanguage(),
                "Generate a highly personalized marketing email."
        );
    }

    public static String buildChatPrompt(ChatRequest request) {
        return PromptTemplates.buildChatPrompt(request.getMessage());
    }
}
