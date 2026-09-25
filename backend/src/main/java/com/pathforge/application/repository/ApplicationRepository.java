package com.pathforge.application.repository;

import com.pathforge.application.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    List<Application> findByExperience_Id(UUID experienceId);

    List<Application> findByLearner_Id(UUID learnerId);

    boolean existsByExperience_IdAndLearner_Id(UUID experienceId, UUID learnerId);

    boolean existsByExperience_Id(UUID experienceId);
}