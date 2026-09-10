package com.pathforge.company.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CompanyRequest(

        @NotBlank(message = "Company name is required")
        @Size(max = 150, message = "Company name must be under 150 characters")
        String name,

        @Size(max = 2000, message = "Description must be under 2000 characters")
        String description,

        @Size(max = 255, message = "Website must be under 255 characters")
        String website,

        @Size(max = 100, message = "Business registration number must be under 100 characters")
        String businessRegistrationNo
) {
}