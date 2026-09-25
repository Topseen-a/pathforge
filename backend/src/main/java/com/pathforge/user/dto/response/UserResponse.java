package com.pathforge.user.dto.response;

import com.pathforge.common.Role;
import com.pathforge.user.model.UserStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String fullName,
        String email,
        String phoneNumber,
        Role role,
        UserStatus status,
        OffsetDateTime createdAt
) {
}