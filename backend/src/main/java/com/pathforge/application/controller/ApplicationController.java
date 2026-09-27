package com.pathforge.application.controller;

import com.pathforge.application.dto.request.ApplicationDecisionRequest;
import com.pathforge.application.dto.request.ApplicationRequest;
import com.pathforge.application.dto.response.ApplicationResponse;
import com.pathforge.application.service.ApplicationService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/api/v1/projects/{projectId}/applications")
    public ResponseEntity<ApplicationResponse> apply(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId,
            @Valid @RequestBody ApplicationRequest request
    ) {
        ApplicationResponse response = applicationService.apply(principal.getId(), projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/v1/projects/{projectId}/applications")
    public ResponseEntity<List<ApplicationResponse>> listForProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId
    ) {
        return ResponseEntity.ok(applicationService.listForProject(principal.getId(), projectId));
    }

    @GetMapping("/api/v1/applications/mine")
    public ResponseEntity<List<ApplicationResponse>> listMyApplications(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(applicationService.listMyApplications(principal.getId()));
    }

    @GetMapping("/api/v1/applications/{applicationId}")
    public ResponseEntity<ApplicationResponse> getById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID applicationId
    ) {
        return ResponseEntity.ok(applicationService.getById(principal.getId(), applicationId));
    }

    @PutMapping("/api/v1/applications/{applicationId}/decision")
    public ResponseEntity<ApplicationResponse> decide(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID applicationId,
            @Valid @RequestBody ApplicationDecisionRequest request
    ) {
        return ResponseEntity.ok(applicationService.decide(principal.getId(), applicationId, request));
    }
}