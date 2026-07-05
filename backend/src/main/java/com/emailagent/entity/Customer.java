package com.emailagent.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String company;
    private String industry;
    @Column(nullable = false, unique = true)
    private String email;
    private String jobTitle;
    private String country;
    private String interest;
    @Column(columnDefinition = "TEXT")
    private String purchaseHistory;
}
