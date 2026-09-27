package com.pathforge.task.service;

import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.common.exception.UnauthorizedActionException;
import com.pathforge.project.model.Project;
import com.pathforge.project.repository.ProjectRepository;
import com.pathforge.talent.repository.TalentProfileRepository;
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
    private final ProjectRepository projectRepository;
    private final WorkspaceRepository workspaceRepository;
    private final TalentProfileRepository talentProfileRepository;

    @Transactional
    public TaskResponse createTask(UUID userId, UUID projectId, TaskRequest request) {
        Project project = getOwnedProject(userId, projectId);

        Task task = Task.builder()
                .project(project)
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
                    "A task can only move to SUBMITTED by the talent submitting work");
        }

        task.setStatus(request.status());
        task = taskRepository.saveAndFlush(task);

        return toResponse(task);
    }

    /**
     * Called by SubmissionService when a talent submits work for this task.
     */
    @Transactional
    public void markSubmitted(UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        task.setStatus(TaskStatus.SUBMITTED);
        taskRepository.saveAndFlush(task);
    }

    public List<TaskResponse> listForProject(UUID userId, UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        boolean isOwningCompany = project.getCompany().getUser().getId().equals(userId);

        boolean hasWorkspace = talentProfileRepository.findByUserId(userId)
                .map(talent -> workspaceRepository.existsByProject_IdAndTalent_Id(projectId, talent.getId()))
                .orElse(false);

        if (!isOwningCompany && !hasWorkspace) {
            throw new UnauthorizedActionException("You do not have permission to view these tasks");
        }

        return taskRepository.findByProject_Id(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    private Project getOwnedProject(UUID userId, UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getCompany().getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You do not have permission to modify this project");
        }

        return project;
    }

    private Task getOwnedTask(UUID userId, UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getProject().getCompany().getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You do not have permission to modify this task");
        }

        return task;
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getProject().getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDeadline(),
                task.getStatus(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}