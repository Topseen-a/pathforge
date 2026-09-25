package com.pathforge.application.dto.request;

import com.pathforge.application.model.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record ApplicationDecisionRequest(

        @NotNull(message = "Decision status is required")
        ApplicationStatus status
) {
}