package com.pathforge.report.controller;

import com.pathforge.report.dto.request.ReportRequest;
import com.pathforge.report.dto.response.ReportResponse;
import com.pathforge.report.service.ReportService;
import com.pathforge.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportResponse> fileReport(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ReportRequest request
    ) {
        ReportResponse response = reportService.fileReport(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/mine")
    public ResponseEntity<List<ReportResponse>> listMyReports(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(reportService.listMyReports(principal.getId()));
    }
}