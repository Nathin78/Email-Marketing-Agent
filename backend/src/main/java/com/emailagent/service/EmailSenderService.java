package com.emailagent.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailSenderService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendWelcomeEmail(String toEmail, String name) {
        new Thread(() -> {
            try {
                if (mailSender == null) {
                    System.err.println("⚠️ JavaMailSender is not initialized. Printing welcome email to console:");
                    printMockWelcomeEmail(toEmail, name);
                    return;
                }

                System.out.println("📬 Sending welcome email to " + toEmail + "...");
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("smarthomeenergymanagement1@gmail.com");
                message.setTo(toEmail);
                message.setSubject("Welcome to Nexora AI Email Marketing Agent!");
                message.setText("Dear " + name + ",\n\n"
                        + "Welcome to Nexora AI! You have successfully logged in for the first time.\n"
                        + "Start launching highly personalized, AI-powered email campaigns and grow your business today.\n\n"
                        + "Best regards,\n"
                        + "The Nexora AI Team");
                mailSender.send(message);
                System.out.println("✅ Welcome email successfully sent to " + toEmail);
            } catch (Exception e) {
                System.err.println("❌ Failed to send welcome email to " + toEmail + ": " + e.getMessage());
                printMockWelcomeEmail(toEmail, name);
            }
        }).start();
    }

    private void printMockWelcomeEmail(String toEmail, String name) {
        System.out.println("==================================================");
        System.out.println("MOCK WELCOME EMAIL DISPATCHED");
        System.out.println("To: " + toEmail);
        System.out.println("Subject: Welcome to Nexora AI Email Marketing Agent!");
        System.out.println("Body:");
        System.out.println("Dear " + name + ",");
        System.out.println("Welcome to Nexora AI! You have successfully logged in for the first time.");
        System.out.println("==================================================");
    }
}
