package com.pathforge.company;

import com.pathforge.common.Role;
import com.pathforge.common.exception.BadRequestException;
import com.pathforge.common.exception.ResourceNotFoundException;
import com.pathforge.company.dto.CompanyRequest;
import com.pathforge.company.dto.CompanyResponse;
import com.pathforge.user.User;
import com.pathforge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .build();

        company = companyRepository.saveAndFlush(company);

        return toResponse(company, user);
    }

    public CompanyResponse getMyCompany(UUID userId) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        return toResponse(company, company.getUser());
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
                company.getVerificationStatus(),
                company.getVerifiedAt(),
                company.getCreatedAt(),
                company.getUpdatedAt()
        );
    }
}