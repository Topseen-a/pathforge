package com.pathforge.workspace.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

public record WorkspaceResponse(
        UUID id,
        UUID experienceId,
        String experienceTitle,
        UUID companyId,
        String companyName,
        UUID learnerId,
        String learnerName,
        UUID applicationId,
        OffsetDateTime createdAt
) {
}