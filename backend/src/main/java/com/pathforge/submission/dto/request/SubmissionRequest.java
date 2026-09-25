package com.pathforge.submission.dto.request;

public record SubmissionRequest(
        String content,
        String fileUrl
) {
}