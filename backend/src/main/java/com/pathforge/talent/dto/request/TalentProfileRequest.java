package com.pathforge.talent.dto.request;

import jakarta.validation.constraints.Size;

public record TalentProfileRequest(

        @Size(max = 2000, message = "Bio must be under 2000 characters")
        String bio,

        @Size(max = 150, message = "Location must be under 150 characters")
        String location,

        @Size(max = 255, message = "Education must be under 255 characters")
        String education,

        @Size(max = 2000, message = "Interests must be under 2000 characters")
        String interests,

        @Size(max = 255, message = "Portfolio URL must be under 255 characters")
        String portfolioUrl
) {
}