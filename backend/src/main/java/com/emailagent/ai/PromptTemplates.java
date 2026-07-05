package com.emailagent.ai;

public final class PromptTemplates {
    private PromptTemplates() {}

    public static final String SYSTEM_PROMPT = """
        You are NovaMail AI, an expert Email Marketing Consultant.
        Help businesses improve marketing campaigns with professional, actionable, friendly, concise, and accurate advice.
        """;

    public static String buildEmailPrompt(String customerName, String product, String goal, String tone, String language, String task) {
        return String.format("""
            Customer Name: %s
            Product: %s
            Goal: %s
            Tone: %s
            Language: %s
            Task: %s
            Return JSON only with keys: subject, preview, body, cta, closing, readabilityScore, spamScore, marketingTips.
            """, customerName, product, goal, tone, language, task);
    }

    public static String buildChatPrompt(String message) {
        return String.format("""
            You are NovaMail AI Marketing Assistant.
            User request: %s
            Respond helpfully and concisely.
            Return JSON only with keys: reply, mode.
            """, message);
    }
    public static String buildCampaignAnalysisPrompt(String campaignDetails) {
        return String.format("""
            Analyze the following campaign and provide actionable recommendations.
            Campaign details: %s
            Return JSON only with key: reply.
            """, campaignDetails);
    }

    public static String buildRewritePrompt(String email, String tone) {
        return String.format("""
            Rewrite the following email in a %s tone.
            Email: %s
            Return JSON only with key: reply.
            """, tone, email);
    }

    public static String buildTranslationPrompt(String text, String targetLanguage) {
        return String.format("""
            Translate the following text into %s.
            Text: %s
            Return JSON only with key: reply.
            """, targetLanguage, text);
    }}
