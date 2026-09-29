package com.pathforge.application.service;

import com.pathforge.application.dto.request.ApplicationDecisionRequest;
import com.pathforge.application.dto.request.ApplicationRequest;
import com.pathforge.application.dto.response.ApplicationResponse;
import com.pathforge.application.model.Application;
import com.pathforge.application.model.ApplicationStatus;
import com.pathforge.application.repository.ApplicationRepository;
import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.common.exception.UnauthorizedActionException;
import com.pathforge.project.model.Project;
import com.pathforge.project.model.ProjectStatus;
import com.pathforge.project.repository.ProjectRepository;
import com.pathforge.talent.model.TalentProfile;
import com.pathforge.talent.repository.TalentProfileRepository;
import com.pathforge.notification.service.NotificationService;
import com.pathforge.workspace.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ProjectRepository projectRepository;
    private final TalentProfileRepository talentProfileRepository;
    private final WorkspaceService workspaceService;
    private final NotificationService notificationService;

    @Transactional
    public ApplicationResponse apply(UUID userId, UUID projectId, ApplicationRequest request) {
        TalentProfile talent = talentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Complete your talent profile before applying"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (project.getStatus() != ProjectStatus.PUBLISHED) {
            throw new BadRequestException("This project is not open for applications");
        }

        if (applicationRepository.existsByProject_IdAndTalent_Id(projectId, talent.getId())) {
            throw new BadRequestException("You have already applied to this project");
        }

        Application application = Application.builder()
                .project(project)
                .talent(talent)
                .motivation(request.motivation())
                .status(ApplicationStatus.PENDING)
                .build();

        application = applicationRepository.saveAndFlush(application);

        notificationService.notify(
                project.getCompany().getUser().getId(),
                "NEW_APPLICATION",
                talent.getUser().getFullName() + " applied to \"" + project.getTitle() + "\""
        );

        return toResponse(application);
    }

    public List<ApplicationResponse> listForProject(UUID userId, UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getCompany().getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You do not have permission to view these applications");
        }

        return applicationRepository.findByProject_Id(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ApplicationResponse> listMyApplications(UUID userId) {
        TalentProfile talent = talentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Complete your talent profile before viewing applications"));

        return applicationRepository.findByTalent_Id(talent.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public ApplicationResponse getById(UUID userId, UUID applicationId) {
        Application application = getApplication(applicationId);

        boolean isApplicant = application.getTalent().getUser().getId().equals(userId);
        boolean isOwningCompany = application.getProject().getCompany().getUser().getId().equals(userId);

        if (!isApplicant && !isOwningCompany) {
            throw new UnauthorizedActionException("You do not have permission to view this application");
        }

        return toResponse(application);
    }

    @Transactional
    public ApplicationResponse decide(UUID userId, UUID applicationId, ApplicationDecisionRequest request) {
        Application application = getApplication(applicationId);

        if (!application.getProject().getCompany().getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You do not have permission to decide on this application");
        }

        if (request.status() == ApplicationStatus.PENDING) {
            throw new BadRequestException("Cannot set an application back to PENDING");
        }

        application.setStatus(request.status());
        application = applicationRepository.saveAndFlush(application);

        if (request.status() == ApplicationStatus.ACCEPTED) {
            workspaceService.createForApplication(application);
            notificationService.notify(
                    application.getTalent().getUser().getId(),
                    "APPLICATION_ACCEPTED",
                    "Your application to \"" + application.getProject().getTitle() + "\" has been accepted!"
            );
        } else if (request.status() == ApplicationStatus.REJECTED) {
            notificationService.notify(
                    application.getTalent().getUser().getId(),
                    "APPLICATION_REJECTED",
                    "Your application to \"" + application.getProject().getTitle() + "\" was not selected this time."
            );
        }

        return toResponse(application);
    }

    private Application getApplication(UUID applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
    }

    private ApplicationResponse toResponse(Application application) {
        return new ApplicationResponse(
                application.getId(),
                application.getProject().getId(),
                application.getProject().getTitle(),
                application.getTalent().getId(),
                application.getTalent().getUser().getFullName(),
                application.getMotivation(),
                application.getStatus(),
                application.getCreatedAt(),
                application.getUpdatedAt()
        );
    }
}