package com.pathforge.messaging.service;

import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.common.exception.UnauthorizedActionException;
import com.pathforge.experience.model.Experience;
import com.pathforge.experience.repository.ExperienceRepository;
import com.pathforge.learner.repository.LearnerProfileRepository;
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
    private final ExperienceRepository experienceRepository;
    private final WorkspaceRepository workspaceRepository;
    private final LearnerProfileRepository learnerProfileRepository;

    @Transactional
    public MessageResponse sendMessage(UUID userId, MessageRequest request) {
        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));

        User receiver = userRepository.findById(request.receiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        Experience experience = null;
        if (request.experienceId() != null) {
            experience = experienceRepository.findById(request.experienceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));
        }

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .experience(experience)
                .content(request.content())
                .build();

        message = messageRepository.saveAndFlush(message);

        return toResponse(message);
    }

    public List<MessageResponse> listConversation(UUID userId, UUID otherUserId) {
        return messageRepository.findConversation(userId, otherUserId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<MessageResponse> listForExperience(UUID userId, UUID experienceId) {
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));

        boolean isOwningCompany = experience.getCompany().getUser().getId().equals(userId);

        boolean hasWorkspace = learnerProfileRepository.findByUserId(userId)
                .map(learner -> workspaceRepository.existsByExperience_IdAndLearner_Id(experienceId, learner.getId()))
                .orElse(false);

        if (!isOwningCompany && !hasWorkspace) {
            throw new UnauthorizedActionException("You do not have permission to view these messages");
        }

        return messageRepository.findByExperience_IdOrderByCreatedAtAsc(experienceId).stream()
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
                message.getExperience() != null ? message.getExperience().getId() : null,
                message.getContent(),
                message.getCreatedAt()
        );
    }
}