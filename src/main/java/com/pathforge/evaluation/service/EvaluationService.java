package com.pathforge.evaluation.service;

import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.common.exception.UnauthorizedActionException;
import com.pathforge.evaluation.dto.request.EvaluationRequest;
import com.pathforge.evaluation.dto.response.EvaluationResponse;
import com.pathforge.evaluation.model.Evaluation;
import com.pathforge.evaluation.repository.EvaluationRepository;
import com.pathforge.experience.model.Experience;
import com.pathforge.experience.repository.ExperienceRepository;
import com.pathforge.learner.model.LearnerProfile;
import com.pathforge.learner.repository.LearnerProfileRepository;
import com.pathforge.user.model.User;
import com.pathforge.user.repository.UserRepository;
import com.pathforge.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final ExperienceRepository experienceRepository;
    private final LearnerProfileRepository learnerProfileRepository;
    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository;

    @Transactional
    public EvaluationResponse createEvaluation(
            UUID userId, UUID experienceId, UUID learnerId, EvaluationRequest request
    ) {
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));

        if (!experience.getCompany().getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You do not have permission to evaluate this experience");
        }

        LearnerProfile learner = learnerProfileRepository.findById(learnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Learner not found"));

        boolean hasWorkspace = workspaceRepository.existsByExperience_IdAndLearner_Id(experienceId, learnerId);
        if (!hasWorkspace) {
            throw new BadRequestException("This learner was never accepted onto this experience");
        }

        if (evaluationRepository.existsByExperience_IdAndLearner_Id(experienceId, learnerId)) {
            throw new BadRequestException("This learner has already been evaluated for this experience");
        }

        User evaluator = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluator not found"));

        Evaluation evaluation = Evaluation.builder()
                .experience(experience)
                .learner(learner)
                .evaluator(evaluator)
                .overallRating(request.overallRating())
                .qualityRating(request.qualityRating())
                .communicationRating(request.communicationRating())
                .professionalismRating(request.professionalismRating())
                .feedback(request.feedback())
                .build();

        evaluation = evaluationRepository.saveAndFlush(evaluation);

        return toResponse(evaluation);
    }

    public EvaluationResponse getByExperienceAndLearner(UUID userId, UUID experienceId, UUID learnerId) {
        Evaluation evaluation = evaluationRepository.findByExperience_IdAndLearner_Id(experienceId, learnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found"));

        boolean isEvaluatedLearner = evaluation.getLearner().getUser().getId().equals(userId);
        boolean isOwningCompany = evaluation.getExperience().getCompany().getUser().getId().equals(userId);

        if (!isEvaluatedLearner && !isOwningCompany) {
            throw new UnauthorizedActionException("You do not have permission to view this evaluation");
        }

        return toResponse(evaluation);
    }

    public List<EvaluationResponse> listMyEvaluations(UUID userId) {
        LearnerProfile learner = learnerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Learner profile not found"));

        return evaluationRepository.findByLearner_Id(learner.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    private EvaluationResponse toResponse(Evaluation evaluation) {
        return new EvaluationResponse(
                evaluation.getId(),
                evaluation.getExperience().getId(),
                evaluation.getExperience().getTitle(),
                evaluation.getLearner().getId(),
                evaluation.getLearner().getUser().getFullName(),
                evaluation.getEvaluator().getId(),
                evaluation.getEvaluator().getFullName(),
                evaluation.getOverallRating(),
                evaluation.getQualityRating(),
                evaluation.getCommunicationRating(),
                evaluation.getProfessionalismRating(),
                evaluation.getFeedback(),
                evaluation.getCreatedAt()
        );
    }
}