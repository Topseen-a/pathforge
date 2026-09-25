package com.pathforge.experience.controller;

import com.pathforge.experience.dto.request.ExperienceRequest;
import com.pathforge.experience.dto.response.ExperienceResponse;
import com.pathforge.experience.service.ExperienceService;
import com.pathforge.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/experiences")
@RequiredArgsConstructor
public class ExperienceController {

    private final ExperienceService experienceService;

    @PostMapping
    public ResponseEntity<ExperienceResponse> createExperience(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ExperienceRequest request
    ) {
        ExperienceResponse response = experienceService.createExperience(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{experienceId}")
    public ResponseEntity<ExperienceResponse> updateExperience(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID experienceId,
            @Valid @RequestBody ExperienceRequest request
    ) {
        return ResponseEntity.ok(experienceService.updateExperience(principal.getId(), experienceId, request));
    }

    @PostMapping("/{experienceId}/publish")
    public ResponseEntity<ExperienceResponse> publish(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID experienceId
    ) {
        return ResponseEntity.ok(experienceService.publish(principal.getId(), experienceId));
    }

    @PostMapping("/{experienceId}/close")
    public ResponseEntity<ExperienceResponse> close(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID experienceId
    ) {
        return ResponseEntity.ok(experienceService.close(principal.getId(), experienceId));
    }

    @GetMapping("/{experienceId}")
    public ResponseEntity<ExperienceResponse> getById(@PathVariable UUID experienceId) {
        return ResponseEntity.ok(experienceService.getById(experienceId));
    }

    @GetMapping
    public ResponseEntity<List<ExperienceResponse>> listPublished() {
        return ResponseEntity.ok(experienceService.listPublished());
    }

    @GetMapping("/mine")
    public ResponseEntity<List<ExperienceResponse>> listMyExperiences(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(experienceService.listMyExperiences(principal.getId()));
    }
}