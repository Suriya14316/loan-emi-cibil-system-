package com.Loan.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class LoanTypeConverter implements AttributeConverter<Loan.LoanType, String> {

    @Override
    public String convertToDatabaseColumn(Loan.LoanType attribute) {
        return attribute == null ? null : attribute.name().toLowerCase();
    }

    @Override
    public Loan.LoanType convertToEntityAttribute(String dbData) {
        return dbData == null ? null : Loan.LoanType.valueOf(dbData.toUpperCase());
    }
}
