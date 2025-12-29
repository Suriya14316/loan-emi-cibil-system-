package com.Loan.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Loan.dto.LoanDTO;
import com.Loan.entity.Loan;
import com.Loan.service.LoanService;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "*")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LoanDTO>> getUserLoans(@PathVariable UUID userId) {
        return ResponseEntity.ok(loanService.getLoansByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList()));
    }

    @PostMapping("/apply")
    public ResponseEntity<Loan> applyForLoan(
            @RequestParam UUID userId, 
            @RequestParam String loanType,
            @RequestParam String principal,
            @RequestParam String interestRate,
            @RequestParam String tenureMonths,
            @RequestParam(name = "file", required = false) org.springframework.web.multipart.MultipartFile file) {
        
        try {
            // Create loan object from parameters
            Loan loan = new Loan();
            loan.setLoanType(Loan.LoanType.valueOf(loanType.toUpperCase()));
            loan.setPrincipal(new java.math.BigDecimal(principal));
            loan.setInterestRate(new java.math.BigDecimal(interestRate));
            loan.setTenureMonths(Integer.parseInt(tenureMonths));
            
            // Handle file upload if present
            if (file != null && !file.isEmpty()) {
                // Validate file size (40KB limit)
                if (file.getSize() > 40 * 1024) {
                    return ResponseEntity.badRequest().build();
                }
                
                // Save file
                String filename = userId.toString() + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
                java.nio.file.Path path = java.nio.file.Paths.get("uploads/" + filename);
                java.nio.file.Files.createDirectories(path.getParent());
                java.nio.file.Files.write(path, file.getBytes());
                
                loan.setUploadedFileName(file.getOriginalFilename());
                loan.setUploadedFilePath(path.toString());
            }
            
            Loan savedLoan = loanService.applyForLoan(userId, loan);
            return ResponseEntity.ok(savedLoan);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<LoanDTO>> getAllLoans() {
        return ResponseEntity.ok(loanService.getAllLoans().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanDTO> getLoanById(@PathVariable UUID id) {
        Loan loan = loanService.getLoanById(id);
        if (loan != null) {
            return ResponseEntity.ok(mapToDTO(loan));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Loan> updateLoan(@PathVariable UUID id, @RequestBody Loan loan) {
        return ResponseEntity.ok(loanService.updateLoan(id, loan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoan(@PathVariable UUID id) {
        loanService.deleteLoan(id);
        return ResponseEntity.ok().build();
    }

    private LoanDTO mapToDTO(Loan loan) {
        return new LoanDTO(
                loan.getId(),
                loan.getUser() != null ? loan.getUser().getId() : null,
                loan.getLoanType().name(),
                loan.getPrincipal(),
                loan.getInterestRate(),
                loan.getTenureMonths(),
                loan.getStartDate(),
                loan.getEmi(),
                loan.getStatus().name(),
                loan.getOutstandingBalance(),
                loan.getRejectionReason(),
                loan.getUploadedFileName(),
                loan.getUploadedFilePath()
        );
    }
}
