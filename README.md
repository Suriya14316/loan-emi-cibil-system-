# Loan EMI & CIBIL System

A comprehensive, full-stack Loan Management System built with a Spring Boot backend and a Next.js frontend. This application provides a dual-interface platform for users to manage their loans and for administrators to oversee the entire system. It includes features for loan application, EMI tracking, CIBIL score analysis, payment monitoring, and robust administrative controls.

## Features

### User Features
- **Authentication:** Secure user registration and JWT-based login.
- **Dashboard:** A personalized overview of active loans, total outstanding balance, upcoming EMIs, and current CIBIL score.
- **Loan Application:** Apply for various loan types (Personal, Home, Car, etc.) with an option to upload supporting documents.
- **Loan Portfolio:** View a detailed list of all submitted loans and their current status (Pending, Active, Rejected).
- **CIBIL Score Analysis:** View a detailed breakdown of your CIBIL score, including factors like payment history, credit utilization, and credit age.
- **Notifications:** Receive real-time alerts for payment due dates, loan approvals, and other system events.
- **Job Recommendations:** Browse job listings that are relevant to improving financial standing.
- **Data Correction:** Upload documents to request corrections to financial data.

### Admin Features
- **Secure Admin Portal:** Separate, secure login for administrators.
- **Statistical Dashboard:** An analytical dashboard displaying key system metrics like total users, active loans, pending applications, disbursement trends, and loan type distribution.
- **User Management:** View and manage all registered users in the system.
- **Loan Management:** A central repository to view, review, approve, or reject user loan applications with reasons.
- **Payment Monitoring:** Track all payment transactions across the system, with filters for pending, paid, and overdue statuses.
- **File Repository:** Upload and manage system-wide documents and circulars. View, download, or delete uploaded files.
- **Notification Broadcasting:** Send targeted or system-wide notifications to users.
- **Data Management:** A powerful interface to manually create and override user financial records, including adding new loans, logging payments, and updating CIBIL scores.

## Tech Stack

- **Backend:**
    - Java 17
    - Spring Boot
    - Spring Data JPA
    - Spring Security
    - MySQL
    - H2 Database (for development)
    - Maven
    - JSON Web Tokens (JWT) for authentication

- **Frontend:**
    - Next.js
    - React
    - TypeScript
    - Tailwind CSS
    - Shadcn/ui
    - Recharts
    - Zod & React Hook Form

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Git
- JDK 17 or later
- Node.js and npm (or pnpm/yarn)
- Maven
- MySQL Server

### Backend Setup (Spring Boot)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Suriya14316/loan-emi-cibil-system-.git
    cd loan-emi-cibil-system-
    ```

2.  **Navigate to the backend directory:**
    ```bash
    cd Loan/Loan
    ```

3.  **Configure the database:**
    - Open `src/main/resources/application.properties`.
    - Ensure the MySQL properties are uncommented and update the `spring.datasource.username` and `spring.datasource.password` with your MySQL credentials.
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/loan_db?createDatabaseIfNotExist=true
    spring.datasource.username=root
    spring.datasource.password=your_password
    ```

4.  **Run the backend server:**
    ```bash
    mvn spring-boot:run
    ```
    The backend will start on `http://localhost:8081`. The application will automatically create the database schema on startup.

### Frontend Setup (Next.js)

1.  **Navigate to the frontend directory:**
    ```bash
    cd loan-emi-cibil-system
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application will be available at `http://localhost:3000`.

## Usage & Credentials

The system is pre-configured with a default admin user for immediate access.

-   **Admin Login:**
    -   **Email:** `admin@loan.com`
    -   **Password:** `admin123`

-   **User Login:**
    -   New users can register through the main landing page.
    -   After registration, use the created credentials to log in.

## API Endpoints

The backend exposes a RESTful API for all system functionalities.

| Method | Endpoint                    | Description                                  |
| :----- | :-------------------------- | :------------------------------------------- |
| `POST` | `/api/users/register`         | Register a new user or admin.                |
| `POST` | `/api/users/login`            | Authenticate a user and receive a JWT.       |
| `GET`  | `/api/loans/user/{userId}`    | Get all loans for a specific user.           |
| `POST` | `/api/loans/apply`            | Apply for a new loan.                        |
| `GET`  | `/api/cibil/user/{userId}`    | Get the CIBIL score for a user.              |
| `GET`  | `/api/payments/user/{userId}` | Get all payments for a specific user.        |
| `GET`  | `/api/admin/stats`            | Get dashboard statistics for the admin panel.|
| `GET`  | `/api/admin/users`            | Get a list of all users.                     |
| `POST` | `/api/admin/loan/{id}/decision`| Approve or reject a loan application.     |
| `GET`  | `/api/admin/files`            | List all uploaded files in the repository.   |
