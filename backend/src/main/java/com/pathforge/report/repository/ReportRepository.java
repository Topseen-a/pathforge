package com.pathforge.report.repository;

import com.pathforge.report.model.Report;
import com.pathforge.report.model.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReportRepository extends JpaRepository<Report, UUID> {

    List<Report> findByStatusOrderByCreatedAtAsc(ReportStatus status);

    List<Report> findByReporter_IdOrderByCreatedAtDesc(UUID reporterId);
}