package com.pathforge.project.repository;

import com.pathforge.project.model.Project;
import com.pathforge.project.model.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByCompany_Id(UUID companyId);

    List<Project> findByStatus(ProjectStatus status);
}