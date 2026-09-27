package com.pathforge.submission.repository;

import com.pathforge.submission.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SubmissionRepository extends JpaRepository<Submission, UUID> {

    List<Submission> findByTask_Id(UUID taskId);

    List<Submission> findByTalent_Id(UUID talentId);

    List<Submission> findByTask_IdAndTalent_IdOrderBySubmittedAtDesc(UUID taskId, UUID talentId);
}