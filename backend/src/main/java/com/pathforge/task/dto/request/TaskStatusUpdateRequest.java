package com.pathforge.task.dto.request;

import com.pathforge.task.model.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record TaskStatusUpdateRequest(

        @NotNull(message = "Status is required")
        TaskStatus status
) {
}