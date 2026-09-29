package com.pathforge.messaging.service;

import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.common.exception.UnauthorizedActionException;
import com.pathforge.notification.service.NotificationService;
import com.pathforge.project.model.Project;
import com.pathforge.project.repository.ProjectRepository;
import com.pathforge.talent.repository.TalentProfileRepository;
import com.pathforge.messaging.dto.request.MessageRequest;
import com.pathforge.messaging.dto.response.MessageResponse;
import com.pathforge.messaging.model.Message;
import com.pathforge.messaging.repository.MessageRepository;
import com.pathforge.user.model.User;
import com.pathforge.user.repository.UserRepository;
import com.pathforge.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final WorkspaceRepository workspaceRepository;
    private final TalentProfileRepository talentProfileRepository;
    private final NotificationService notificationService;

    @Transactional
    public MessageResponse sendMessage(UUID userId, MessageRequest request) {
        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));

        User receiver = userRepository.findById(request.receiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        Project project = null;
        if (request.projectId() != null) {
            project = projectRepository.findById(request.projectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        }

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .project(project)
                .content(request.content())
                .build();

        message = messageRepository.saveAndFlush(message);

        notificationService.notify(
                receiver.getId(),
                "NEW_MESSAGE",
                sender.getFullName() + " sent you a message"
        );

        return toResponse(message);
    }

    public List<MessageResponse> listConversation(UUID userId, UUID otherUserId) {
        return messageRepository.findConversation(userId, otherUserId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<MessageResponse> listForProject(UUID userId, UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        boolean isOwningCompany = project.getCompany().getUser().getId().equals(userId);

        boolean hasWorkspace = talentProfileRepository.findByUserId(userId)
                .map(talent -> workspaceRepository.existsByProject_IdAndTalent_Id(projectId, talent.getId()))
                .orElse(false);

        if (!isOwningCompany && !hasWorkspace) {
            throw new UnauthorizedActionException("You do not have permission to view these messages");
        }

        return messageRepository.findByProject_IdOrderByCreatedAtAsc(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    private MessageResponse toResponse(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getSender().getId(),
                message.getSender().getFullName(),
                message.getReceiver().getId(),
                message.getReceiver().getFullName(),
                message.getProject() != null ? message.getProject().getId() : null,
                message.getContent(),
                message.getCreatedAt()
        );
    }
}