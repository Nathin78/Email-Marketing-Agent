package com.emailagent.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CampaignRequest {
    @NotBlank
    private String campaignName;

    private String productName;
    private String goal;
    private String tone;
    private String language;
}
