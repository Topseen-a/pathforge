package com.pathforge.auth.dto;

import com.pathforge.common.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank(message = "Full name is required")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        String phoneNumber,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String password,

        // Self-registration is restricted to LEARNER / COMPANY at the service layer —
        // ADMIN accounts are provisioned separately, never through this endpoint.
        @NotNull(message = "Role is required")
        Role role
) {
}