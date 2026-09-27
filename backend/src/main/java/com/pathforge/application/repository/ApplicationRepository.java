package com.pathforge.application.repository;

import com.pathforge.application.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    List<Application> findByProject_Id(UUID projectId);

    List<Application> findByTalent_Id(UUID talentId);

    boolean existsByProject_IdAndTalent_Id(UUID projectId, UUID talentId);

    boolean existsByProject_Id(UUID projectId);
}