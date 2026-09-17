package com.pathforge.messaging.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

public record MessageResponse(
        UUID id,
        UUID senderId,
        String senderName,
        UUID receiverId,
        String receiverName,
        UUID experienceId,
        String content,
        OffsetDateTime createdAt
) {
}