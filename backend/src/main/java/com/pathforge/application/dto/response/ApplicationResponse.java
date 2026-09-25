package com.pathforge.application.dto.response;

import com.pathforge.application.model.ApplicationStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ApplicationResponse(
        UUID id,
        UUID experienceId,
        String experienceTitle,
        UUID learnerId,
        String learnerName,
        String motivation,
        ApplicationStatus status,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}