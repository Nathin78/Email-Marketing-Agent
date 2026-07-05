package com.emailagent.mapper;

import com.emailagent.dto.CampaignRequest;
import com.emailagent.entity.Campaign;

import java.time.LocalDateTime;

public class CampaignMapper {
    public static Campaign toEntity(CampaignRequest request) {
        return Campaign.builder()
                .campaignName(request.getCampaignName())
                .productName(request.getProductName())
                .goal(request.getGoal())
                .tone(request.getTone())
                .language(request.getLanguage())
                .createdDate(LocalDateTime.now())
                .build();
    }

    public static void updateEntity(Campaign campaign, CampaignRequest request) {
        campaign.setCampaignName(request.getCampaignName());
        campaign.setProductName(request.getProductName());
        campaign.setGoal(request.getGoal());
        campaign.setTone(request.getTone());
        campaign.setLanguage(request.getLanguage());
    }
}
