package com.pathforge.experience.dto.response;

import com.pathforge.experience.model.ExperienceStatus;
import com.pathforge.experience.model.WorkMode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record ExperienceResponse(
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
        ExperienceStatus status,
        LocalDate applicationDeadline,
        Integer maxParticipants,
        String evaluationCriteria,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}