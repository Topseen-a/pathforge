package com.pathforge.skill.controller;

import com.pathforge.security.UserPrincipal;
import com.pathforge.skill.dto.request.ExperienceSkillRequest;
import com.pathforge.skill.dto.response.ExperienceSkillResponse;
import com.pathforge.skill.service.ExperienceSkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/experiences/{experienceId}/skills")
@RequiredArgsConstructor
public class ExperienceSkillController {

    private final ExperienceSkillService experienceSkillService;

    @GetMapping
    public ResponseEntity<List<ExperienceSkillResponse>> listForExperience(@PathVariable UUID experienceId) {
        return ResponseEntity.ok(experienceSkillService.listForExperience(experienceId));
    }

    @PostMapping
    public ResponseEntity<ExperienceSkillResponse> addSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID experienceId,
            @Valid @RequestBody ExperienceSkillRequest request
    ) {
        ExperienceSkillResponse response = experienceSkillService.addSkill(principal.getId(), experienceId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{skillId}")
    public ResponseEntity<Void> removeSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID experienceId,
            @PathVariable UUID skillId
    ) {
        experienceSkillService.removeSkill(principal.getId(), experienceId, skillId);
        return ResponseEntity.noContent().build();
    }
}