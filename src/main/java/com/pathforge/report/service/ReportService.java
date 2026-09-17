package com.pathforge.report.service;

import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.experience.model.Experience;
import com.pathforge.experience.repository.ExperienceRepository;
import com.pathforge.report.dto.request.ReportRequest;
import com.pathforge.report.dto.response.ReportResponse;
import com.pathforge.report.model.Report;
import com.pathforge.report.model.ReportStatus;
import com.pathforge.report.repository.ReportRepository;
import com.pathforge.user.model.User;
import com.pathforge.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ExperienceRepository experienceRepository;

    @Transactional
    public ReportResponse fileReport(UUID userId, ReportRequest request) {
        if (request.reportedUserId() == null && request.experienceId() == null) {
            throw new BadRequestException("A report must reference either a user or an experience");
        }

        User reporter = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Reporter not found"));

        User reportedUser = null;
        if (request.reportedUserId() != null) {
            reportedUser = userRepository.findById(request.reportedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Reported user not found"));
        }

        Experience experience = null;
        if (request.experienceId() != null) {
            experience = experienceRepository.findById(request.experienceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));
        }

        Report report = Report.builder()
                .reporter(reporter)
                .reportedUser(reportedUser)
                .experience(experience)
                .reason(request.reason())
                .description(request.description())
                .status(ReportStatus.OPEN)
                .build();

        report = reportRepository.saveAndFlush(report);

        return toResponse(report);
    }

    public List<ReportResponse> listMyReports(UUID userId) {
        return reportRepository.findByReporter_IdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Admin-only action: the moderation queue, oldest first.
     */
    public List<ReportResponse> listOpenReports() {
        return reportRepository.findByStatusOrderByCreatedAtAsc(ReportStatus.OPEN).stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Admin-only action: moves a report to RESOLVED or DISMISSED. Moving a
     * report back to OPEN doesn't make sense once acted on, so it's blocked.
     */
    @Transactional
    public ReportResponse resolveReport(UUID reportId, ReportStatus status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        if (status == ReportStatus.OPEN) {
            throw new BadRequestException("Cannot set a report back to OPEN");
        }

        report.setStatus(status);
        report = reportRepository.saveAndFlush(report);

        return toResponse(report);
    }

    private ReportResponse toResponse(Report report) {
        return new ReportResponse(
                report.getId(),
                report.getReporter().getId(),
                report.getReporter().getFullName(),
                report.getReportedUser() != null ? report.getReportedUser().getId() : null,
                report.getReportedUser() != null ? report.getReportedUser().getFullName() : null,
                report.getExperience() != null ? report.getExperience().getId() : null,
                report.getExperience() != null ? report.getExperience().getTitle() : null,
                report.getReason(),
                report.getDescription(),
                report.getStatus(),
                report.getCreatedAt()
        );
    }
}