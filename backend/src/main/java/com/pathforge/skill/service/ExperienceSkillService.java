package com.pathforge.skill.service;

import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.common.exception.UnauthorizedActionException;
import com.pathforge.experience.model.Experience;
import com.pathforge.experience.repository.ExperienceRepository;
import com.pathforge.skill.dto.request.ExperienceSkillRequest;
import com.pathforge.skill.dto.response.ExperienceSkillResponse;
import com.pathforge.skill.model.ExperienceSkill;
import com.pathforge.skill.model.ExperienceSkillId;
import com.pathforge.skill.model.Skill;
import com.pathforge.skill.repository.ExperienceSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExperienceSkillService {

    private final ExperienceSkillRepository experienceSkillRepository;
    private final ExperienceRepository experienceRepository;
    private final SkillService skillService;

    public List<ExperienceSkillResponse> listForExperience(UUID experienceId) {
        return experienceSkillRepository.findByExperience_Id(experienceId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ExperienceSkillResponse addSkill(UUID userId, UUID experienceId, ExperienceSkillRequest request) {
        Experience experience = getOwnedExperience(userId, experienceId);

        Skill skill = skillService.getOrCreate(request.skillName(), request.category());

        ExperienceSkillId id = new ExperienceSkillId(experience.getId(), skill.getId());

        if (experienceSkillRepository.existsById(id)) {
            throw new BadRequestException("This skill is already tagged on this experience");
        }

        ExperienceSkill experienceSkill = ExperienceSkill.builder()
                .id(id)
                .experience(experience)
                .skill(skill)
                .build();

        experienceSkill = experienceSkillRepository.saveAndFlush(experienceSkill);

        return toResponse(experienceSkill);
    }

    @Transactional
    public void removeSkill(UUID userId, UUID experienceId, UUID skillId) {
        Experience experience = getOwnedExperience(userId, experienceId);
        ExperienceSkillId id = new ExperienceSkillId(experience.getId(), skillId);

        if (!experienceSkillRepository.existsById(id)) {
            throw new ResourceNotFoundException("This skill is not tagged on this experience");
        }

        experienceSkillRepository.deleteById(id);
    }

    private Experience getOwnedExperience(UUID userId, UUID experienceId) {
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));

        if (!experience.getCompany().getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You do not have permission to modify this experience");
        }

        return experience;
    }

    private ExperienceSkillResponse toResponse(ExperienceSkill experienceSkill) {
        Skill skill = experienceSkill.getSkill();
        return new ExperienceSkillResponse(skill.getId(), skill.getName(), skill.getCategory());
    }
}