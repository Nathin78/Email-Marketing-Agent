package com.emailagent.service.impl;

import com.emailagent.dto.CampaignRequest;
import com.emailagent.entity.Campaign;
import com.emailagent.entity.User;
import com.emailagent.exception.ResourceNotFoundException;
import com.emailagent.mapper.CampaignMapper;
import com.emailagent.repository.CampaignRepository;
import com.emailagent.repository.UserRepository;
import com.emailagent.service.CampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignServiceImpl implements CampaignService {
    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;

    @Override
    public List<Campaign> getAllCampaigns() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return campaignRepository.findByUserId(user.getId());
    }

    @Override
    public Campaign createCampaign(CampaignRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Campaign campaign = CampaignMapper.toEntity(request);
        campaign.setUser(user);
        return campaignRepository.save(campaign);
    }

    @Override
    public void deleteCampaign(Long id) {
        Campaign campaign = campaignRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
        campaignRepository.delete(campaign);
    }
}
