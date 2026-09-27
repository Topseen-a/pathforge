package com.pathforge.skill.service;

import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.common.exception.UnauthorizedActionException;
import com.pathforge.project.model.Project;
import com.pathforge.project.repository.ProjectRepository;
import com.pathforge.skill.dto.request.ProjectSkillRequest;
import com.pathforge.skill.dto.response.ProjectSkillResponse;
import com.pathforge.skill.model.ProjectSkill;
import com.pathforge.skill.model.ProjectSkillId;
import com.pathforge.skill.model.Skill;
import com.pathforge.skill.repository.ProjectSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectSkillService {

    private final ProjectSkillRepository projectSkillRepository;
    private final ProjectRepository projectRepository;
    private final SkillService skillService;

    public List<ProjectSkillResponse> listForProject(UUID projectId) {
        return projectSkillRepository.findByProject_Id(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ProjectSkillResponse addSkill(UUID userId, UUID projectId, ProjectSkillRequest request) {
        Project project = getOwnedProject(userId, projectId);

        Skill skill = skillService.getOrCreate(request.skillName(), request.category());

        ProjectSkillId id = new ProjectSkillId(project.getId(), skill.getId());

        if (projectSkillRepository.existsById(id)) {
            throw new BadRequestException("This skill is already tagged on this project");
        }

        ProjectSkill projectSkill = ProjectSkill.builder()
                .id(id)
                .project(project)
                .skill(skill)
                .build();

        projectSkill = projectSkillRepository.saveAndFlush(projectSkill);

        return toResponse(projectSkill);
    }

    @Transactional
    public void removeSkill(UUID userId, UUID projectId, UUID skillId) {
        Project project = getOwnedProject(userId, projectId);
        ProjectSkillId id = new ProjectSkillId(project.getId(), skillId);

        if (!projectSkillRepository.existsById(id)) {
            throw new ResourceNotFoundException("This skill is not tagged on this project");
        }

        projectSkillRepository.deleteById(id);
    }

    private Project getOwnedProject(UUID userId, UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getCompany().getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You do not have permission to modify this project");
        }

        return project;
    }

    private ProjectSkillResponse toResponse(ProjectSkill projectSkill) {
        Skill skill = projectSkill.getSkill();
        return new ProjectSkillResponse(skill.getId(), skill.getName(), skill.getCategory());
    }
}