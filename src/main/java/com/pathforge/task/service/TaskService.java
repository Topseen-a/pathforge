package com.pathforge.task.service;

import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.common.exception.UnauthorizedActionException;
import com.pathforge.experience.model.Experience;
import com.pathforge.experience.repository.ExperienceRepository;
import com.pathforge.learner.repository.LearnerProfileRepository;
import com.pathforge.task.dto.request.TaskRequest;
import com.pathforge.task.dto.request.TaskStatusUpdateRequest;
import com.pathforge.task.dto.response.TaskResponse;
import com.pathforge.task.model.Task;
import com.pathforge.task.model.TaskStatus;
import com.pathforge.task.repository.TaskRepository;
import com.pathforge.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;
    private final ExperienceRepository experienceRepository;
    private final WorkspaceRepository workspaceRepository;
    private final LearnerProfileRepository learnerProfileRepository;

    @Transactional
    public TaskResponse createTask(UUID userId, UUID experienceId, TaskRequest request) {
        Experience experience = getOwnedExperience(userId, experienceId);

        Task task = Task.builder()
                .experience(experience)
                .title(request.title())
                .description(request.description())
                .deadline(request.deadline())
                .status(TaskStatus.NOT_STARTED)
                .build();

        task = taskRepository.saveAndFlush(task);

        return toResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(UUID userId, UUID taskId, TaskRequest request) {
        Task task = getOwnedTask(userId, taskId);

        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDeadline(request.deadline());

        task = taskRepository.saveAndFlush(task);

        return toResponse(task);
    }

    @Transactional
    public TaskResponse updateStatus(UUID userId, UUID taskId, TaskStatusUpdateRequest request) {
        Task task = getOwnedTask(userId, taskId);

        if (request.status() == TaskStatus.SUBMITTED) {
            throw new BadRequestException(
                    "A task can only move to SUBMITTED by the learner submitting work");
        }

        task.setStatus(request.status());
        task = taskRepository.saveAndFlush(task);

        return toResponse(task);
    }

    /**
     * Called by SubmissionService when a learner submits work for this task.
     */
    @Transactional
    public void markSubmitted(UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        task.setStatus(TaskStatus.SUBMITTED);
        taskRepository.saveAndFlush(task);
    }

    public List<TaskResponse> listForExperience(UUID userId, UUID experienceId) {
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));

        boolean isOwningCompany = experience.getCompany().getUser().getId().equals(userId);

        boolean hasWorkspace = learnerProfileRepository.findByUserId(userId)
                .map(learner -> workspaceRepository.existsByExperience_IdAndLearner_Id(experienceId, learner.getId()))
                .orElse(false);

        if (!isOwningCompany && !hasWorkspace) {
            throw new UnauthorizedActionException("You do not have permission to view these tasks");
        }

        return taskRepository.findByExperience_Id(experienceId).stream()
                .map(this::toResponse)
                .toList();
    }

    private Experience getOwnedExperience(UUID userId, UUID experienceId) {
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));

        if (!experience.getCompany().getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You do not have permission to modify this experience");
        }

        return experience;
    }

    private Task getOwnedTask(UUID userId, UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getExperience().getCompany().getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You do not have permission to modify this task");
        }

        return task;
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getExperience().getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDeadline(),
                task.getStatus(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}