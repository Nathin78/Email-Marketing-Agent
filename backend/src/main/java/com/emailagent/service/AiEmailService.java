package com.emailagent.service;

import com.emailagent.dto.AiEmailRequest;
import com.emailagent.entity.GeneratedEmail;

public interface AiEmailService {
    GeneratedEmail generateEmail(AiEmailRequest request);
}
