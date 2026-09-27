package com.pathforge.project.controller;

import com.pathforge.project.dto.request.ProjectRequest;
import com.pathforge.project.dto.response.ProjectResponse;
import com.pathforge.project.service.ProjectService;
import com.pathforge.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ProjectRequest request
    ) {
        ProjectResponse response = projectService.createProject(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId,
            @Valid @RequestBody ProjectRequest request
    ) {
        return ResponseEntity.ok(projectService.updateProject(principal.getId(), projectId, request));
    }

    @PostMapping("/{projectId}/publish")
    public ResponseEntity<ProjectResponse> publish(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId
    ) {
        return ResponseEntity.ok(projectService.publish(principal.getId(), projectId));
    }

    @PostMapping("/{projectId}/close")
    public ResponseEntity<ProjectResponse> close(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId
    ) {
        return ResponseEntity.ok(projectService.close(principal.getId(), projectId));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId
    ) {
        projectService.deleteProject(principal.getId(), projectId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getById(@PathVariable UUID projectId) {
        return ResponseEntity.ok(projectService.getById(projectId));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> listPublished() {
        return ResponseEntity.ok(projectService.listPublished());
    }

    @GetMapping("/mine")
    public ResponseEntity<List<ProjectResponse>> listMyProjects(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(projectService.listMyProjects(principal.getId()));
    }
}