// API Base URL
const API_BASE_URL = "http://localhost:8081/api"

// Helper function to get auth token
const getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token")
    }
    return null
}

// Helper function to create headers
const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    }

    const token = getAuthToken()
    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    return headers
}

// Centralized request wrapper for better error handling
const request = async (url: string, options: RequestInit = {}, errorMessage: string) => {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...getHeaders(),
                ...options.headers,
            },
        })

        if (!response.ok) {
            // Internal error handling for specific status codes
            let errorData: any = {};
            let rawText = "";
            try {
                // Try parse JSON first
                errorData = await response.json();
            } catch (e) {
                try {
                    rawText = await response.text();
                    if (rawText) {
                        errorData = { message: rawText, raw: rawText };
                    }
                } catch (e2) {
                    errorData = {};
                }
            }

            // Collect headers for debugging
            const headersObj: Record<string, string> = {};
            try {
                response.headers.forEach((v, k) => { headersObj[k] = v });
            } catch (_) { }

            // Suppress console.error for 404 since it's often expected (e.g., no CIBIL score yet)
            if (response.status !== 404) {
                console.error(`API Error [${response.status} ${response.statusText}] ${url}`, {
                    status: response.status,
                    statusText: response.statusText,
                    url,
                    headers: headersObj,
                    body: errorData,
                })
            }

            const msg = (errorData && (errorData.message || errorData.error)) || rawText || `${response.status} ${response.statusText}`;
            const err = new Error(msg || errorMessage) as any;
            err.status = response.status;
            err.body = errorData;
            throw err;
        }

        // Read response as text first, then try to parse as JSON
        // This avoids the "body stream already read" error
        const responseText = await response.text()

        // Try to parse as JSON, fall back to plain text
        try {
            return responseText ? JSON.parse(responseText) : responseText
        } catch (e) {
            // If JSON parsing fails, return the raw text
            return responseText
        }
    } catch (error: any) {
        if (error.name === "TypeError" && error.message === "Failed to fetch") {
            const connectError = "Network error: Connection to backend failed. Please ensure the Spring Boot server is running on http://localhost:8081"
            console.error(connectError)
            throw new Error(connectError)
        }

        // Only log other non-404 errors
        if (!error.message?.includes("404") && error.message !== errorMessage) {
            console.error(`${errorMessage}:`, error)
        }
        throw error
    }
}

