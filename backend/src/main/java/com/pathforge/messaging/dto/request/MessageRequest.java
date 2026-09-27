package com.pathforge.messaging.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record MessageRequest(

        @NotNull(message = "Receiver is required")
        UUID receiverId,

        UUID projectId,

        @NotBlank(message = "Message content is required")
        String content
) {
}