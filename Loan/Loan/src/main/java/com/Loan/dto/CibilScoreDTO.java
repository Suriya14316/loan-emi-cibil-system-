package com.Loan.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class CibilScoreDTO {
    private UUID userId;
    private Integer score;
    private LocalDateTime lastUpdated;
    private CibilFactors factors;

    public static class CibilFactors {
        private Integer paymentHistory;
        private Integer creditUtilization;
        private Integer creditAge;
        private Integer creditMix;
        private Integer recentInquiries;

        public CibilFactors() {
        }

        public CibilFactors(Integer paymentHistory, Integer creditUtilization, Integer creditAge, Integer creditMix, Integer recentInquiries) {
            this.paymentHistory = paymentHistory;
            this.creditUtilization = creditUtilization;
            this.creditAge = creditAge;
            this.creditMix = creditMix;
            this.recentInquiries = recentInquiries;
        }

        public Integer getPaymentHistory() {
            return paymentHistory;
        }

        public void setPaymentHistory(Integer paymentHistory) {
            this.paymentHistory = paymentHistory;
        }

        public Integer getCreditUtilization() {
            return creditUtilization;
        }

        public void setCreditUtilization(Integer creditUtilization) {
            this.creditUtilization = creditUtilization;
        }

        public Integer getCreditAge() {
            return creditAge;
        }

        public void setCreditAge(Integer creditAge) {
            this.creditAge = creditAge;
        }

        public Integer getCreditMix() {
            return creditMix;
        }

        public void setCreditMix(Integer creditMix) {
            this.creditMix = creditMix;
        }

        public Integer getRecentInquiries() {
            return recentInquiries;
        }

        public void setRecentInquiries(Integer recentInquiries) {
            this.recentInquiries = recentInquiries;
        }
    }

    public CibilScoreDTO() {
    }

    public CibilScoreDTO(UUID userId, Integer score, LocalDateTime lastUpdated, CibilFactors factors) {
        this.userId = userId;
        this.score = score;
        this.lastUpdated = lastUpdated;
        this.factors = factors;
    }

    // Getters and Setters

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public CibilFactors getFactors() {
        return factors;
    }

    public void setFactors(CibilFactors factors) {
        this.factors = factors;
    }
}
