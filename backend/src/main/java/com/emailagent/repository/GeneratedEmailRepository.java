package com.emailagent.repository;

import com.emailagent.entity.GeneratedEmail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GeneratedEmailRepository extends JpaRepository<GeneratedEmail, Long> {
    List<GeneratedEmail> findByCampaignUserId(Long userId);
}
