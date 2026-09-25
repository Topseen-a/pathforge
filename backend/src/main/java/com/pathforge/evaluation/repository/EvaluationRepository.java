package com.pathforge.evaluation.repository;

import com.pathforge.evaluation.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EvaluationRepository extends JpaRepository<Evaluation, UUID> {

    Optional<Evaluation> findByExperience_IdAndLearner_Id(UUID experienceId, UUID learnerId);

    List<Evaluation> findByLearner_Id(UUID learnerId);

    boolean existsByExperience_IdAndLearner_Id(UUID experienceId, UUID learnerId);
}