package com.pathforge.auth.service;

import com.pathforge.auth.dto.response.AuthResponse;
import com.pathforge.auth.dto.request.LoginRequest;
import com.pathforge.auth.dto.request.RegisterRequest;
import com.pathforge.auth.model.PasswordResetToken;
import com.pathforge.auth.repository.PasswordResetTokenRepository;
import com.pathforge.common.Role;
import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.email.EmailService;
import com.pathforge.security.JwtService;
import com.pathforge.security.UserPrincipal;
import com.pathforge.user.model.User;
import com.pathforge.user.repository.UserRepository;
import com.pathforge.user.model.UserStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailService emailService;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${app.password-reset.token-expiry-minutes}")
    private long tokenExpiryMinutes;

    public AuthResponse register(RegisterRequest request) {
        if (request.role() == Role.ADMIN) {
            throw new BadRequestException("Admin accounts cannot be created through registration");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .phoneNumber(request.phoneNumber())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(request.role())
                .status(UserStatus.ACTIVE)
                .build();

        user = userRepository.save(user);

        String token = jwtService.generateToken(new UserPrincipal(user));

        return AuthResponse.of(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication;

        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
        } catch (BadCredentialsException e) {
            throw new BadRequestException("Invalid email or password");
        }

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = principal.getUser();

        String token = jwtService.generateToken(principal);

        return AuthResponse.of(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    /**
     * Deliberately does not reveal whether the email is registered — the
     * caller always gets the same response either way, to avoid leaking
     * which emails have accounts.
     */
    @Transactional
    public void forgotPassword(String email) {
        userRepository.findByEmail(email).ifPresentOrElse(user -> {
            String rawToken = generateSecureToken();

            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .user(user)
                    .token(rawToken)
                    .expiresAt(OffsetDateTime.now().plusMinutes(tokenExpiryMinutes))
                    .build();
            passwordResetTokenRepository.save(resetToken);

            String resetLink = frontendUrl + "/reset-password?token=" + rawToken;
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        }, () -> log.debug("Password reset requested for an email with no matching account"));
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("This reset link is invalid or has expired"));

        if (!resetToken.isValid()) {
            throw new BadRequestException("This reset link is invalid or has expired");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsedAt(OffsetDateTime.now());
        passwordResetTokenRepository.save(resetToken);
    }

    @Transactional
    public void changePassword(UUID userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}