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
import com.pathforge.experience.model.Experience;
import com.pathforge.experience.model.ExperienceStatus;
import com.pathforge.experience.repository.ExperienceRepository;
import com.pathforge.learner.model.LearnerProfile;
import com.pathforge.learner.repository.LearnerProfileRepository;
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
    private final ExperienceRepository experienceRepository;
    private final LearnerProfileRepository learnerProfileRepository;
    private final WorkspaceService workspaceService;

    @Transactional
    public ApplicationResponse apply(UUID userId, UUID experienceId, ApplicationRequest request) {
        LearnerProfile learner = learnerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Complete your learner profile before applying"));

        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));

        if (experience.getStatus() != ExperienceStatus.PUBLISHED) {
            throw new BadRequestException("This experience is not open for applications");
        }

        if (applicationRepository.existsByExperience_IdAndLearner_Id(experienceId, learner.getId())) {
            throw new BadRequestException("You have already applied to this experience");
        }

        Application application = Application.builder()
                .experience(experience)
                .learner(learner)
                .motivation(request.motivation())
                .status(ApplicationStatus.PENDING)
                .build();

        application = applicationRepository.saveAndFlush(application);

        return toResponse(application);
    }

    public List<ApplicationResponse> listForExperience(UUID userId, UUID experienceId) {
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));

        if (!experience.getCompany().getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You do not have permission to view these applications");
        }

        return applicationRepository.findByExperience_Id(experienceId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ApplicationResponse> listMyApplications(UUID userId) {
        LearnerProfile learner = learnerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Complete your learner profile before viewing applications"));

        return applicationRepository.findByLearner_Id(learner.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public ApplicationResponse getById(UUID userId, UUID applicationId) {
        Application application = getApplication(applicationId);

        boolean isApplicant = application.getLearner().getUser().getId().equals(userId);
        boolean isOwningCompany = application.getExperience().getCompany().getUser().getId().equals(userId);

        if (!isApplicant && !isOwningCompany) {
            throw new UnauthorizedActionException("You do not have permission to view this application");
        }

        return toResponse(application);
    }

    @Transactional
    public ApplicationResponse decide(UUID userId, UUID applicationId, ApplicationDecisionRequest request) {
        Application application = getApplication(applicationId);

        if (!application.getExperience().getCompany().getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You do not have permission to decide on this application");
        }

        if (request.status() == ApplicationStatus.PENDING) {
            throw new BadRequestException("Cannot set an application back to PENDING");
        }

        application.setStatus(request.status());
        application = applicationRepository.saveAndFlush(application);

        if (request.status() == ApplicationStatus.ACCEPTED) {
            workspaceService.createForApplication(application);
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
                application.getExperience().getId(),
                application.getExperience().getTitle(),
                application.getLearner().getId(),
                application.getLearner().getUser().getFullName(),
                application.getMotivation(),
                application.getStatus(),
                application.getCreatedAt(),
                application.getUpdatedAt()
        );
    }
}