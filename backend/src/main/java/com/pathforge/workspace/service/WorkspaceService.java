package com.pathforge.workspace.service;

import com.pathforge.application.model.Application;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.common.exception.UnauthorizedActionException;
import com.pathforge.talent.model.TalentProfile;
import com.pathforge.talent.repository.TalentProfileRepository;
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
    private final TalentProfileRepository talentProfileRepository;

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
                                .project(application.getProject())
                                .talent(application.getTalent())
                                .application(application)
                                .build()
                ));
    }

    public List<WorkspaceResponse> listMyWorkspaces(UUID userId) {
        TalentProfile talent = talentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Talent profile not found"));

        return workspaceRepository.findByTalent_Id(talent.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public WorkspaceResponse getById(UUID userId, UUID workspaceId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        boolean isTalent = workspace.getTalent().getUser().getId().equals(userId);
        boolean isOwningCompany = workspace.getProject().getCompany().getUser().getId().equals(userId);

        if (!isTalent && !isOwningCompany) {
            throw new UnauthorizedActionException("You do not have permission to view this workspace");
        }

        return toResponse(workspace);
    }

    private WorkspaceResponse toResponse(Workspace workspace) {
        return new WorkspaceResponse(
                workspace.getId(),
                workspace.getProject().getId(),
                workspace.getProject().getTitle(),
                workspace.getProject().getCompany().getId(),
                workspace.getProject().getCompany().getName(),
                workspace.getTalent().getId(),
                workspace.getTalent().getUser().getFullName(),
                workspace.getApplication().getId(),
                workspace.getCreatedAt()
        );
    }
}