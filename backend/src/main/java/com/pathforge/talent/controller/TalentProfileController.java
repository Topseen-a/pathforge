package com.pathforge.talent.controller;

import com.pathforge.talent.dto.request.TalentProfileRequest;
import com.pathforge.talent.dto.response.TalentProfileResponse;
import com.pathforge.talent.service.TalentProfileService;
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
@RequestMapping("/api/v1/talents")
@RequiredArgsConstructor
public class TalentProfileController {

    private final TalentProfileService talentProfileService;

    @PostMapping("/me/profile")
    public ResponseEntity<TalentProfileResponse> createMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody TalentProfileRequest request
    ) {
        TalentProfileResponse response = talentProfileService.createProfile(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me/profile")
    public ResponseEntity<TalentProfileResponse> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(talentProfileService.getMyProfile(principal.getId()));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<TalentProfileResponse> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody TalentProfileRequest request
    ) {
        return ResponseEntity.ok(talentProfileService.updateProfile(principal.getId(), request));
    }

    @GetMapping("/{profileId}/profile")
    public ResponseEntity<TalentProfileResponse> getProfileById(@PathVariable UUID profileId) {
        return ResponseEntity.ok(talentProfileService.getById(profileId));
    }
}