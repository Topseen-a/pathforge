package com.pathforge.passport.dto.response;

import com.pathforge.common.VerificationStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ExperienceRecordResponse(
        UUID id,
        UUID learnerId,
        String learnerName,
        UUID experienceId,
        String experienceTitle,
        String companyName,
        VerificationStatus verificationStatus,
        String verificationCode,
        OffsetDateTime completedAt
) {
}