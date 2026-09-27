package com.pathforge.skill.repository;

import com.pathforge.skill.model.ProjectSkill;
import com.pathforge.skill.model.ProjectSkillId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectSkillRepository extends JpaRepository<ProjectSkill, ProjectSkillId> {

    List<ProjectSkill> findByProject_Id(UUID projectId);
}