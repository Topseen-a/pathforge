package com.pathforge.talent.repository;

import com.pathforge.talent.model.TalentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TalentProfileRepository extends JpaRepository<TalentProfile, UUID> {

    Optional<TalentProfile> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);
}