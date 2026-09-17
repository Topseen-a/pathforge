package com.pathforge.evaluation.model;

import com.pathforge.common.BaseEntity;
import com.pathforge.experience.model.Experience;
import com.pathforge.learner.model.LearnerProfile;
import com.pathforge.user.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(
        name = "evaluations",
        uniqueConstraints = @UniqueConstraint(columnNames = {"experience_id", "learner_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evaluation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "experience_id", nullable = false)
    private Experience experience;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_id", nullable = false)
    private LearnerProfile learner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluator_id", nullable = false)
    private User evaluator;

    @Column(name = "overall_rating", precision = 3, scale = 2)
    private BigDecimal overallRating;

    @Column(name = "quality_rating", precision = 3, scale = 2)
    private BigDecimal qualityRating;

    @Column(name = "communication_rating", precision = 3, scale = 2)
    private BigDecimal communicationRating;

    @Column(name = "professionalism_rating", precision = 3, scale = 2)
    private BigDecimal professionalismRating;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}