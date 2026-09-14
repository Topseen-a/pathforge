package com.pathforge.workspace.controller;

import com.pathforge.security.UserPrincipal;
import com.pathforge.workspace.dto.response.WorkspaceResponse;
import com.pathforge.workspace.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @GetMapping("/mine")
    public ResponseEntity<List<WorkspaceResponse>> listMyWorkspaces(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(workspaceService.listMyWorkspaces(principal.getId()));
    }

    @GetMapping("/{workspaceId}")
    public ResponseEntity<WorkspaceResponse> getById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId
    ) {
        return ResponseEntity.ok(workspaceService.getById(principal.getId(), workspaceId));
    }
}