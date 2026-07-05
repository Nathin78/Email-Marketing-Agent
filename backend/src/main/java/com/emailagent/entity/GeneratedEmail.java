package com.emailagent.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

@Entity
@Table(name = "generated_emails")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeneratedEmail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject;

    private String preview;
    @Column(columnDefinition = "TEXT")
    private String body;
    private String cta;
    private Integer score;
    private Double spamScore;
    private String readability;
    private String tips;

    @Column(nullable = false)
    private LocalDateTime generatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    @JsonIgnore
    private Campaign campaign;
}
