package com.pathforge.report.dto.response;

import com.pathforge.report.model.ReportStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ReportResponse(
        UUID id,
        UUID reporterId,
        String reporterName,
        UUID reportedUserId,
        String reportedUserName,
        UUID projectId,
        String projectTitle,
        String reason,
        String description,
        ReportStatus status,
        OffsetDateTime createdAt
) {
}