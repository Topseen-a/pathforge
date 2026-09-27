package com.pathforge.passport.service;

import com.pathforge.common.VerificationStatus;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.common.exception.UnauthorizedActionException;
import com.pathforge.evaluation.model.Evaluation;
import com.pathforge.talent.model.TalentProfile;
import com.pathforge.talent.repository.TalentProfileRepository;
import com.pathforge.passport.dto.response.ExperienceRecordResponse;
import com.pathforge.passport.model.ExperienceRecord;
import com.pathforge.passport.repository.ExperienceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExperienceRecordService {

    private final ExperienceRecordRepository experienceRecordRepository;
    private final TalentProfileRepository talentProfileRepository;

    /**
     * Called by EvaluationService when a company submits an evaluation.
     * Idempotent: returns the existing record if one is already there.
     * The completed evaluation itself is treated as the required
     * verification process (BR-009), so the record is marked VERIFIED
     * immediately rather than waiting on a separate admin approval step.
     */
    @Transactional
    public ExperienceRecord createFromEvaluation(Evaluation evaluation) {
        return experienceRecordRepository.findByEvaluation_Id(evaluation.getId())
                .orElseGet(() -> experienceRecordRepository.saveAndFlush(
                        ExperienceRecord.builder()
                                .talent(evaluation.getTalent())
                                .project(evaluation.getProject())
                                .evaluation(evaluation)
                                .verificationStatus(VerificationStatus.VERIFIED)
                                .verificationCode(generateVerificationCode())
                                .completedAt(OffsetDateTime.now())
                                .build()
                ));
    }

    public List<ExperienceRecordResponse> getMyPassport(UUID userId) {
        TalentProfile talent = talentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Talent profile not found"));

        return experienceRecordRepository.findByTalent_Id(talent.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public ExperienceRecordResponse getById(UUID userId, UUID recordId) {
        ExperienceRecord record = experienceRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Project record not found"));

        boolean isTalent = record.getTalent().getUser().getId().equals(userId);
        boolean isOwningCompany = record.getProject().getCompany().getUser().getId().equals(userId);

        if (!isTalent && !isOwningCompany) {
            throw new UnauthorizedActionException("You do not have permission to view this record");
        }

        return toResponse(record);
    }

    /**
     * Public verification lookup — no authentication or ownership check.
     * Anyone holding the code (e.g. an employer checking a talent's claim)
     * can confirm a record's authenticity.
     */
    public ExperienceRecordResponse verifyByCode(String verificationCode) {
        ExperienceRecord record = experienceRecordRepository.findByVerificationCode(verificationCode)
                .orElseThrow(() -> new ResourceNotFoundException("No record found for this verification code"));

        return toResponse(record);
    }

    private String generateVerificationCode() {
        return "PF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private ExperienceRecordResponse toResponse(ExperienceRecord record) {
        return new ExperienceRecordResponse(
                record.getId(),
                record.getTalent().getId(),
                record.getTalent().getUser().getFullName(),
                record.getProject().getId(),
                record.getProject().getTitle(),
                record.getProject().getCompany().getName(),
                record.getVerificationStatus(),
                record.getVerificationCode(),
                record.getCompletedAt()
        );
    }
}