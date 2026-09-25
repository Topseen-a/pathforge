package com.pathforge.passport.controller;

import com.pathforge.passport.dto.response.ExperienceRecordResponse;
import com.pathforge.passport.service.ExperienceRecordService;
import com.pathforge.security.UserPrincipal;
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
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ExperienceRecordController {

    private final ExperienceRecordService experienceRecordService;

    @GetMapping("/passport/mine")
    public ResponseEntity<List<ExperienceRecordResponse>> getMyPassport(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(experienceRecordService.getMyPassport(principal.getId()));
    }

    @GetMapping("/passport/{recordId}")
    public ResponseEntity<ExperienceRecordResponse> getById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID recordId
    ) {
        return ResponseEntity.ok(experienceRecordService.getById(principal.getId(), recordId));
    }

    @GetMapping("/verify/{verificationCode}")
    public ResponseEntity<ExperienceRecordResponse> verifyByCode(@PathVariable String verificationCode) {
        return ResponseEntity.ok(experienceRecordService.verifyByCode(verificationCode));
    }
}