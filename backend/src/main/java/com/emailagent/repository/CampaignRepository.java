package com.emailagent.repository;

import com.emailagent.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByUserId(Long userId);
}
