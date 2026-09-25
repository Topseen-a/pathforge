package com.pathforge.skill.dto.response;

import java.util.UUID;

public record LearnerSkillResponse(
        UUID skillId,
        String name,
        String category,
        String proficiency
) {
}