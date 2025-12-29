-- Setup initial data for SQL Integration
-- This script mirrors the mock data from data-store.ts

-- 1. Insert a Test User (Password is 'password123' hashed with BCrypt)
-- Note: Replace with actual BCrypt hash from your backend if needed
INSERT INTO users (id, email, password, name, role, phone, created_at)
VALUES (
    uuid_to_bin(UUID()), 
    'test@loan.com', 
    '$2a$10$8.UnVuGzhsEn5l8dRzR87eTTrKOSj7Wn7P6uK7n7P6uK7n7P6uK7n', -- Example hash
    'Test User', 
    'USER', 
    '+91-9876543210', 
    NOW()
);

-- Store the generated user ID for reference
SET @user_id = (SELECT id FROM users WHERE email = 'test@loan.com');

-- 2. Insert a Personal Loan
INSERT INTO loans (id, user_id, loan_type, principal, interest_rate, tenure_months, start_date, emi, status, outstanding_balance)
VALUES (
    uuid_to_bin(UUID()), 
    @user_id, 
    'PERSONAL', 
    500000.00, 
    12.5, 
    36, 
    '2024-01-01', 
    16680.00, 
    'ACTIVE', 
    400000.00
);

-- Store the generated loan ID for reference
SET @loan_id = (SELECT id FROM loans WHERE user_id = @user_id LIMIT 1);

-- 3. Insert Pending Payments
INSERT INTO payments (id, loan_id, user_id, amount, due_date, status)
VALUES (
    uuid_to_bin(UUID()), 
    @loan_id, 
    @user_id, 
    16680.00, 
    '2024-12-01', 
    'PENDING'
);

-- 4. Insert CIBIL Score
INSERT INTO cibil_scores (id, user_id, score, last_updated, payment_history, credit_utilization, credit_age, credit_mix, recent_inquiries)
VALUES (
    uuid_to_bin(UUID()), 
    @user_id, 
    750, 
    NOW(), 
    85, 
    45, 
    70, 
    80, 
    90
);
