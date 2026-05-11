"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Shield, Eye, EyeOff, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: "login" | "signup"
}

export function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rememberDevice: false,
    saveSession: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle auth logic here
    console.log("Form submitted:", formData)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/5">
              {/* Glow effect */}
              <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors z-10"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative p-8">
                {/* Header */}
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

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg mb-6">
                  {(["login", "signup"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
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

                {/* Form */}
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
                        <Input
                          type="text"
                          placeholder="Name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  />

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="remember"
                      checked={
                        activeTab === "login"
                          ? formData.rememberDevice
                          : formData.saveSession
                      }
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          [activeTab === "login" ? "rememberDevice" : "saveSession"]:
                            checked as boolean,
                        })
                      }
                      className="mt-0.5 border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {activeTab === "login"
                        ? "Remember this device"
                        : "Save my local device session"}
                    </label>
                  </div>

                  {/* Privacy note */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
                    <Lock className="h-3.5 w-3.5 text-primary shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      {activeTab === "login"
                        ? "We never permanently store repository data."
                        : "Your session stays locally on your device."}
                    </p>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                  >
                    Continue Securely
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
