package com.pathforge.skill.repository;

import com.pathforge.skill.model.LearnerSkill;
import com.pathforge.skill.model.LearnerSkillId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LearnerSkillRepository extends JpaRepository<LearnerSkill, LearnerSkillId> {

    List<LearnerSkill> findByLearner_Id(UUID learnerId);
}