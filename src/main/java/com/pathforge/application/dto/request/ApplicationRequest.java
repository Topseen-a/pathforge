package com.pathforge.application.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ApplicationRequest(

        @NotBlank(message = "Please tell the company why you're interested")
        String motivation
) {
}