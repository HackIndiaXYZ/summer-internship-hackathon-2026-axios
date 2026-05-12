"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Shield, Eye, EyeOff, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useApp } from "@/lib/store"
import { useRouter } from "next/navigation"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: "login" | "signup"
}

interface ValidationErrors {
  name?: string
  email?: string
  password?: string
}

function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

function validateName(name: string): boolean {
  return /^[a-zA-Z\s]+$/.test(name) && name.trim().length > 0
}

function validatePassword(password: string): boolean {
  const hasMinLength = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  return hasMinLength && hasNumber && hasSpecial
}

export function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { login, isAuthenticated } = useApp()
  const router = useRouter()

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7708/ingest/456d8f43-94d0-4fe7-a952-1db9bb5def71',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'279f56'},body:JSON.stringify({sessionId:'279f56',runId:'initial',hypothesisId:'H1',location:'src/components/landing/auth-modal.tsx:56',message:'auth effect fired',data:{isAuthenticated,isOpen,initialTab},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if (isAuthenticated) {
      // #region agent log
      fetch('http://127.0.0.1:7708/ingest/456d8f43-94d0-4fe7-a952-1db9bb5def71',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'279f56'},body:JSON.stringify({sessionId:'279f56',runId:'initial',hypothesisId:'H1',location:'src/components/landing/auth-modal.tsx:58',message:'auth effect redirecting to dashboard',data:{isAuthenticated,isOpen},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      onClose()
      if (typeof window !== "undefined" && window.location.pathname !== "/dashboard") {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, onClose, router])

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    setErrors({})
    setFormData({ name: "", email: "", password: "", rememberMe: false })
  }, [activeTab, isOpen])

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (activeTab === "signup") {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required"
      } else if (!validateName(formData.name)) {
        newErrors.name = "Name can only contain letters and spaces"
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (activeTab === "signup" && !validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters with 1 number and 1 special character"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    login(formData.name || "User", formData.email, formData.rememberMe)
    
    setIsSubmitting(false)
  }

  const getFieldStatus = (field: keyof ValidationErrors) => {
    if (errors[field]) return "error"
    if (formData[field === "name" ? "name" : field === "email" ? "email" : "password"]) return "valid"
    return "default"
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/5">
              <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors z-10"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {activeTab === "login" ? "Welcome back" : "Create your account"}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeTab === "login"
                      ? "Sign in to continue your trust analysis"
                      : "Start securing your AI-generated code"}
                  </p>
                </div>

                <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg mb-6">
                  {(["login", "signup"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setActiveTab(tab); setErrors({}) }}
                      className={`relative flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-background rounded-md shadow-sm"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">
                        {tab === "login" ? "Login" : "Sign Up"}
                      </span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {activeTab === "signup" && (
                      <motion.div
                        key="name"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => {
                              setFormData({ ...formData, name: e.target.value })
                              if (errors.name) setErrors({ ...errors, name: undefined })
                            }}
                            className={`bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 ${
                              errors.name ? "border-destructive focus:border-destructive" : ""
                            }`}
                          />
                          {formData.name && !errors.name && (
                            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                          )}
                        </div>
                        {errors.name && (
                          <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.name}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        if (errors.email) setErrors({ ...errors, email: undefined })
                      }}
                      className={`bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 ${
                        errors.email ? "border-destructive focus:border-destructive" : ""
                      }`}
                    />
                    {formData.email && validateEmail(formData.email) && !errors.email && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value })
                        if (errors.password) setErrors({ ...errors, password: undefined })
                      }}
                      className={`bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 pr-10 ${
                        errors.password ? "border-destructive focus:border-destructive" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </p>
                  )}

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, rememberMe: checked as boolean })
                      }
                      className="mt-0.5 border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Remember me
                    </label>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
                    <Lock className="h-3.5 w-3.5 text-primary shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Your session stays locally on your device
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isSubmitting ? "Please wait..." : "Continue Securely"}
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}