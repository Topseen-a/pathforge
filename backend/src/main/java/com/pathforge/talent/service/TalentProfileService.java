package com.pathforge.talent.service;

import com.pathforge.common.Role;
import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.talent.dto.request.TalentProfileRequest;
import com.pathforge.talent.dto.response.TalentProfileResponse;
import com.pathforge.talent.model.TalentProfile;
import com.pathforge.talent.repository.TalentProfileRepository;
import com.pathforge.user.model.User;
import com.pathforge.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TalentProfileService {

    private final TalentProfileRepository talentProfileRepository;
    private final UserRepository userRepository;

    @Transactional
    public TalentProfileResponse createProfile(UUID userId, TalentProfileRequest request) {
        if (talentProfileRepository.existsByUserId(userId)) {
            throw new BadRequestException("A talent profile already exists for this account");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.TALENT) {
            throw new BadRequestException("Only accounts registered as TALENT can have a talent profile");
        }

        TalentProfile profile = TalentProfile.builder()
                .user(user)
                .bio(request.bio())
                .location(request.location())
                .education(request.education())
                .interests(request.interests())
                .portfolioUrl(request.portfolioUrl())
                .build();

        profile = talentProfileRepository.saveAndFlush(profile);

        return toResponse(profile, user);
    }

    public TalentProfileResponse getMyProfile(UUID userId) {
        TalentProfile profile = talentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Talent profile not found"));

        return toResponse(profile, profile.getUser());
    }

    public TalentProfileResponse getById(UUID profileId) {
        TalentProfile profile = talentProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Talent profile not found"));

        return toResponse(profile, profile.getUser());
    }

    @Transactional
    public TalentProfileResponse updateProfile(UUID userId, TalentProfileRequest request) {
        TalentProfile profile = talentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Talent profile not found"));

        profile.setBio(request.bio());
        profile.setLocation(request.location());
        profile.setEducation(request.education());
        profile.setInterests(request.interests());
        profile.setPortfolioUrl(request.portfolioUrl());

        profile = talentProfileRepository.saveAndFlush(profile);

        return toResponse(profile, profile.getUser());
    }

    private TalentProfileResponse toResponse(TalentProfile profile, User user) {
        return new TalentProfileResponse(
                profile.getId(),
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                profile.getBio(),
                profile.getLocation(),
                profile.getEducation(),
                profile.getInterests(),
                profile.getPortfolioUrl(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}