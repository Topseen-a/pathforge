package com.pathforge.skill.controller;

import com.pathforge.security.UserPrincipal;
import com.pathforge.skill.dto.request.TalentSkillRequest;
import com.pathforge.skill.dto.response.TalentSkillResponse;
import com.pathforge.skill.service.TalentSkillService;
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
@RequestMapping("/api/v1/talents/me/skills")
@RequiredArgsConstructor
public class TalentSkillController {

    private final TalentSkillService talentSkillService;

    @GetMapping
    public ResponseEntity<List<TalentSkillResponse>> listMySkills(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(talentSkillService.listMySkills(principal.getId()));
    }

    @PostMapping
    public ResponseEntity<TalentSkillResponse> addSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody TalentSkillRequest request
    ) {
        TalentSkillResponse response = talentSkillService.addSkill(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{skillId}")
    public ResponseEntity<Void> removeSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID skillId
    ) {
        talentSkillService.removeSkill(principal.getId(), skillId);
        return ResponseEntity.noContent().build();
    }
}