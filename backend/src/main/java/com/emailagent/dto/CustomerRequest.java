package com.emailagent.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerRequest {
    @NotBlank
    private String name;

    private String company;
    private String industry;

    @Email
    @NotBlank
    private String email;

    private String jobTitle;
    private String country;
    private String interest;
    private String purchaseHistory;
}
