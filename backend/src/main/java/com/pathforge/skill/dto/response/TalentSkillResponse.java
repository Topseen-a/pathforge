package com.pathforge.skill.dto.response;

import java.util.UUID;

public record TalentSkillResponse(
        UUID skillId,
        String name,
        String category,
        String proficiency
) {
}