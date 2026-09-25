package com.pathforge.skill.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LearnerSkillRequest(

        @NotBlank(message = "Skill name is required")
        @Size(max = 100, message = "Skill name must be under 100 characters")
        String skillName,

        @Size(max = 100, message = "Category must be under 100 characters")
        String category,

        @Size(max = 20, message = "Proficiency must be under 20 characters")
        String proficiency
) {
}