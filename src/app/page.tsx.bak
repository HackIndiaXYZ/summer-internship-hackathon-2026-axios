"use client"

import { useState, useEffect, Suspense } from "react"
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { ProblemSection } from "@/components/landing/problem-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { PrivacySection } from "@/components/landing/privacy-section"
import { FinalCTA } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"
import { AuthModal } from "@/components/landing/auth-modal"
import { validateRepoUrl } from "@/lib/analysis-controller"
import { useApp, writePendingLiveScan } from "@/lib/store"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

function HomeContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authTab, setAuthTab] = useState<"login" | "signup">("login")
  const { isAuthenticated } = useApp()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const requireAuth = searchParams.get("requireAuth")
    if (requireAuth === "true") {
      setAuthTab("signup")
      setAuthModalOpen(true)
      router.replace("/")
    }
  }, [searchParams, router])

  const handleOpenAuth = (tab: "login" | "signup") => {
    setAuthTab(tab)
    setAuthModalOpen(true)
  }

  const handleAnalyze = (repo: string) => {
    const validation = validateRepoUrl(repo)
    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: "Invalid repository",
        description: validation.error,
      })
      return
    }

    writePendingLiveScan(repo)

    if (!isAuthenticated) {
      setAuthTab("signup")
      setAuthModalOpen(true)
      return
    }

    router.push("/dashboard?run=live")
  }

  const handleTryDemo = () => {
    router.push("/dashboard?run=demo")
  }

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <Navbar onOpenAuth={handleOpenAuth} />
      <Hero onAnalyze={handleAnalyze} onTryDemo={handleTryDemo} />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <PrivacySection />
      <FinalCTA onAnalyze={handleAnalyze} onTryDemo={handleTryDemo} />
      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authTab}
      />
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}