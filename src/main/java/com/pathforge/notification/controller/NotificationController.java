package com.pathforge.notification.controller;

import com.pathforge.notification.dto.response.NotificationResponse;
import com.pathforge.notification.service.NotificationService;
import com.pathforge.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> listMyNotifications(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(notificationService.listMyNotifications(principal.getId()));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> listUnread(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(notificationService.listUnread(principal.getId()));
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> countUnread(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(Map.of("count", notificationService.countUnread(principal.getId())));
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID notificationId
    ) {
        return ResponseEntity.ok(notificationService.markAsRead(principal.getId(), notificationId));
    }
}