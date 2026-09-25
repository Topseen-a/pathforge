package com.pathforge.skill.model;

import com.pathforge.learner.model.LearnerProfile;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "learner_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerSkill {

    @EmbeddedId
    private LearnerSkillId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("learnerId")
    @JoinColumn(name = "learner_id")
    private LearnerProfile learner;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("skillId")
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @Column(length = 20)
    private String proficiency;
}