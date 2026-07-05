package com.emailagent.ai;

import com.emailagent.exception.GeminiApiException;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class GroqServiceTest {

    @Test
    void generateThrowsWhenApiKeyIsMissing() {
        GroqService service = new GroqService();
        ReflectionTestUtils.setField(service, "apiKey", "");

        assertThatThrownBy(() -> service.generate("Create a welcome email"))
                .isInstanceOf(GeminiApiException.class)
                .hasMessageContaining("Groq API key is missing");
    }
}
