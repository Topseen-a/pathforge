package com.pathforge.project.dto.request;

import com.pathforge.project.model.WorkMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProjectRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 150, message = "Title must be under 150 characters")
        String title,

        String description,

        @Size(max = 100, message = "Category must be under 100 characters")
        String category,

        String objective,

        @Positive(message = "Duration must be a positive number of days")
        Integer durationDays,

        BigDecimal compensationAmount,

        boolean paid,

        @Size(max = 150, message = "Location must be under 150 characters")
        String location,

        WorkMode workMode,

        LocalDate applicationDeadline,

        @Positive(message = "Max participants must be at least 1")
        Integer maxParticipants,

        String evaluationCriteria
) {
}