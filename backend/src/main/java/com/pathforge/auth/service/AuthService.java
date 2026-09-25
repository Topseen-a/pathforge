package com.pathforge.auth.service;

import com.pathforge.auth.dto.response.AuthResponse;
import com.pathforge.auth.dto.request.LoginRequest;
import com.pathforge.auth.dto.request.RegisterRequest;
import com.pathforge.common.Role;
import com.pathforge.common.exception.BadRequestException;
import com.pathforge.security.JwtService;
import com.pathforge.security.UserPrincipal;
import com.pathforge.user.model.User;
import com.pathforge.user.repository.UserRepository;
import com.pathforge.user.model.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

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
}