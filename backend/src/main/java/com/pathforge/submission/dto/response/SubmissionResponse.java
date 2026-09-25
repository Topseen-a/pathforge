package com.pathforge.submission.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

public record SubmissionResponse(
        UUID id,
        UUID taskId,
        String taskTitle,
        UUID learnerId,
        String learnerName,
        String content,
        String fileUrl,
        OffsetDateTime submittedAt
) {
}