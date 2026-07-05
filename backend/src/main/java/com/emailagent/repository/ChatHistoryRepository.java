package com.emailagent.repository;

import com.emailagent.entity.ChatHistory;
import com.emailagent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    List<ChatHistory> findByUserOrderByCreatedAtDesc(User user);
}
