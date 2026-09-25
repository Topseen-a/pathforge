package com.pathforge.workspace.service;

import com.pathforge.application.model.Application;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.common.exception.UnauthorizedActionException;
import com.pathforge.learner.model.LearnerProfile;
import com.pathforge.learner.repository.LearnerProfileRepository;
import com.pathforge.workspace.dto.response.WorkspaceResponse;
import com.pathforge.workspace.model.Workspace;
import com.pathforge.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final LearnerProfileRepository learnerProfileRepository;

    /**
     * Called by ApplicationService when a company accepts an application.
     * Idempotent: if a workspace already exists for this application
     * (shouldn't normally happen, but guards against double-acceptance),
     * the existing one is returned instead of creating a duplicate.
     */
    @Transactional
    public Workspace createForApplication(Application application) {
        return workspaceRepository.findByApplication_Id(application.getId())
                .orElseGet(() -> workspaceRepository.saveAndFlush(
                        Workspace.builder()
                                .experience(application.getExperience())
                                .learner(application.getLearner())
                                .application(application)
                                .build()
                ));
    }

    public List<WorkspaceResponse> listMyWorkspaces(UUID userId) {
        LearnerProfile learner = learnerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Learner profile not found"));

        return workspaceRepository.findByLearner_Id(learner.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public WorkspaceResponse getById(UUID userId, UUID workspaceId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        boolean isLearner = workspace.getLearner().getUser().getId().equals(userId);
        boolean isOwningCompany = workspace.getExperience().getCompany().getUser().getId().equals(userId);

        if (!isLearner && !isOwningCompany) {
            throw new UnauthorizedActionException("You do not have permission to view this workspace");
        }

        return toResponse(workspace);
    }

    private WorkspaceResponse toResponse(Workspace workspace) {
        return new WorkspaceResponse(
                workspace.getId(),
                workspace.getExperience().getId(),
                workspace.getExperience().getTitle(),
                workspace.getLearner().getId(),
                workspace.getLearner().getUser().getFullName(),
                workspace.getApplication().getId(),
                workspace.getCreatedAt()
        );
    }
}