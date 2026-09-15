package com.pathforge.task.dto.response;

import com.pathforge.task.model.TaskStatus;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record TaskResponse(
        UUID id,
        UUID experienceId,
        String title,
        String description,
        LocalDate deadline,
        TaskStatus status,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}