// API Client
export const apiClient = {
    // Loans
    loans: {
        getByUserId: (userId: string) =>
            request(`${API_BASE_URL}/loans/user/${userId}`, {}, "Failed to fetch loans"),

        getAll: () =>
            request(`${API_BASE_URL}/loans`, {}, "Failed to fetch all loans"),

        apply: (formData: FormData) =>
            fetch(`${API_BASE_URL}/loans/apply`, {
                method: "POST",
                headers: {
                    ...(getAuthToken() ? { "Authorization": `Bearer ${getAuthToken()}` } : {})
                },
                body: formData,
            }).then(async (res) => {
                if (!res.ok) throw new Error(await res.text());
                return res.json();
            }),

        update: (loanId: string, loanData: any) =>
            request(`${API_BASE_URL}/loans/${loanId}`, {
                method: "PUT",
                body: JSON.stringify(loanData),
            }, "Failed to update loan"),
    },

    // Payments
    payments: {
        getByUserId: (userId: string) =>
            request(`${API_BASE_URL}/payments/user/${userId}`, {}, "Failed to fetch payments"),

        getAll: () =>
            request(`${API_BASE_URL}/payments`, {}, "Failed to fetch all payments"),

        updateStatus: (paymentId: string, status: string) =>
            request(`${API_BASE_URL}/payments/${paymentId}/status?status=${status}`, {
                method: "PUT",
            }, "Failed to update payment status"),

        create: (loanId: string, paymentData: any) =>
            request(`${API_BASE_URL}/payments?loanId=${loanId}`, {
                method: "POST",
                body: JSON.stringify(paymentData),
            }, "Failed to create payment"),
    },

    // CIBIL Score
    cibil: {
        getByUserId: (userId: string) =>
            request(`${API_BASE_URL}/cibil/user/${userId}`, {}, "Failed to fetch CIBIL score"),

        update: (userId: string, scoreData: any) =>
            request(`${API_BASE_URL}/cibil/user/${userId}`, {
                method: "PUT",
                body: JSON.stringify(scoreData),
            }, "Failed to update CIBIL score"),
    },

    // Notifications
    notifications: {
        getByUserId: (userId: string) =>
            request(`${API_BASE_URL}/notifications/user/${userId}`, {}, "Failed to fetch notifications"),

        markAsRead: (notificationId: string) =>
            request(`${API_BASE_URL}/notifications/${notificationId}/read`, {
                method: "PUT",
            }, "Failed to mark notification as read"),

        create: (notificationData: any) =>
            request(`${API_BASE_URL}/notifications`, {
                method: "POST",
                body: JSON.stringify(notificationData),
            }, "Failed to create notification"),
    },

    // Jobs
    jobs: {
        getAll: () =>
            request(`${API_BASE_URL}/jobs`, {}, "Failed to fetch jobs"),
    },

    // Admin
    admin: {
        getStats: () =>
            request(`${API_BASE_URL}/admin/stats`, {}, "Failed to fetch admin stats"),

        getAllUsers: () =>
            request(`${API_BASE_URL}/admin/users`, {}, "Failed to fetch all users"),

        getDistribution: () =>
            request(`${API_BASE_URL}/admin/distribution`, {}, "Failed to fetch loan distribution"),

        getTrends: () =>
            request(`${API_BASE_URL}/admin/trends`, {}, "Failed to fetch disbursement trends"),

        getLogs: () =>
            request(`${API_BASE_URL}/admin/logs`, {}, "Failed to fetch activity logs"),

        uploadFile: (formData: FormData) =>
            fetch(`${API_BASE_URL}/admin/upload-file`, {
                method: "POST",
                headers: {
                    ...(getAuthToken() ? { "Authorization": `Bearer ${getAuthToken()}` } : {})
                },
                body: formData,
            }).then(async (res) => {
                if (!res.ok) throw new Error(await res.text());
                return res.text();
            }),

        downloadReport: (month?: string) => {
            const url = `${API_BASE_URL}/admin/report/download${month ? `?month=${month}` : ""}`;
            return fetch(url, {
                headers: {
                    ...(getAuthToken() ? { "Authorization": `Bearer ${getAuthToken()}` } : {})
                },
            }).then(res => {
                if (!res.ok) throw new Error("Failed to download report");
                return res.blob();
            });
        },

        getFiles: () =>
            request(`${API_BASE_URL}/admin/files`, {}, "Failed to fetch files"),

        deleteFile: (filename: string) =>
            request(`${API_BASE_URL}/admin/files/${filename}`, {
                method: "DELETE",
            }, "Failed to delete file"),

        downloadFile: (filename: string) => {
            const url = `${API_BASE_URL}/admin/files/${filename}`;
            return fetch(url, {
                headers: {
                    ...(getAuthToken() ? { "Authorization": `Bearer ${getAuthToken()}` } : {})
                },
            }).then(res => {
                if (!res.ok) throw new Error("Failed to download file");
                return res.blob();
            });
        },

        getFile: (filename: string) =>
            request(`${API_BASE_URL}/admin/files/${filename}`, {}, "Failed to get file"),

        decideLoan: (loanId: string, action: string, rejectionReason?: string, file?: File) => {
            const formData = new FormData();
            formData.append("action", action);
            if (rejectionReason) {
                formData.append("rejectionReason", rejectionReason);
            }
            if (file) {
                formData.append("file", file);
            }

            return fetch(`${API_BASE_URL}/admin/loan/${loanId}/decision`, {
                method: "POST",
                headers: {
                    ...(getAuthToken() ? { "Authorization": `Bearer ${getAuthToken()}` } : {})
                },
                body: formData,
            }).then(async (res) => {
                if (!res.ok) throw new Error(await res.text());
                return res.json();
            });
        },
    },
}

// Helper function to transform backend data to frontend format
export const transformers = {
    loan: (backendLoan: any) => ({
        id: backendLoan.id,
        userId: backendLoan.user?.id || backendLoan.userId,
        loanType: backendLoan.loanType,
        principal: Number(backendLoan.principal),
        interestRate: Number(backendLoan.interestRate),
        tenureMonths: backendLoan.tenureMonths,
        startDate: backendLoan.startDate,
        emi: Number(backendLoan.emi),
        status: backendLoan.status,
        outstandingBalance: Number(backendLoan.outstandingBalance),
    }),

    payment: (backendPayment: any) => ({
        id: backendPayment.id,
        loanId: backendPayment.loan?.id || backendPayment.loanId,
        userId: backendPayment.user?.id || backendPayment.userId,
        amount: Number(backendPayment.amount),
        dueDate: backendPayment.dueDate,
        paidDate: backendPayment.paidDate,
        status: backendPayment.status?.toLowerCase() || backendPayment.status,
    }),

    cibilScore: (backendScore: any) => ({
        userId: backendScore.user?.id || backendScore.userId,
        score: backendScore.score,
        lastUpdated: backendScore.lastUpdated,
        factors: {
            paymentHistory: backendScore.paymentHistory,
            creditUtilization: backendScore.creditUtilization,
            creditAge: backendScore.creditAge,
            creditMix: backendScore.creditMix,
            recentInquiries: backendScore.recentInquiries,
        },
    }),

    notification: (backendNotification: any) => ({
        id: backendNotification.id,
        userId: backendNotification.user?.id || backendNotification.userId,
        type: backendNotification.type,
        message: backendNotification.message,
        read: backendNotification.read,
        createdAt: backendNotification.createdAt,
    }),

    job: (backendJob: any) => ({
        id: backendJob.id,
        title: backendJob.title,
        company: backendJob.company,
        location: backendJob.location,
        salary: backendJob.salary,
        type: backendJob.type?.toLowerCase().replace("_", "-") || backendJob.type,
        description: backendJob.description,
        requirements: typeof backendJob.requirements === "string"
            ? JSON.parse(backendJob.requirements)
            : backendJob.requirements,
    }),
}
