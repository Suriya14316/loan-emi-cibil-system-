package com.Loan.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class LoanDTO {
    private UUID id;
    private UUID userId;
    private String loanType;
    private BigDecimal principal;
    private BigDecimal interestRate;
    private Integer tenureMonths;
    private LocalDate startDate;
    private BigDecimal emi;
    private String status;
    private BigDecimal outstandingBalance;
    private String uploadedFileName;
    private String uploadedFilePath;

    public LoanDTO() {
    }

    public LoanDTO(UUID id, UUID userId, String loanType, BigDecimal principal, BigDecimal interestRate, Integer tenureMonths, LocalDate startDate, BigDecimal emi, String status, BigDecimal outstandingBalance) {
        this.id = id;
        this.userId = userId;
        this.loanType = loanType;
        this.principal = principal;
        this.interestRate = interestRate;
        this.tenureMonths = tenureMonths;
        this.startDate = startDate;
        this.emi = emi;
        this.status = status;
        this.outstandingBalance = outstandingBalance;
    }

    public String getUploadedFileName() {
        return uploadedFileName;
    }

    public void setUploadedFileName(String uploadedFileName) {
        this.uploadedFileName = uploadedFileName;
    }

    public String getUploadedFilePath() {
        return uploadedFilePath;
    }

    public void setUploadedFilePath(String uploadedFilePath) {
        this.uploadedFilePath = uploadedFilePath;
    }

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getLoanType() {
        return loanType;
    }

    public void setLoanType(String loanType) {
        this.loanType = loanType;
    }

    public BigDecimal getPrincipal() {
        return principal;
    }

    public void setPrincipal(BigDecimal principal) {
        this.principal = principal;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public BigDecimal getEmi() {
        return emi;
    }

    public void setEmi(BigDecimal emi) {
        this.emi = emi;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getOutstandingBalance() {
        return outstandingBalance;
    }

    public void setOutstandingBalance(BigDecimal outstandingBalance) {
        this.outstandingBalance = outstandingBalance;
    }
    private String rejectionReason;

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public LoanDTO(UUID id, UUID userId, String loanType, BigDecimal principal, BigDecimal interestRate, Integer tenureMonths, LocalDate startDate, BigDecimal emi, String status, BigDecimal outstandingBalance, String rejectionReason, String uploadedFileName, String uploadedFilePath) {
        this.id = id;
        this.userId = userId;
        this.loanType = loanType;
        this.principal = principal;
        this.interestRate = interestRate;
        this.tenureMonths = tenureMonths;
        this.startDate = startDate;
        this.emi = emi;
        this.status = status;
        this.outstandingBalance = outstandingBalance;
        this.rejectionReason = rejectionReason;
        this.uploadedFileName = uploadedFileName;
        this.uploadedFilePath = uploadedFilePath;
    }
}
