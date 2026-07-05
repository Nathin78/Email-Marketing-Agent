package com.emailagent.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AiEmailRequest {
    @NotBlank
    private String campaignName;

    @NotBlank
    private String product;

    @NotBlank
    private String targetAudience;

    @NotBlank
    private String customerName;

    private String tone;
    private String language;
    private String emailLength;
    private String goal;
}
