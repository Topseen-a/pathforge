package com.pathforge.talent.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

public record TalentProfileResponse(
        UUID id,
        UUID userId,
        String fullName,
        String email,
        String bio,
        String location,
        String education,
        String interests,
        String portfolioUrl,
        String avatarUrl,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}