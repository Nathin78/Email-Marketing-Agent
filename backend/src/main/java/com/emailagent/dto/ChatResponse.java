package com.emailagent.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatResponse {
    private String reply;
    private String mode;
}
