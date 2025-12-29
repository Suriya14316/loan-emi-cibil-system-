export function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  const monthlyRate = annualRate / 12 / 100
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  return Math.round(emi)
}

export function calculateCibilScore(factors: {
  paymentHistory: number
  creditUtilization: number
  creditAge: number
  creditMix: number
  recentInquiries: number
}): number {
  const weights = {
    paymentHistory: 0.35,
    creditUtilization: 0.3,
    creditAge: 0.15,
    creditMix: 0.1,
    recentInquiries: 0.1,
  }

  const score =
    factors.paymentHistory * weights.paymentHistory +
    factors.creditUtilization * weights.creditUtilization +
    factors.creditAge * weights.creditAge +
    factors.creditMix * weights.creditMix +
    factors.recentInquiries * weights.recentInquiries

  // Convert to CIBIL scale (300-900)
  return Math.round(300 + (score / 100) * 600)
}

export function getCibilScoreCategory(score: number): {
  category: string
  color: string
  description: string
} {
  if (score >= 750) {
    return {
      category: "Excellent",
      color: "text-green-600",
      description: "Great credit profile, easy loan approvals",
    }
  } else if (score >= 650) {
    return {
      category: "Good",
      color: "text-blue-600",
      description: "Good credit standing, favorable terms",
    }
  } else if (score >= 550) {
    return {
      category: "Fair",
      color: "text-yellow-600",
      description: "Needs improvement, may face higher rates",
    }
  } else {
    return {
      category: "Poor",
      color: "text-red-600",
      description: "Difficult to get loans, work on improving",
    }
  }
}
