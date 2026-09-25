package com.pathforge.experience.service;

import com.pathforge.application.repository.ApplicationRepository;
import com.pathforge.common.VerificationStatus;
import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.common.exception.UnauthorizedActionException;
import com.pathforge.company.model.Company;
import com.pathforge.company.repository.CompanyRepository;
import com.pathforge.experience.dto.request.ExperienceRequest;
import com.pathforge.experience.dto.response.ExperienceResponse;
import com.pathforge.experience.model.Experience;
import com.pathforge.experience.model.ExperienceStatus;
import com.pathforge.experience.repository.ExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExperienceService {

    private final ExperienceRepository experienceRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional
    public ExperienceResponse createExperience(UUID userId, ExperienceRequest request) {
        Company company = getCompany(userId);

        Experience experience = Experience.builder()
                .company(company)
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .objective(request.objective())
                .durationDays(request.durationDays())
                .compensationAmount(request.compensationAmount())
                .paid(request.paid())
                .location(request.location())
                .workMode(request.workMode())
                .status(ExperienceStatus.DRAFT)
                .applicationDeadline(request.applicationDeadline())
                .maxParticipants(request.maxParticipants() != null ? request.maxParticipants() : 1)
                .evaluationCriteria(request.evaluationCriteria())
                .build();

        experience = experienceRepository.saveAndFlush(experience);

        return toResponse(experience);
    }

    @Transactional
    public ExperienceResponse updateExperience(UUID userId, UUID experienceId, ExperienceRequest request) {
        Experience experience = getOwnedExperience(userId, experienceId);

        experience.setTitle(request.title());
        experience.setDescription(request.description());
        experience.setCategory(request.category());
        experience.setObjective(request.objective());
        experience.setDurationDays(request.durationDays());
        experience.setCompensationAmount(request.compensationAmount());
        experience.setPaid(request.paid());
        experience.setLocation(request.location());
        experience.setWorkMode(request.workMode());
        experience.setApplicationDeadline(request.applicationDeadline());
        experience.setMaxParticipants(request.maxParticipants() != null ? request.maxParticipants() : 1);
        experience.setEvaluationCriteria(request.evaluationCriteria());

        experience = experienceRepository.saveAndFlush(experience);

        return toResponse(experience);
    }

    @Transactional
    public ExperienceResponse publish(UUID userId, UUID experienceId) {
        Experience experience = getOwnedExperience(userId, experienceId);

        if (experience.getStatus() != ExperienceStatus.DRAFT) {
            throw new BadRequestException("Only a draft experience can be published");
        }

        if (experience.getCompany().getVerificationStatus() != VerificationStatus.VERIFIED) {
            throw new BadRequestException("Only verified companies can publish experiences");
        }

        experience.setStatus(ExperienceStatus.PUBLISHED);
        experience = experienceRepository.saveAndFlush(experience);

        return toResponse(experience);
    }

    @Transactional
    public ExperienceResponse close(UUID userId, UUID experienceId) {
        Experience experience = getOwnedExperience(userId, experienceId);

        if (experience.getStatus() == ExperienceStatus.CLOSED
                || experience.getStatus() == ExperienceStatus.COMPLETED) {
            throw new BadRequestException("This experience is already closed");
        }

        experience.setStatus(ExperienceStatus.CLOSED);
        experience = experienceRepository.saveAndFlush(experience);

        return toResponse(experience);
    }

    @Transactional
    public void deleteExperience(UUID userId, UUID experienceId) {
        Experience experience = getOwnedExperience(userId, experienceId);

        if (experience.getStatus() != ExperienceStatus.DRAFT) {
            throw new BadRequestException("Only a draft experience can be deleted");
        }

        if (applicationRepository.existsByExperience_Id(experienceId)) {
            throw new BadRequestException("Cannot delete an experience that already has applications");
        }

        experienceRepository.delete(experience);
    }

    public ExperienceResponse getById(UUID experienceId) {
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));

        return toResponse(experience);
    }

    /**
     * Admin-only action: force-closes an experience regardless of who owns it,
     * bypassing the normal ownership check (an admin isn't the company). Reuses
     * the existing CLOSED status rather than introducing a separate "removed by
     * admin" state — the status alone won't distinguish a company's own
     * decision to close from an admin moderation action after the fact.
     */
    @Transactional
    public ExperienceResponse moderateExperience(UUID experienceId) {
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));

        experience.setStatus(ExperienceStatus.CLOSED);
        experience = experienceRepository.saveAndFlush(experience);

        return toResponse(experience);
    }

    public List<ExperienceResponse> listPublished() {
        return experienceRepository.findByStatus(ExperienceStatus.PUBLISHED).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ExperienceResponse> listMyExperiences(UUID userId) {
        Company company = getCompany(userId);

        return experienceRepository.findByCompany_Id(company.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    private Company getCompany(UUID userId) {
        return companyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Complete your company profile before creating experiences"));
    }

    private Experience getOwnedExperience(UUID userId, UUID experienceId) {
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));

        if (!experience.getCompany().getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You do not have permission to modify this experience");
        }

        return experience;
    }

    private ExperienceResponse toResponse(Experience experience) {
        Company company = experience.getCompany();
        return new ExperienceResponse(
                experience.getId(),
                company.getId(),
                company.getName(),
                experience.getTitle(),
                experience.getDescription(),
                experience.getCategory(),
                experience.getObjective(),
                experience.getDurationDays(),
                experience.getCompensationAmount(),
                experience.isPaid(),
                experience.getLocation(),
                experience.getWorkMode(),
                experience.getStatus(),
                experience.getApplicationDeadline(),
                experience.getMaxParticipants(),
                experience.getEvaluationCriteria(),
                experience.getCreatedAt(),
                experience.getUpdatedAt()
        );
    }
}