package com.pathforge.company;

import com.pathforge.company.dto.CompanyRequest;
import com.pathforge.company.dto.CompanyResponse;
import com.pathforge.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping("/me")
    public ResponseEntity<CompanyResponse> createMyCompany(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CompanyRequest request
    ) {
        CompanyResponse response = companyService.createCompany(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<CompanyResponse> getMyCompany(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(companyService.getMyCompany(principal.getId()));
    }

    @PutMapping("/me")
    public ResponseEntity<CompanyResponse> updateMyCompany(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CompanyRequest request
    ) {
        return ResponseEntity.ok(companyService.updateCompany(principal.getId(), request));
    }

    @GetMapping("/{companyId}")
    public ResponseEntity<CompanyResponse> getCompanyById(@PathVariable UUID companyId) {
        return ResponseEntity.ok(companyService.getById(companyId));
    }
}