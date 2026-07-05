package com.emailagent.service;

import com.emailagent.dto.ChatRequest;
import com.emailagent.dto.ChatResponse;
import com.emailagent.dto.AiEmailRequest;
import com.emailagent.entity.GeneratedEmail;

public interface AiService {
    GeneratedEmail generateEmail(AiEmailRequest request);
    ChatResponse chat(ChatRequest request);
}
