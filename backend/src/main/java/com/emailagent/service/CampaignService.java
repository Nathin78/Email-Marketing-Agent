package com.emailagent.service;

import com.emailagent.dto.CampaignRequest;
import com.emailagent.entity.Campaign;

import java.util.List;

public interface CampaignService {
    List<Campaign> getAllCampaigns();
    Campaign createCampaign(CampaignRequest request);
    void deleteCampaign(Long id);
}
