package com.pathforge.task.controller;

import com.pathforge.security.UserPrincipal;
import com.pathforge.task.dto.request.TaskRequest;
import com.pathforge.task.dto.request.TaskStatusUpdateRequest;
import com.pathforge.task.dto.response.TaskResponse;
import com.pathforge.task.service.TaskService;
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
@RequestMapping("/api/v1/experiences/{experienceId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID experienceId,
            @Valid @RequestBody TaskRequest request
    ) {
        TaskResponse response = taskService.createTask(principal.getId(), experienceId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> listForExperience(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID experienceId
    ) {
        return ResponseEntity.ok(taskService.listForExperience(principal.getId(), experienceId));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID experienceId,
            @PathVariable UUID taskId,
            @Valid @RequestBody TaskRequest request
    ) {
        return ResponseEntity.ok(taskService.updateTask(principal.getId(), taskId, request));
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<TaskResponse> updateStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID experienceId,
            @PathVariable UUID taskId,
            @Valid @RequestBody TaskStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(taskService.updateStatus(principal.getId(), taskId, request));
    }
}