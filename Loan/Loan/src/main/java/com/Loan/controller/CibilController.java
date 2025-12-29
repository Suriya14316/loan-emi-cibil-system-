package com.Loan.controller;

import com.Loan.entity.CibilScore;
import com.Loan.service.CibilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/cibil")
@CrossOrigin(origins = "*")
public class CibilController {

    @Autowired
    private CibilService cibilService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<CibilScore> getCibilScore(@PathVariable UUID userId) {
        return cibilService.getCibilScoreByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<CibilScore> createCibilScore(@PathVariable UUID userId, @RequestBody CibilScore score) {
        return ResponseEntity.ok(cibilService.createCibilScore(score));
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<CibilScore> updateCibilScore(@PathVariable UUID userId, @RequestBody CibilScore score) {
        return ResponseEntity.ok(cibilService.updateScore(score));
    }
}
