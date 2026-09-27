package com.pathforge.submission.service;

import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.common.exception.UnauthorizedActionException;
import com.pathforge.talent.model.TalentProfile;
import com.pathforge.talent.repository.TalentProfileRepository;
import com.pathforge.notification.service.NotificationService;
import com.pathforge.submission.dto.request.SubmissionRequest;
import com.pathforge.submission.dto.response.SubmissionResponse;
import com.pathforge.submission.model.Submission;
import com.pathforge.submission.repository.SubmissionRepository;
import com.pathforge.task.model.Task;
import com.pathforge.task.model.TaskStatus;
import com.pathforge.task.repository.TaskRepository;
import com.pathforge.task.service.TaskService;
import com.pathforge.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final TaskRepository taskRepository;
    private final TalentProfileRepository talentProfileRepository;
    private final WorkspaceRepository workspaceRepository;
    private final TaskService taskService;
    private final NotificationService notificationService;

    @Transactional
    public SubmissionResponse submitWork(UUID userId, UUID taskId, SubmissionRequest request) {
        if (!StringUtils.hasText(request.content()) && !StringUtils.hasText(request.fileUrl())) {
            throw new BadRequestException("Provide either content or a file URL for your submission");
        }

        TalentProfile talent = talentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Complete your talent profile before submitting work"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        boolean hasWorkspace = workspaceRepository.existsByProject_IdAndTalent_Id(
                task.getProject().getId(), talent.getId());

        if (!hasWorkspace) {
            throw new UnauthorizedActionException("You do not have access to this task");
        }

        if (task.getStatus() == TaskStatus.APPROVED || task.getStatus() == TaskStatus.COMPLETED) {
            throw new BadRequestException(
                    "This task has already been approved and cannot accept further submissions");
        }

        Submission submission = Submission.builder()
                .task(task)
                .talent(talent)
                .content(request.content())
                .fileUrl(request.fileUrl())
                .build();

        submission = submissionRepository.saveAndFlush(submission);

        taskService.markSubmitted(taskId);

        notificationService.notify(
                task.getProject().getCompany().getUser().getId(),
                "NEW_SUBMISSION",
                talent.getUser().getFullName() + " submitted work for \"" + task.getTitle() + "\""
        );

        return toResponse(submission);
    }

    public List<SubmissionResponse> listForTask(UUID userId, UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getProject().getCompany().getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You do not have permission to view these submissions");
        }

        return submissionRepository.findByTask_Id(taskId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<SubmissionResponse> listMySubmissionsForTask(UUID userId, UUID taskId) {
        TalentProfile talent = talentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Talent profile not found"));

        return submissionRepository.findByTask_IdAndTalent_IdOrderBySubmittedAtDesc(taskId, talent.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<SubmissionResponse> listMySubmissions(UUID userId) {
        TalentProfile talent = talentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Talent profile not found"));

        return submissionRepository.findByTalent_Id(talent.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    private SubmissionResponse toResponse(Submission submission) {
        return new SubmissionResponse(
                submission.getId(),
                submission.getTask().getId(),
                submission.getTask().getTitle(),
                submission.getTalent().getId(),
                submission.getTalent().getUser().getFullName(),
                submission.getContent(),
                submission.getFileUrl(),
                submission.getSubmittedAt()
        );
    }
}