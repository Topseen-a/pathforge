package com.pathforge.config;

import com.pathforge.common.Role;
import com.pathforge.user.model.User;
import com.pathforge.user.model.UserStatus;
import com.pathforge.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Creates the first ADMIN account on startup, since /auth/register explicitly
 * refuses to create one (see AuthService.register) and there is no other way
 * to reach the admin-only endpoints (e.g. verifying a company) otherwise.
 * Runs only when no ADMIN exists yet and both ADMIN_EMAIL/ADMIN_PASSWORD are
 * set, so a normal dev/test run without them is unaffected.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminBootstrapRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin-bootstrap.email:}")
    private String adminEmail;

    @Value("${app.admin-bootstrap.password:}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(String... args) {
        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            if (!userRepository.existsByRole(Role.ADMIN)) {
                log.warn("No ADMIN account exists yet, and ADMIN_EMAIL/ADMIN_PASSWORD are not set — " +
                        "admin-only actions (e.g. verifying a company) are unreachable until you set them and restart.");
            }
            return;
        }

        if (userRepository.existsByRole(Role.ADMIN)) {
            return;
        }

        if (userRepository.existsByEmail(adminEmail)) {
            log.warn("ADMIN_EMAIL '{}' is already used by a non-admin account — skipping admin bootstrap.", adminEmail);
            return;
        }

        User admin = User.builder()
                .fullName("Admin")
                .email(adminEmail)
                .passwordHash(passwordEncoder.encode(adminPassword))
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.saveAndFlush(admin);
        log.info("Created initial ADMIN account for '{}'.", adminEmail);
    }
}
