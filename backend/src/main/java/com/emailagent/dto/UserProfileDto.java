package com.emailagent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String companyName;
    private String industry;
    private String role;
}
