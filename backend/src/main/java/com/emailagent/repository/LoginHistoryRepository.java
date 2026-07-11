package com.emailagent.repository;

import com.emailagent.entity.LoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {
    long countByUserId(Long userId);
}
