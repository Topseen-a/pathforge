package com.pathforge.auth.dto;

import com.pathforge.common.Role;

import java.util.UUID;

public record AuthResponse(
        String token,
        String tokenType,
        UUID userId,
        String fullName,
        String email,
        Role role
) {
    public static AuthResponse of(String token, UUID userId, String fullName, String email, Role role) {
        return new AuthResponse(token, "Bearer", userId, fullName, email, role);
    }
}