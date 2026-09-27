package com.pathforge.application.dto.response;

import com.pathforge.application.model.ApplicationStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ApplicationResponse(
        UUID id,
        UUID projectId,
        String projectTitle,
        UUID talentId,
        String talentName,
        String motivation,
        ApplicationStatus status,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}