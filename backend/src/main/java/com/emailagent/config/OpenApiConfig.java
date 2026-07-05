package com.emailagent.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI emailAgentOpenAPI() {
        return new OpenAPI().info(new Info()
            .title("AI Email Marketing Agent API")
            .description("REST API for managing customers, campaigns, AI-generated emails and analytics")
            .version("1.0.0"));
    }
}
