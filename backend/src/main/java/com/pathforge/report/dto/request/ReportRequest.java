package com.pathforge.report.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record ReportRequest(

        UUID reportedUserId,

        UUID experienceId,

        @NotBlank(message = "Reason is required")
        @Size(max = 100, message = "Reason must be under 100 characters")
        String reason,

        String description
) {
}