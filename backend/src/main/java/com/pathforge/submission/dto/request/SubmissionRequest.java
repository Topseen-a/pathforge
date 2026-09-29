package com.pathforge.submission.dto.request;

import jakarta.validation.constraints.Size;

public record SubmissionRequest(
        String content,

        @Size(max = 3_000_000, message = "Attached file is too large")
        String fileUrl
) {
}