package com.pathforge.project.service;

import com.pathforge.application.repository.ApplicationRepository;
import com.pathforge.common.VerificationStatus;
import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.common.exception.UnauthorizedActionException;
import com.pathforge.company.model.Company;
import com.pathforge.company.repository.CompanyRepository;
import com.pathforge.project.dto.request.ProjectRequest;
import com.pathforge.project.dto.response.ProjectResponse;
import com.pathforge.project.model.Project;
import com.pathforge.project.model.ProjectStatus;
import com.pathforge.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional
    public ProjectResponse createProject(UUID userId, ProjectRequest request) {
        Company company = getCompany(userId);

        Project project = Project.builder()
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
                .status(ProjectStatus.DRAFT)
                .applicationDeadline(request.applicationDeadline())
                .maxParticipants(request.maxParticipants() != null ? request.maxParticipants() : 1)
                .evaluationCriteria(request.evaluationCriteria())
                .build();

        project = projectRepository.saveAndFlush(project);

        return toResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(UUID userId, UUID projectId, ProjectRequest request) {
        Project project = getOwnedProject(userId, projectId);

        project.setTitle(request.title());
        project.setDescription(request.description());
        project.setCategory(request.category());
        project.setObjective(request.objective());
        project.setDurationDays(request.durationDays());
        project.setCompensationAmount(request.compensationAmount());
        project.setPaid(request.paid());
        project.setLocation(request.location());
        project.setWorkMode(request.workMode());
        project.setApplicationDeadline(request.applicationDeadline());
        project.setMaxParticipants(request.maxParticipants() != null ? request.maxParticipants() : 1);
        project.setEvaluationCriteria(request.evaluationCriteria());

        project = projectRepository.saveAndFlush(project);

        return toResponse(project);
    }

    @Transactional
    public ProjectResponse publish(UUID userId, UUID projectId) {
        Project project = getOwnedProject(userId, projectId);

        if (project.getStatus() != ProjectStatus.DRAFT) {
            throw new BadRequestException("Only a draft project can be published");
        }

        if (project.getCompany().getVerificationStatus() != VerificationStatus.VERIFIED) {
            throw new BadRequestException("Only verified companies can publish projects");
        }

        project.setStatus(ProjectStatus.PUBLISHED);
        project = projectRepository.saveAndFlush(project);

        return toResponse(project);
    }

    @Transactional
    public ProjectResponse close(UUID userId, UUID projectId) {
        Project project = getOwnedProject(userId, projectId);

        if (project.getStatus() == ProjectStatus.CLOSED
                || project.getStatus() == ProjectStatus.COMPLETED) {
            throw new BadRequestException("This project is already closed");
        }

        project.setStatus(ProjectStatus.CLOSED);
        project = projectRepository.saveAndFlush(project);

        return toResponse(project);
    }

    @Transactional
    public void deleteProject(UUID userId, UUID projectId) {
        Project project = getOwnedProject(userId, projectId);

        if (project.getStatus() != ProjectStatus.DRAFT) {
            throw new BadRequestException("Only a draft project can be deleted");
        }

        if (applicationRepository.existsByProject_Id(projectId)) {
            throw new BadRequestException("Cannot delete an project that already has applications");
        }

        projectRepository.delete(project);
    }

    public ProjectResponse getById(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        return toResponse(project);
    }

    /**
     * Admin-only action: force-closes an project regardless of who owns it,
     * bypassing the normal ownership check (an admin isn't the company). Reuses
     * the existing CLOSED status rather than introducing a separate "removed by
     * admin" state — the status alone won't distinguish a company's own
     * decision to close from an admin moderation action after the fact.
     */
    @Transactional
    public ProjectResponse moderateProject(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        project.setStatus(ProjectStatus.CLOSED);
        project = projectRepository.saveAndFlush(project);

        return toResponse(project);
    }

    public List<ProjectResponse> listPublished() {
        return projectRepository.findByStatus(ProjectStatus.PUBLISHED).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ProjectResponse> listMyProjects(UUID userId) {
        Company company = getCompany(userId);

        return projectRepository.findByCompany_Id(company.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    private Company getCompany(UUID userId) {
        return companyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Complete your company profile before creating projects"));
    }

    private Project getOwnedProject(UUID userId, UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getCompany().getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You do not have permission to modify this project");
        }

        return project;
    }

    private ProjectResponse toResponse(Project project) {
        Company company = project.getCompany();
        return new ProjectResponse(
                project.getId(),
                company.getId(),
                company.getName(),
                project.getTitle(),
                project.getDescription(),
                project.getCategory(),
                project.getObjective(),
                project.getDurationDays(),
                project.getCompensationAmount(),
                project.isPaid(),
                project.getLocation(),
                project.getWorkMode(),
                project.getStatus(),
                project.getApplicationDeadline(),
                project.getMaxParticipants(),
                project.getEvaluationCriteria(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
}