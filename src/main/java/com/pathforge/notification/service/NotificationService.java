package com.pathforge.notification.service;

import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.common.exception.UnauthorizedActionException;
import com.pathforge.notification.dto.response.NotificationResponse;
import com.pathforge.notification.model.Notification;
import com.pathforge.notification.repository.NotificationRepository;
import com.pathforge.user.model.User;
import com.pathforge.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * Called by other services (ApplicationService, SubmissionService, etc.)
     * to notify a user of something relevant. No HTTP endpoint of its own —
     * notifications are system-generated, never created directly by a user.
     */
    @Transactional
    public void notify(UUID userId, String type, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .read(false)
                .build();

        notificationRepository.save(notification);
    }

    public List<NotificationResponse> listMyNotifications(UUID userId) {
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<NotificationResponse> listUnread(UUID userId) {
        return notificationRepository.findByUser_IdAndReadFalseOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public long countUnread(UUID userId) {
        return notificationRepository.countByUser_IdAndReadFalse(userId);
    }

    @Transactional
    public NotificationResponse markAsRead(UUID userId, UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You do not have permission to modify this notification");
        }

        notification.setRead(true);
        notification = notificationRepository.saveAndFlush(notification);

        return toResponse(notification);
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getType(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}