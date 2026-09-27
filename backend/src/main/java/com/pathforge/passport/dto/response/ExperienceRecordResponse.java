package com.pathforge.passport.dto.response;

import com.pathforge.common.VerificationStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ExperienceRecordResponse(
        UUID id,
        UUID talentId,
        String talentName,
        UUID projectId,
        String projectTitle,
        String companyName,
        VerificationStatus verificationStatus,
        String verificationCode,
        OffsetDateTime completedAt
) {
}