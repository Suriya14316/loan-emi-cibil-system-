package com.Loan.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "cibil_scores")
public class CibilScore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @org.hibernate.annotations.NotFound(action = org.hibernate.annotations.NotFoundAction.IGNORE)
    private User user;

    @Column(nullable = false)
    private Integer score;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    @Column(name = "payment_history")
    private Integer paymentHistory;

    @Column(name = "credit_utilization")
    private Integer creditUtilization;

    @Column(name = "credit_age")
    private Integer creditAge;

    @Column(name = "credit_mix")
    private Integer creditMix;

    @Column(name = "recent_inquiries")
    private Integer recentInquiries;

    public CibilScore() {
    }

    public CibilScore(UUID id, User user, Integer score, LocalDateTime lastUpdated, Integer paymentHistory, Integer creditUtilization, Integer creditAge, Integer creditMix, Integer recentInquiries) {
        this.id = id;
        this.user = user;
        this.score = score;
        this.lastUpdated = lastUpdated;
        this.paymentHistory = paymentHistory;
        this.creditUtilization = creditUtilization;
        this.creditAge = creditAge;
        this.creditMix = creditMix;
        this.recentInquiries = recentInquiries;
    }

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
