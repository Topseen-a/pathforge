package com.pathforge.skill.service;

import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.talent.model.TalentProfile;
import com.pathforge.talent.repository.TalentProfileRepository;
import com.pathforge.skill.dto.request.TalentSkillRequest;
import com.pathforge.skill.dto.response.TalentSkillResponse;
import com.pathforge.skill.model.TalentSkill;
import com.pathforge.skill.model.TalentSkillId;
import com.pathforge.skill.model.Skill;
import com.pathforge.skill.repository.TalentSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TalentSkillService {

    private final TalentSkillRepository talentSkillRepository;
    private final TalentProfileRepository talentProfileRepository;
    private final SkillService skillService;

    public List<TalentSkillResponse> listMySkills(UUID userId) {
        TalentProfile profile = getProfile(userId);

        return talentSkillRepository.findByTalent_Id(profile.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TalentSkillResponse addSkill(UUID userId, TalentSkillRequest request) {
        TalentProfile profile = getProfile(userId);

        Skill skill = skillService.getOrCreate(request.skillName(), request.category());

        TalentSkillId id = new TalentSkillId(profile.getId(), skill.getId());

        if (talentSkillRepository.existsById(id)) {
            throw new BadRequestException("This skill is already on your profile");
        }

        TalentSkill talentSkill = TalentSkill.builder()
                .id(id)
                .talent(profile)
                .skill(skill)
                .proficiency(request.proficiency())
                .build();

        talentSkill = talentSkillRepository.saveAndFlush(talentSkill);

        return toResponse(talentSkill);
    }

    @Transactional
    public void removeSkill(UUID userId, UUID skillId) {
        TalentProfile profile = getProfile(userId);
        TalentSkillId id = new TalentSkillId(profile.getId(), skillId);

        if (!talentSkillRepository.existsById(id)) {
            throw new ResourceNotFoundException("This skill is not on your profile");
        }

        talentSkillRepository.deleteById(id);
    }

    private TalentProfile getProfile(UUID userId) {
        return talentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Complete your talent profile before managing skills"));
    }

    private TalentSkillResponse toResponse(TalentSkill talentSkill) {
        Skill skill = talentSkill.getSkill();
        return new TalentSkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getCategory(),
                talentSkill.getProficiency()
        );
    }
}