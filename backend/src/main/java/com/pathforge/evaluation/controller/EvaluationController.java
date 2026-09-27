package com.pathforge.evaluation.controller;

import com.pathforge.evaluation.dto.request.EvaluationRequest;
import com.pathforge.evaluation.dto.response.EvaluationResponse;
import com.pathforge.evaluation.service.EvaluationService;
import com.pathforge.security.UserPrincipal;
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
public class EvaluationController {

    private final EvaluationService evaluationService;

    @PostMapping("/api/v1/projects/{projectId}/talents/{talentId}/evaluation")
    public ResponseEntity<EvaluationResponse> createEvaluation(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId,
            @PathVariable UUID talentId,
            @Valid @RequestBody EvaluationRequest request
    ) {
        EvaluationResponse response = evaluationService.createEvaluation(
                principal.getId(), projectId, talentId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/v1/projects/{projectId}/talents/{talentId}/evaluation")
    public ResponseEntity<EvaluationResponse> getByProjectAndTalent(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId,
            @PathVariable UUID talentId
    ) {
        return ResponseEntity.ok(
                evaluationService.getByProjectAndTalent(principal.getId(), projectId, talentId));
    }

    @GetMapping("/api/v1/evaluations/mine")
    public ResponseEntity<List<EvaluationResponse>> listMyEvaluations(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(evaluationService.listMyEvaluations(principal.getId()));
    }
}