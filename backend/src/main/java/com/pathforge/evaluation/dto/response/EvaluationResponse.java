package com.pathforge.evaluation.dto.response;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record EvaluationResponse(
        UUID id,
        UUID experienceId,
        String experienceTitle,
        UUID learnerId,
        String learnerName,
        UUID evaluatorId,
        String evaluatorName,
        BigDecimal overallRating,
        BigDecimal qualityRating,
        BigDecimal communicationRating,
        BigDecimal professionalismRating,
        String feedback,
        OffsetDateTime createdAt
) {
}