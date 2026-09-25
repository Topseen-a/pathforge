package com.pathforge.task.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TaskRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 150, message = "Title must be under 150 characters")
        String title,

        String description,

        LocalDate deadline
) {
}