package com.pathforge.evaluation.service;

import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.common.exception.UnauthorizedActionException;
import com.pathforge.evaluation.dto.request.EvaluationRequest;
import com.pathforge.evaluation.dto.response.EvaluationResponse;
import com.pathforge.evaluation.model.Evaluation;
import com.pathforge.evaluation.repository.EvaluationRepository;
import com.pathforge.project.model.Project;
import com.pathforge.project.repository.ProjectRepository;
import com.pathforge.talent.model.TalentProfile;
import com.pathforge.talent.repository.TalentProfileRepository;
import com.pathforge.passport.service.ExperienceRecordService;
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
    private final ProjectRepository projectRepository;
    private final TalentProfileRepository talentProfileRepository;
    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository;
    private final ExperienceRecordService experienceRecordService;

    @Transactional
    public EvaluationResponse createEvaluation(
            UUID userId, UUID projectId, UUID talentId, EvaluationRequest request
    ) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getCompany().getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You do not have permission to evaluate this project");
        }

        TalentProfile talent = talentProfileRepository.findById(talentId)
                .orElseThrow(() -> new ResourceNotFoundException("Talent not found"));

        boolean hasWorkspace = workspaceRepository.existsByProject_IdAndTalent_Id(projectId, talentId);
        if (!hasWorkspace) {
            throw new BadRequestException("This talent was never accepted onto this project");
        }

        if (evaluationRepository.existsByProject_IdAndTalent_Id(projectId, talentId)) {
            throw new BadRequestException("This talent has already been evaluated for this project");
        }

        User evaluator = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluator not found"));

        Evaluation evaluation = Evaluation.builder()
                .project(project)
                .talent(talent)
                .evaluator(evaluator)
                .overallRating(request.overallRating())
                .qualityRating(request.qualityRating())
                .communicationRating(request.communicationRating())
                .professionalismRating(request.professionalismRating())
                .feedback(request.feedback())
                .build();

        evaluation = evaluationRepository.saveAndFlush(evaluation);

        experienceRecordService.createFromEvaluation(evaluation);

        return toResponse(evaluation);
    }

    public EvaluationResponse getByProjectAndTalent(UUID userId, UUID projectId, UUID talentId) {
        Evaluation evaluation = evaluationRepository.findByProject_IdAndTalent_Id(projectId, talentId)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found"));

        boolean isEvaluatedTalent = evaluation.getTalent().getUser().getId().equals(userId);
        boolean isOwningCompany = evaluation.getProject().getCompany().getUser().getId().equals(userId);

        if (!isEvaluatedTalent && !isOwningCompany) {
            throw new UnauthorizedActionException("You do not have permission to view this evaluation");
        }

        return toResponse(evaluation);
    }

    public List<EvaluationResponse> listMyEvaluations(UUID userId) {
        TalentProfile talent = talentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Talent profile not found"));

        return evaluationRepository.findByTalent_Id(talent.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    private EvaluationResponse toResponse(Evaluation evaluation) {
        return new EvaluationResponse(
                evaluation.getId(),
                evaluation.getProject().getId(),
                evaluation.getProject().getTitle(),
                evaluation.getTalent().getId(),
                evaluation.getTalent().getUser().getFullName(),
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