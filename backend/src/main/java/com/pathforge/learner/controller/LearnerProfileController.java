package com.pathforge.learner.controller;

import com.pathforge.learner.dto.request.LearnerProfileRequest;
import com.pathforge.learner.dto.response.LearnerProfileResponse;
import com.pathforge.learner.service.LearnerProfileService;
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

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/learners")
@RequiredArgsConstructor
public class LearnerProfileController {

    private final LearnerProfileService learnerProfileService;

    @PostMapping("/me/profile")
    public ResponseEntity<LearnerProfileResponse> createMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody LearnerProfileRequest request
    ) {
        LearnerProfileResponse response = learnerProfileService.createProfile(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me/profile")
    public ResponseEntity<LearnerProfileResponse> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(learnerProfileService.getMyProfile(principal.getId()));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<LearnerProfileResponse> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody LearnerProfileRequest request
    ) {
        return ResponseEntity.ok(learnerProfileService.updateProfile(principal.getId(), request));
    }

    @GetMapping("/{profileId}/profile")
    public ResponseEntity<LearnerProfileResponse> getProfileById(@PathVariable UUID profileId) {
        return ResponseEntity.ok(learnerProfileService.getById(profileId));
    }
}