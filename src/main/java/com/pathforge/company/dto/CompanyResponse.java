package com.pathforge.company.dto;

import com.pathforge.common.VerificationStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CompanyResponse(
        UUID id,
        UUID userId,
        String fullName,
        String email,
        String name,
        String description,
        String website,
        String businessRegistrationNo,
        VerificationStatus verificationStatus,
        OffsetDateTime verifiedAt,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}