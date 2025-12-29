package com.Loan.repository;

import com.Loan.entity.CibilScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CibilScoreRepository extends JpaRepository<CibilScore, UUID> {
    Optional<CibilScore> findByUserId(UUID userId);
}
