package com.pathforge.notification.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        String type,
        String message,
        boolean read,
        OffsetDateTime createdAt
) {
}