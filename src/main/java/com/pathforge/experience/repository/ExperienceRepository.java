package com.pathforge.experience.repository;

import com.pathforge.experience.model.Experience;
import com.pathforge.experience.model.ExperienceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExperienceRepository extends JpaRepository<Experience, UUID> {

    List<Experience> findByCompany_Id(UUID companyId);

    List<Experience> findByStatus(ExperienceStatus status);
}