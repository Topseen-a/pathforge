package com.pathforge.messaging.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

public record MessageResponse(
        UUID id,
        UUID senderId,
        String senderName,
        UUID receiverId,
        String receiverName,
        UUID projectId,
        String content,
        OffsetDateTime createdAt
) {
}