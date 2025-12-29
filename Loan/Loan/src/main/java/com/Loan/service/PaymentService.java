package com.Loan.service;

import com.Loan.entity.Payment;
import com.Loan.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getPaymentsByUserId(UUID userId) {
        return paymentRepository.findByUserId(userId);
    }

    public List<Payment> getPendingPayments(UUID userId) {
        return paymentRepository.findByUserIdAndStatus(userId, Payment.PaymentStatus.PENDING);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByLoanId(UUID loanId) {
        return paymentRepository.findByLoanId(loanId);
    }

    public Payment updatePaymentStatus(UUID id, Payment.PaymentStatus status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(status);
        if (status == Payment.PaymentStatus.PAID) {
            payment.setPaidDate(java.time.LocalDate.now());
        }
        return paymentRepository.save(payment);
    }

    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }
}
