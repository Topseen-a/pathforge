package com.pathforge.skill.service;

import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.learner.model.LearnerProfile;
import com.pathforge.learner.repository.LearnerProfileRepository;
import com.pathforge.skill.dto.request.LearnerSkillRequest;
import com.pathforge.skill.dto.response.LearnerSkillResponse;
import com.pathforge.skill.model.LearnerSkill;
import com.pathforge.skill.model.LearnerSkillId;
import com.pathforge.skill.model.Skill;
import com.pathforge.skill.repository.LearnerSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LearnerSkillService {

    private final LearnerSkillRepository learnerSkillRepository;
    private final LearnerProfileRepository learnerProfileRepository;
    private final SkillService skillService;

    public List<LearnerSkillResponse> listMySkills(UUID userId) {
        LearnerProfile profile = getProfile(userId);

        return learnerSkillRepository.findByLearner_Id(profile.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public LearnerSkillResponse addSkill(UUID userId, LearnerSkillRequest request) {
        LearnerProfile profile = getProfile(userId);

        Skill skill = skillService.getOrCreate(request.skillName(), request.category());

        LearnerSkillId id = new LearnerSkillId(profile.getId(), skill.getId());

        if (learnerSkillRepository.existsById(id)) {
            throw new BadRequestException("This skill is already on your profile");
        }

        LearnerSkill learnerSkill = LearnerSkill.builder()
                .id(id)
                .learner(profile)
                .skill(skill)
                .proficiency(request.proficiency())
                .build();

        learnerSkill = learnerSkillRepository.saveAndFlush(learnerSkill);

        return toResponse(learnerSkill);
    }

    @Transactional
    public void removeSkill(UUID userId, UUID skillId) {
        LearnerProfile profile = getProfile(userId);
        LearnerSkillId id = new LearnerSkillId(profile.getId(), skillId);

        if (!learnerSkillRepository.existsById(id)) {
            throw new ResourceNotFoundException("This skill is not on your profile");
        }

        learnerSkillRepository.deleteById(id);
    }

    private LearnerProfile getProfile(UUID userId) {
        return learnerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Complete your learner profile before managing skills"));
    }

    private LearnerSkillResponse toResponse(LearnerSkill learnerSkill) {
        Skill skill = learnerSkill.getSkill();
        return new LearnerSkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getCategory(),
                learnerSkill.getProficiency()
        );
    }
}