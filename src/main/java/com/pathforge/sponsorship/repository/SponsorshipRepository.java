package com.pathforge.sponsorship.repository;

import com.pathforge.sponsorship.model.Sponsorship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SponsorshipRepository extends JpaRepository<Sponsorship, UUID> {

    List<Sponsorship> findByCompany_IdOrderByCreatedAtDesc(UUID companyId);
}