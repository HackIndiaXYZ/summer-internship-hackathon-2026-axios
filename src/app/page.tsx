"use client"

import { useState } from "react"
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { ProblemSection } from "@/components/landing/problem-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { PrivacySection } from "@/components/landing/privacy-section"
import { FinalCTA } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"
import { AuthModal } from "@/components/landing/auth-modal"


export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authTab, setAuthTab] = useState<"login" | "signup">("login")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleOpenAuth = (tab: "login" | "signup") => {
    setAuthTab(tab)
    setAuthModalOpen(true)
  }

  const handleAnalyze = (repo: string) => {
    // Check if user is authenticated (simulated)
    if (!isAuthenticated) {
      // Open auth modal if not authenticated
      setAuthTab("signup")
      setAuthModalOpen(true)
    } else {
      // Proceed with analysis
      console.log("Analyzing repository:", repo)
    }
  }

  const handleAuthClose = () => {
    setAuthModalOpen(false)
    // Simulate successful auth
    setIsAuthenticated(true)
  }

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <Navbar onOpenAuth={handleOpenAuth} />
      <Hero onAnalyze={handleAnalyze} />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <PrivacySection />
      <FinalCTA onAnalyze={handleAnalyze} />
      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={handleAuthClose}
        initialTab={authTab}
      />
    </main>
  )
}
