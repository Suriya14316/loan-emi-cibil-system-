package com.Loan.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class LoanStatusConverter implements AttributeConverter<Loan.LoanStatus, String> {

    @Override
    public String convertToDatabaseColumn(Loan.LoanStatus attribute) {
        return attribute == null ? null : attribute.name().toLowerCase();
    }

    @Override
    public Loan.LoanStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : Loan.LoanStatus.valueOf(dbData.toUpperCase());
    }
}
