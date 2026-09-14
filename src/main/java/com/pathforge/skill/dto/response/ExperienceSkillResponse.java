package com.pathforge.skill.dto.response;

import java.util.UUID;

public record ExperienceSkillResponse(
        UUID skillId,
        String name,
        String category
) {
}