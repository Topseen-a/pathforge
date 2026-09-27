package com.pathforge.workspace.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

public record WorkspaceResponse(
        UUID id,
        UUID projectId,
        String projectTitle,
        UUID companyId,
        String companyName,
        UUID talentId,
        String talentName,
        UUID applicationId,
        OffsetDateTime createdAt
) {
}