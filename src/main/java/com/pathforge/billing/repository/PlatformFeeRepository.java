package com.pathforge.billing.repository;

import com.pathforge.billing.model.FeeStatus;
import com.pathforge.billing.model.PlatformFee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PlatformFeeRepository extends JpaRepository<PlatformFee, UUID> {

    Optional<PlatformFee> findByWorkspace_Id(UUID workspaceId);

    boolean existsByWorkspace_Id(UUID workspaceId);

    List<PlatformFee> findByWorkspace_Experience_Company_IdOrderByCreatedAtDesc(UUID companyId);

    List<PlatformFee> findByStatusOrderByCreatedAtAsc(FeeStatus status);
}