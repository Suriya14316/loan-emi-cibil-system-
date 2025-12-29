import type { Loan, Payment, CibilScore, Notification, Job } from "./types"

// Mock data store using localStorage
export const dataStore = {
  // Loans
  getLoans: (userId?: string): Loan[] => {
    const loans = JSON.parse(localStorage.getItem("loans") || "[]")
    return userId ? loans.filter((l: Loan) => l.userId === userId) : loans
  },

  addLoan: (loan: Loan): void => {
    const loans = dataStore.getLoans()
    loans.push(loan)
    localStorage.setItem("loans", JSON.stringify(loans))
  },

  updateLoan: (loanId: string, updates: Partial<Loan>): void => {
    const loans = dataStore.getLoans()
    const index = loans.findIndex((l) => l.id === loanId)
    if (index !== -1) {
      loans[index] = { ...loans[index], ...updates }
      localStorage.setItem("loans", JSON.stringify(loans))
    }
  },

  // Payments
  getPayments: (userId?: string): Payment[] => {
    const payments = JSON.parse(localStorage.getItem("payments") || "[]")
    return userId ? payments.filter((p: Payment) => p.userId === userId) : payments
  },

  addPayment: (payment: Payment): void => {
    const payments = dataStore.getPayments()
    payments.push(payment)
    localStorage.setItem("payments", JSON.stringify(payments))
  },

  updatePayment: (paymentId: string, updates: Partial<Payment>): void => {
    const payments = dataStore.getPayments()
    const index = payments.findIndex((p) => p.id === paymentId)
    if (index !== -1) {
      payments[index] = { ...payments[index], ...updates }
      localStorage.setItem("payments", JSON.stringify(payments))
    }
  },

  // CIBIL Scores
  getCibilScore: (userId: string): CibilScore | null => {
    const scores = JSON.parse(localStorage.getItem("cibilScores") || "[]")
    return scores.find((s: CibilScore) => s.userId === userId) || null
  },

  updateCibilScore: (score: CibilScore): void => {
    const scores = JSON.parse(localStorage.getItem("cibilScores") || "[]")
    const index = scores.findIndex((s: CibilScore) => s.userId === score.userId)
    if (index !== -1) {
      scores[index] = score
    } else {
      scores.push(score)
    }
    localStorage.setItem("cibilScores", JSON.stringify(scores))
  },

  // Notifications
  getNotifications: (userId: string): Notification[] => {
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    return notifications.filter((n: Notification) => n.userId === userId)
  },

  addNotification: (notification: Notification): void => {
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    notifications.push(notification)
    localStorage.setItem("notifications", JSON.stringify(notifications))
  },

  markNotificationRead: (notificationId: string): void => {
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    const index = notifications.findIndex((n: Notification) => n.id === notificationId)
    if (index !== -1) {
      notifications[index].read = true
      localStorage.setItem("notifications", JSON.stringify(notifications))
    }
  },

  // Jobs
  getJobs: (): Job[] => {
    return JSON.parse(localStorage.getItem("jobs") || "[]")
  },

  addJob: (job: Job): void => {
    const jobs = dataStore.getJobs()
    jobs.push(job)
    localStorage.setItem("jobs", JSON.stringify(jobs))
  },
}

// Initialize with mock data
export const initializeMockData = () => {
  if (!localStorage.getItem("dataInitialized")) {
    // Add mock loans
    const mockLoans: Loan[] = [
      {
        id: "1",
        userId: "2",
        loanType: "personal",
        principal: 500000,
        interestRate: 12.5,
        tenureMonths: 36,
        startDate: "2024-01-01",
        emi: 16680,
        status: "active",
        outstandingBalance: 400000,
      },
      {
        id: "2",
        userId: "2",
        loanType: "car",
        principal: 800000,
        interestRate: 10.5,
        tenureMonths: 60,
        startDate: "2023-06-01",
        emi: 17200,
        status: "active",
        outstandingBalance: 650000,
      },
    ]

    // Add mock payments
    const mockPayments: Payment[] = [
      {
        id: "1",
        loanId: "1",
        userId: "2",
        amount: 16680,
        dueDate: "2024-12-01",
        status: "pending",
      },
      {
        id: "2",
        loanId: "2",
        userId: "2",
        amount: 17200,
        dueDate: "2024-12-05",
        status: "pending",
      },
    ]

    // Add mock CIBIL score
    const mockCibilScore: CibilScore = {
      userId: "2",
      score: 750,
      lastUpdated: new Date().toISOString(),
      factors: {
        paymentHistory: 85,
        creditUtilization: 45,
        creditAge: 70,
        creditMix: 80,
        recentInquiries: 90,
      },
    }

    // Add mock jobs
    const mockJobs: Job[] = [
      {
        id: "1",
        title: "Software Engineer",
        company: "Tech Corp",
        location: "Bangalore",
        salary: "₹12-18 LPA",
        type: "full-time",
        description: "Looking for experienced software engineer",
        requirements: ["JavaScript", "React", "Node.js"],
      },
      {
        id: "2",
        title: "Financial Analyst",
        company: "Finance Plus",
        location: "Mumbai",
        salary: "₹8-12 LPA",
        type: "full-time",
        description: "Seeking financial analyst with 2+ years experience",
        requirements: ["Excel", "Financial Modeling", "SQL"],
      },
    ]

    localStorage.setItem("loans", JSON.stringify(mockLoans))
    localStorage.setItem("payments", JSON.stringify(mockPayments))
    localStorage.setItem("cibilScores", JSON.stringify([mockCibilScore]))
    localStorage.setItem("jobs", JSON.stringify(mockJobs))
    localStorage.setItem("dataInitialized", "true")
  }
}
