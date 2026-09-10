package com.pathforge.learner.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record LearnerProfileResponse(
        UUID id,
        UUID userId,
        String fullName,
        String email,
        String bio,
        String location,
        String education,
        String interests,
        String portfolioUrl,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}