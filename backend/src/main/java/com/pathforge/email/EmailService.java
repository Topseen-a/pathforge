package com.pathforge.email;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Sends transactional emails via SMTP (configured through MAIL_* env vars —
 * see application.yml). If SMTP isn't configured yet, or a send fails, the
 * message is logged instead of thrown, so flows like password reset stay
 * testable locally before real email credentials exist.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        String subject = "Reset your PathForge password";
        String body = """
                We received a request to reset your PathForge password.

                Click the link below to choose a new one. This link expires in 1 hour \
                and can only be used once.

                %s

                If you didn't request this, you can safely ignore this email.
                """.formatted(resetLink);

        if (fromAddress == null || fromAddress.isBlank()) {
            log.warn("MAIL_USERNAME is not configured — logging the reset link instead of emailing it.");
            log.info("Password reset link for {}: {}", toEmail, resetLink);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (MailException e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
            log.info("Password reset link for {}: {}", toEmail, resetLink);
        }
    }
}
