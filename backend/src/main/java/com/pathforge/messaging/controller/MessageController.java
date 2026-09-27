package com.pathforge.messaging.controller;

import com.pathforge.messaging.dto.request.MessageRequest;
import com.pathforge.messaging.dto.response.MessageResponse;
import com.pathforge.messaging.service.MessageService;
import com.pathforge.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody MessageRequest request
    ) {
        MessageResponse response = messageService.sendMessage(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/with/{otherUserId}")
    public ResponseEntity<List<MessageResponse>> listConversation(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID otherUserId
    ) {
        return ResponseEntity.ok(messageService.listConversation(principal.getId(), otherUserId));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<MessageResponse>> listForProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId
    ) {
        return ResponseEntity.ok(messageService.listForProject(principal.getId(), projectId));
    }
}