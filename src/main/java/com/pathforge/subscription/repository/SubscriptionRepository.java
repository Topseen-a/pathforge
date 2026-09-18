package com.pathforge.subscription.repository;

import com.pathforge.subscription.model.Subscription;
import com.pathforge.subscription.model.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    List<Subscription> findByCompany_IdOrderByStartedAtDesc(UUID companyId);

    Optional<Subscription> findByCompany_IdAndStatus(UUID companyId, SubscriptionStatus status);

    boolean existsByCompany_IdAndStatus(UUID companyId, SubscriptionStatus status);
}