package com.Loan.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Loan.entity.Loan;
import com.Loan.entity.User;
import com.Loan.repository.LoanRepository;
import com.Loan.repository.UserRepository;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Loan> getLoansByUserId(UUID userId) {
        return loanRepository.findByUserId(userId);
    }

    public Loan applyForLoan(UUID userId, Loan loan) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        loan.setUser(user);
        loan.setStatus(Loan.LoanStatus.PENDING);
        loan.setStartDate(LocalDate.now());
        loan.setOutstandingBalance(loan.getPrincipal());
        
        // Calculate EMI if not provided (Simple calculation for demo)
        if (loan.getEmi() == null) {
            loan.setEmi(calculateEmi(loan.getPrincipal(), loan.getInterestRate(), loan.getTenureMonths()));
        }

        return loanRepository.save(loan);
    }

    private BigDecimal calculateEmi(BigDecimal principal, BigDecimal annualRate, Integer months) {
        // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
        BigDecimal monthlyRate = annualRate.divide(BigDecimal.valueOf(1200), 10, RoundingMode.HALF_UP);
        BigDecimal onePlusPowerN = monthlyRate.add(BigDecimal.ONE).pow(months);
        
        BigDecimal numerator = principal.multiply(monthlyRate).multiply(onePlusPowerN);
        BigDecimal denominator = onePlusPowerN.subtract(BigDecimal.ONE);
        
        return numerator.divide(denominator, 2, RoundingMode.HALF_UP);
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Loan getLoanById(UUID id) {
        return loanRepository.findById(id).orElse(null);
    }

    public Loan updateLoan(UUID id, Loan loanDetails) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        
        if (loanDetails.getStatus() != null) {
            // If loan is being activated, update the start date to today
            if (loanDetails.getStatus() == Loan.LoanStatus.ACTIVE && loan.getStatus() != Loan.LoanStatus.ACTIVE) {
                loan.setStartDate(LocalDate.now());
            }
            loan.setStatus(loanDetails.getStatus());
        }
        if (loanDetails.getOutstandingBalance() != null) {
            loan.setOutstandingBalance(loanDetails.getOutstandingBalance());
        }
        if (loanDetails.getRejectionReason() != null) {
            loan.setRejectionReason(loanDetails.getRejectionReason());
        }
        if (loanDetails.getUploadedFileName() != null) {
            loan.setUploadedFileName(loanDetails.getUploadedFileName());
        }
        if (loanDetails.getUploadedFilePath() != null) {
            loan.setUploadedFilePath(loanDetails.getUploadedFilePath());
        }
        
        return loanRepository.save(loan);
    }

    public void deleteLoan(UUID id) {
        loanRepository.deleteById(id);
    }
}
