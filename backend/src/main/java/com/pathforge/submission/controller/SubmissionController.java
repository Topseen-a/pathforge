package com.pathforge.submission.controller;

import com.pathforge.security.UserPrincipal;
import com.pathforge.submission.dto.request.SubmissionRequest;
import com.pathforge.submission.dto.response.SubmissionResponse;
import com.pathforge.submission.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping("/api/v1/tasks/{taskId}/submissions")
    public ResponseEntity<SubmissionResponse> submitWork(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId,
            @Valid @RequestBody SubmissionRequest request
    ) {
        SubmissionResponse response = submissionService.submitWork(principal.getId(), taskId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/v1/tasks/{taskId}/submissions")
    public ResponseEntity<List<SubmissionResponse>> listForTask(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId
    ) {
        return ResponseEntity.ok(submissionService.listForTask(principal.getId(), taskId));
    }

    @GetMapping("/api/v1/tasks/{taskId}/submissions/mine")
    public ResponseEntity<List<SubmissionResponse>> listMySubmissionsForTask(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId
    ) {
        return ResponseEntity.ok(submissionService.listMySubmissionsForTask(principal.getId(), taskId));
    }

    @GetMapping("/api/v1/submissions/mine")
    public ResponseEntity<List<SubmissionResponse>> listMySubmissions(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(submissionService.listMySubmissions(principal.getId()));
    }
}