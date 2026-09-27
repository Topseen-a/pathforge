package com.pathforge.project.dto.response;

import com.pathforge.project.model.ProjectStatus;
import com.pathforge.project.model.WorkMode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record ProjectResponse(
        UUID id,
        UUID companyId,
        String companyName,
        String title,
        String description,
        String category,
        String objective,
        Integer durationDays,
        BigDecimal compensationAmount,
        boolean paid,
        String location,
        WorkMode workMode,
        ProjectStatus status,
        LocalDate applicationDeadline,
        Integer maxParticipants,
        String evaluationCriteria,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}