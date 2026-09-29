package com.pathforge.company.service;

import com.pathforge.common.Role;
import com.pathforge.common.VerificationStatus;
import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.company.dto.request.CompanyRequest;
import com.pathforge.company.dto.response.CompanyResponse;
import com.pathforge.company.model.Company;
import com.pathforge.company.repository.CompanyRepository;
import com.pathforge.user.model.User;
import com.pathforge.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    @Transactional
    public CompanyResponse createCompany(UUID userId, CompanyRequest request) {
        if (companyRepository.existsByUserId(userId)) {
            throw new BadRequestException("A company profile already exists for this account");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.COMPANY) {
            throw new BadRequestException("Only accounts registered as COMPANY can have a company profile");
        }

        Company company = Company.builder()
                .user(user)
                .name(request.name())
                .description(request.description())
                .website(request.website())
                .businessRegistrationNo(request.businessRegistrationNo())
                .logoUrl(request.logoUrl())
                .build();

        company = companyRepository.saveAndFlush(company);

        return toResponse(company, user);
    }

    public CompanyResponse getMyCompany(UUID userId) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        return toResponse(company, company.getUser());
    }

    /**
     * Admin-only listing, newest first, so a reviewer can find recently
     * registered (typically still PENDING) companies without already
     * knowing a company's ID.
     */
    public List<CompanyResponse> listAllCompanies() {
        return companyRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(c -> toResponse(c, c.getUser()))
                .toList();
    }

    public CompanyResponse getById(UUID companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        return toResponse(company, company.getUser());
    }

    @Transactional
    public CompanyResponse updateCompany(UUID userId, CompanyRequest request) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        company.setName(request.name());
        company.setDescription(request.description());
        company.setWebsite(request.website());
        company.setBusinessRegistrationNo(request.businessRegistrationNo());
        company.setLogoUrl(request.logoUrl());

        company = companyRepository.saveAndFlush(company);

        return toResponse(company, company.getUser());
    }

    /**
     * Admin-only action: sets a company's verification status. Setting a
     * company back to PENDING doesn't make sense once reviewed, so that
     * transition is blocked. verifiedAt is stamped on VERIFIED and cleared
     * otherwise.
     */
    @Transactional
    public CompanyResponse verifyCompany(UUID companyId, VerificationStatus status) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        if (status == VerificationStatus.PENDING) {
            throw new BadRequestException("Cannot set a company's verification status back to PENDING");
        }

        company.setVerificationStatus(status);
        company.setVerifiedAt(status == VerificationStatus.VERIFIED ? OffsetDateTime.now() : null);

        company = companyRepository.saveAndFlush(company);

        return toResponse(company, company.getUser());
    }

    private CompanyResponse toResponse(Company company, User user) {
        return new CompanyResponse(
                company.getId(),
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                company.getName(),
                company.getDescription(),
                company.getWebsite(),
                company.getBusinessRegistrationNo(),
                company.getLogoUrl(),
                company.getVerificationStatus(),
                company.getVerifiedAt(),
                company.getCreatedAt(),
                company.getUpdatedAt()
        );
    }
}