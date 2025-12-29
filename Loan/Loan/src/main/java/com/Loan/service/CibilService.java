package com.Loan.service;

import com.Loan.entity.CibilScore;
import com.Loan.repository.CibilScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class CibilService {

    @Autowired
    private CibilScoreRepository cibilScoreRepository;

    public Optional<CibilScore> getCibilScoreByUserId(UUID userId) {
        return cibilScoreRepository.findByUserId(userId);
    }

    public CibilScore updateScore(CibilScore score) {
        return cibilScoreRepository.save(score);
    }

    public CibilScore createCibilScore(CibilScore score) {
        score.setLastUpdated(java.time.LocalDateTime.now());
        return cibilScoreRepository.save(score);
    }
}
