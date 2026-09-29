package com.pathforge.company.repository;

import com.pathforge.company.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CompanyRepository extends JpaRepository<Company, UUID> {

    Optional<Company> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);

    List<Company> findAllByOrderByCreatedAtDesc();
}