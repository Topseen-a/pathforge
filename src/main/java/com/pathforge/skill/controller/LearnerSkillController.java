package com.pathforge.skill.controller;

import com.pathforge.security.UserPrincipal;
import com.pathforge.skill.dto.request.LearnerSkillRequest;
import com.pathforge.skill.dto.response.LearnerSkillResponse;
import com.pathforge.skill.service.LearnerSkillService;
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
@RequestMapping("/api/v1/learners/me/skills")
@RequiredArgsConstructor
public class LearnerSkillController {

    private final LearnerSkillService learnerSkillService;

    @GetMapping
    public ResponseEntity<List<LearnerSkillResponse>> listMySkills(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(learnerSkillService.listMySkills(principal.getId()));
    }

    @PostMapping
    public ResponseEntity<LearnerSkillResponse> addSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody LearnerSkillRequest request
    ) {
        LearnerSkillResponse response = learnerSkillService.addSkill(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{skillId}")
    public ResponseEntity<Void> removeSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID skillId
    ) {
        learnerSkillService.removeSkill(principal.getId(), skillId);
        return ResponseEntity.noContent().build();
    }
}