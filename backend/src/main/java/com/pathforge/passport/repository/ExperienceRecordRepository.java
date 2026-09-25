package com.pathforge.passport.repository;

import com.pathforge.passport.model.ExperienceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ExperienceRecordRepository extends JpaRepository<ExperienceRecord, UUID> {

    List<ExperienceRecord> findByLearner_Id(UUID learnerId);

    Optional<ExperienceRecord> findByEvaluation_Id(UUID evaluationId);

    boolean existsByEvaluation_Id(UUID evaluationId);

    Optional<ExperienceRecord> findByVerificationCode(String verificationCode);
}