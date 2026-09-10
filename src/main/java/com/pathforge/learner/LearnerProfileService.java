package com.pathforge.learner;

import com.pathforge.common.Role;
import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.learner.dto.LearnerProfileRequest;
import com.pathforge.learner.dto.LearnerProfileResponse;
import com.pathforge.user.User;
import com.pathforge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LearnerProfileService {

    private final LearnerProfileRepository learnerProfileRepository;
    private final UserRepository userRepository;

    @Transactional
    public LearnerProfileResponse createProfile(UUID userId, LearnerProfileRequest request) {
        if (learnerProfileRepository.existsByUserId(userId)) {
            throw new BadRequestException("A learner profile already exists for this account");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.LEARNER) {
            throw new BadRequestException("Only accounts registered as LEARNER can have a learner profile");
        }

        LearnerProfile profile = LearnerProfile.builder()
                .user(user)
                .bio(request.bio())
                .location(request.location())
                .education(request.education())
                .interests(request.interests())
                .portfolioUrl(request.portfolioUrl())
                .build();

        profile = learnerProfileRepository.save(profile);

        return toResponse(profile, user);
    }

    public LearnerProfileResponse getMyProfile(UUID userId) {
        LearnerProfile profile = learnerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Learner profile not found"));

        return toResponse(profile, profile.getUser());
    }

    public LearnerProfileResponse getById(UUID profileId) {
        LearnerProfile profile = learnerProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Learner profile not found"));

        return toResponse(profile, profile.getUser());
    }

    @Transactional
    public LearnerProfileResponse updateProfile(UUID userId, LearnerProfileRequest request) {
        LearnerProfile profile = learnerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Learner profile not found"));

        profile.setBio(request.bio());
        profile.setLocation(request.location());
        profile.setEducation(request.education());
        profile.setInterests(request.interests());
        profile.setPortfolioUrl(request.portfolioUrl());

        profile = learnerProfileRepository.save(profile);

        return toResponse(profile, profile.getUser());
    }

    private LearnerProfileResponse toResponse(LearnerProfile profile, User user) {
        return new LearnerProfileResponse(
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