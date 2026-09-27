package com.pathforge.evaluation.repository;

import com.pathforge.evaluation.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EvaluationRepository extends JpaRepository<Evaluation, UUID> {

    Optional<Evaluation> findByProject_IdAndTalent_Id(UUID projectId, UUID talentId);

    List<Evaluation> findByTalent_Id(UUID talentId);

    boolean existsByProject_IdAndTalent_Id(UUID projectId, UUID talentId);
}