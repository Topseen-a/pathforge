package com.pathforge.skill.service;

import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.skill.dto.request.SkillRequest;
import com.pathforge.skill.dto.response.SkillResponse;
import com.pathforge.skill.model.Skill;
import com.pathforge.skill.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SkillService {

    private final SkillRepository skillRepository;

    public List<SkillResponse> listAll() {
        return skillRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public SkillResponse createSkill(SkillRequest request) {
        if (skillRepository.existsByNameIgnoreCase(request.name())) {
            throw new BadRequestException("A skill with this name already exists");
        }

        Skill skill = Skill.builder()
                .name(request.name())
                .category(request.category())
                .build();

        skill = skillRepository.saveAndFlush(skill);

        return toResponse(skill);
    }

    /**
     * Looks up a skill by name (case-insensitive), creating it if it doesn't exist yet.
     * Used by TalentSkillService (and later ProjectSkillService) so talents and
     * companies can reference a skill by name without it needing to already exist
     * in the catalog.
     */
    @Transactional
    public Skill getOrCreate(String name, String category) {
        return skillRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> skillRepository.saveAndFlush(
                        Skill.builder().name(name).category(category).build()
                ));
    }

    Skill getEntityById(UUID skillId) {
        return skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
    }

    private SkillResponse toResponse(Skill skill) {
        return new SkillResponse(skill.getId(), skill.getName(), skill.getCategory());
    }
}