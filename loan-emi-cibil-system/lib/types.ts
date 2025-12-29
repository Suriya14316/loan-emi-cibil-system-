export type UserRole = "ADMIN" | "USER"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone: string
  createdAt: string
}

export interface Loan {
  id: string
  userId: string
  loanType: "personal" | "home" | "car" | "education" | "business"
  principal: number
  interestRate: number
  tenureMonths: number
  startDate: string
  emi: number
  status: "ACTIVE" | "COMPLETED" | "DEFAULTED" | "PENDING" | "REJECTED"
  outstandingBalance: number
  rejectionReason?: string
  uploadedFileName?: string
  uploadedFilePath?: string
}

export interface Payment {
  id: string
  loanId: string
  userId: string
  amount: number
  dueDate: string
  paidDate?: string
  status: "pending" | "paid" | "overdue"
}

export interface CibilScore {
  userId: string
  score: number
  lastUpdated: string
  factors: {
    paymentHistory: number
    creditUtilization: number
    creditAge: number
    creditMix: number
    recentInquiries: number
  }
}

export interface Notification {
  id: string
  userId: string
  type: "payment_due" | "payment_overdue" | "loan_approved" | "cibil_update"
  message: string
  read: boolean
  createdAt: string
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  type: "full-time" | "part-time" | "contract"
  description: string
  requirements: string[]
}
