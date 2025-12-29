package com.Loan.service;

import com.Loan.entity.*;
import com.Loan.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (userRepository.count() > 0) {
            System.out.println("Database already initialized. Skipping data initialization.");
            return;
        }

        System.out.println("Initializing database with default data...");

        // Create Admin User ONLY
        User admin = new User();
        admin.setEmail("admin@loan.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setName("Admin User");
        admin.setRole(User.Role.ADMIN);
        admin.setPhone("+1234567890");
        userRepository.save(admin);

        // Create sample jobs (available to all users)
        Job job1 = new Job();
        job1.setTitle("Software Engineer");
        job1.setCompany("Tech Corp");
        job1.setLocation("Bangalore");
        job1.setSalary("₹12-18 LPA");
        job1.setType(Job.JobType.FULL_TIME);
        job1.setDescription("Looking for experienced software engineer with strong problem-solving skills");
        job1.setRequirements("[\"JavaScript\",\"React\",\"Node.js\",\"MongoDB\"]");
        jobRepository.save(job1);

        Job job2 = new Job();
        job2.setTitle("Financial Analyst");
        job2.setCompany("Finance Plus");
        job2.setLocation("Mumbai");
        job2.setSalary("₹8-12 LPA");
        job2.setType(Job.JobType.FULL_TIME);
        job2.setDescription("Seeking financial analyst with 2+ years experience in financial modeling");
        job2.setRequirements("[\"Excel\",\"Financial Modeling\",\"SQL\",\"Power BI\"]");
        jobRepository.save(job2);

        Job job3 = new Job();
        job3.setTitle("Data Scientist");
        job3.setCompany("AI Solutions");
        job3.setLocation("Hyderabad");
        job3.setSalary("₹15-22 LPA");
        job3.setType(Job.JobType.FULL_TIME);
        job3.setDescription("Data scientist role focusing on machine learning and predictive analytics");
        job3.setRequirements("[\"Python\",\"Machine Learning\",\"TensorFlow\",\"Statistics\"]");
        jobRepository.save(job3);

        System.out.println("===================================");
        System.out.println("Database initialization completed!");
        System.out.println("===================================");
        System.out.println("Admin user: admin@loan.com / admin123");
        System.out.println("Created 3 job listings");
        System.out.println("");
        System.out.println("New users will register with:");
        System.out.println("  - Active Loans: 0");
        System.out.println("  - Outstanding Amount: ₹0");
        System.out.println("  - Monthly EMI: ₹0");
        System.out.println("  - CIBIL Score: N/A");
        System.out.println("  - Pending Payments: 0");
        System.out.println("===================================");
    }
}
