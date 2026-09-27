package com.pathforge.skill.controller;

import com.pathforge.security.UserPrincipal;
import com.pathforge.skill.dto.request.ProjectSkillRequest;
import com.pathforge.skill.dto.response.ProjectSkillResponse;
import com.pathforge.skill.service.ProjectSkillService;
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
@RequestMapping("/api/v1/projects/{projectId}/skills")
@RequiredArgsConstructor
public class ProjectSkillController {

    private final ProjectSkillService projectSkillService;

    @GetMapping
    public ResponseEntity<List<ProjectSkillResponse>> listForProject(@PathVariable UUID projectId) {
        return ResponseEntity.ok(projectSkillService.listForProject(projectId));
    }

    @PostMapping
    public ResponseEntity<ProjectSkillResponse> addSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId,
            @Valid @RequestBody ProjectSkillRequest request
    ) {
        ProjectSkillResponse response = projectSkillService.addSkill(principal.getId(), projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{skillId}")
    public ResponseEntity<Void> removeSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId,
            @PathVariable UUID skillId
    ) {
        projectSkillService.removeSkill(principal.getId(), projectId, skillId);
        return ResponseEntity.noContent().build();
    }
}