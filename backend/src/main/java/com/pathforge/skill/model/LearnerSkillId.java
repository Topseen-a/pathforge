package com.pathforge.skill.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LearnerSkillId implements Serializable {

    private UUID learnerId;
    private UUID skillId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LearnerSkillId that)) return false;
        return Objects.equals(learnerId, that.learnerId) && Objects.equals(skillId, that.skillId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(learnerId, skillId);
    }
}