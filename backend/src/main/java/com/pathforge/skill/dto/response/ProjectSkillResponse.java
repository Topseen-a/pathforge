package com.pathforge.skill.dto.response;

import java.util.UUID;

public record ProjectSkillResponse(
        UUID skillId,
        String name,
        String category
) {
}