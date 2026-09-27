package com.pathforge.skill.repository;

import com.pathforge.skill.model.TalentSkill;
import com.pathforge.skill.model.TalentSkillId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TalentSkillRepository extends JpaRepository<TalentSkill, TalentSkillId> {

    List<TalentSkill> findByTalent_Id(UUID talentId);
}