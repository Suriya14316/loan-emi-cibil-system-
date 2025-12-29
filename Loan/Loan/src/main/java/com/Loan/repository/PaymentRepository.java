package com.Loan.repository;

import com.Loan.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByUserId(UUID userId);
    List<Payment> findByLoanId(UUID loanId);
    List<Payment> findByUserIdAndStatus(UUID userId, Payment.PaymentStatus status);
}
