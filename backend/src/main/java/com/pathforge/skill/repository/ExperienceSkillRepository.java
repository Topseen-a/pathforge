package com.pathforge.skill.repository;

import com.pathforge.skill.model.ExperienceSkill;
import com.pathforge.skill.model.ExperienceSkillId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExperienceSkillRepository extends JpaRepository<ExperienceSkill, ExperienceSkillId> {

    List<ExperienceSkill> findByExperience_Id(UUID experienceId);
}