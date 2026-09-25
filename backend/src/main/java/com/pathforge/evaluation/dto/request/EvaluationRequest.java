package com.pathforge.evaluation.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record EvaluationRequest(

        @NotNull(message = "Overall rating is required")
        @DecimalMin(value = "0.0", message = "Rating must be at least 0")
        @DecimalMax(value = "5.0", message = "Rating must be at most 5")
        BigDecimal overallRating,

        @DecimalMin(value = "0.0", message = "Rating must be at least 0")
        @DecimalMax(value = "5.0", message = "Rating must be at most 5")
        BigDecimal qualityRating,

        @DecimalMin(value = "0.0", message = "Rating must be at least 0")
        @DecimalMax(value = "5.0", message = "Rating must be at most 5")
        BigDecimal communicationRating,

        @DecimalMin(value = "0.0", message = "Rating must be at least 0")
        @DecimalMax(value = "5.0", message = "Rating must be at most 5")
        BigDecimal professionalismRating,

        String feedback
) {
}