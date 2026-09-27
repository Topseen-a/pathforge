package com.pathforge.workspace.repository;

import com.pathforge.workspace.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {

    Optional<Workspace> findByApplication_Id(UUID applicationId);

    List<Workspace> findByTalent_Id(UUID talentId);

    boolean existsByApplication_Id(UUID applicationId);

    boolean existsByProject_IdAndTalent_Id(UUID projectId, UUID talentId);
}