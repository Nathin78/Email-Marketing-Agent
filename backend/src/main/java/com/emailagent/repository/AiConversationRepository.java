package com.emailagent.repository;

import com.emailagent.entity.AiConversation;
import com.emailagent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiConversationRepository extends JpaRepository<AiConversation, Long> {
    List<AiConversation> findByUserOrderByCreatedAtDesc(User user);
}
