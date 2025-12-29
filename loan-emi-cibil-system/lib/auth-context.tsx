"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<User | null>
  register: (name: string, email: string, password: string, phone: string, role?: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "admin@loan.com",
    password: "admin123",
    name: "Admin User",
    role: "ADMIN",
    phone: "+1234567890",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "user@loan.com",
    password: "user123",
    name: "John Doe",
    role: "USER",
    phone: "+1234567891",
    createdAt: new Date().toISOString(),
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("currentUser")
    const token = localStorage.getItem("token")
    if (storedUser && token && storedUser !== "undefined" && storedUser !== "null") {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("currentUser")
        localStorage.removeItem("token")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const res = await fetch("http://localhost:8081/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        const data = await res.json()
        const { token, user } = data
        setUser(user)
        localStorage.setItem("currentUser", JSON.stringify(user))
        localStorage.setItem("token", token)
        return user
      }
      return null
    } catch (error) {
      console.error("Login failed", error)
      return null
    }
  }

  const register = async (name: string, email: string, password: string, phone: string, role?: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:8081/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, role: role || "USER" }),
      })

      if (res.ok) {
        // Registration successful, do NOT auto-login. Redirect to login page handled by component.
        return true
      }
      return false
    } catch (error) {
      console.error("Registration failed", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
    localStorage.removeItem("token")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
