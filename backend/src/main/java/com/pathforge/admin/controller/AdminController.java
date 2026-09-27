package com.pathforge.admin.controller;

import com.pathforge.common.VerificationStatus;
import com.pathforge.company.dto.response.CompanyResponse;
import com.pathforge.company.service.CompanyService;
import com.pathforge.project.dto.response.ProjectResponse;
import com.pathforge.project.service.ProjectService;
import com.pathforge.report.dto.response.ReportResponse;
import com.pathforge.report.model.ReportStatus;
import com.pathforge.report.service.ReportService;
import com.pathforge.user.dto.response.UserResponse;
import com.pathforge.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final CompanyService companyService;
    private final ProjectService projectService;
    private final UserService userService;
    private final ReportService reportService;

    @PutMapping("/companies/{companyId}/verify")
    public ResponseEntity<CompanyResponse> verifyCompany(
            @PathVariable UUID companyId,
            @RequestParam VerificationStatus status
    ) {
        return ResponseEntity.ok(companyService.verifyCompany(companyId, status));
    }

    @PutMapping("/projects/{projectId}/moderate")
    public ResponseEntity<ProjectResponse> moderateProject(@PathVariable UUID projectId) {
        return ResponseEntity.ok(projectService.moderateProject(projectId));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> listAllUsers() {
        return ResponseEntity.ok(userService.listAllUsers());
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.getById(userId));
    }

    @PutMapping("/users/{userId}/suspend")
    public ResponseEntity<UserResponse> suspendUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.suspendUser(userId));
    }

    @PutMapping("/users/{userId}/reactivate")
    public ResponseEntity<UserResponse> reactivateUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.reactivateUser(userId));
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ReportResponse>> listOpenReports() {
        return ResponseEntity.ok(reportService.listOpenReports());
    }

    @PutMapping("/reports/{reportId}/resolve")
    public ResponseEntity<ReportResponse> resolveReport(
            @PathVariable UUID reportId,
            @RequestParam ReportStatus status
    ) {
        return ResponseEntity.ok(reportService.resolveReport(reportId, status));
    }
}