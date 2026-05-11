"use client"

import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/landing/navbar"
import { AuthModal } from "@/components/landing/auth-modal"
import { Dashboard } from "@/components/Dashboard"
import { Scanner } from "@/components/Scanner"
import {
  useApp,
  consumePendingLiveScan,
  peekPendingLiveScan,
  clearPendingLiveScan,
  writePendingLiveScan,
  type AnalysisHistoryItem,
} from "@/lib/store"
import { validateRepoUrl } from "@/lib/analysis-controller"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import {
  BarChart3,
  History,
  Play,
  Plus,
  Search,
  Shield,
  User,
  LogOut,
  ArrowRight,
} from "lucide-react"

/** Prevents duplicate demo runs when React Strict Mode remounts before `run` clears. */
let demoRunQueryHandled = false

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const {
    user,
    isAuthenticated,
    logout,
    analysisHistory,
    startAnalysis,
    isLoading,
  } = useApp()

  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authTab, setAuthTab] = useState<"login" | "signup">("login")
  const [showScanner, setShowScanner] = useState(false)
  const [newRepoUrl, setNewRepoUrl] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedScan = useMemo(() => {
    if (selectedId) {
      return analysisHistory.find((h) => h.id === selectedId) ?? null
    }
    return analysisHistory[0] ?? null
  }, [analysisHistory, selectedId])

  const handleOpenAuth = useCallback((tab: "login" | "signup") => {
    setAuthTab(tab)
    setAuthModalOpen(true)
  }, [])

  const runDemoScan = useCallback(async () => {
    setShowScanner(true)
    try {
      const item = await startAnalysis("", "demo")
      setSelectedId(item.id)
    } catch (e: unknown) {
      toast({
        variant: "destructive",
        title: "Demo failed",
        description: e instanceof Error ? e.message : "Something went wrong",
      })
    } finally {
      setShowScanner(false)
    }
  }, [startAnalysis])

  const runLiveScan = useCallback(
    async (repo: string) => {
      setShowScanner(true)
      try {
        const item = await startAnalysis(repo, "live")
        setSelectedId(item.id)
      } catch (e: unknown) {
        toast({
          variant: "destructive",
          title: "Analysis failed",
          description: e instanceof Error ? e.message : "Something went wrong",
        })
      } finally {
        setShowScanner(false)
      }
    },
    [startAnalysis]
  )

  const run = searchParams.get("run")

  useEffect(() => {
    if (run !== "demo") {
      demoRunQueryHandled = false
      return
    }
    if (demoRunQueryHandled) return
    demoRunQueryHandled = true
    clearPendingLiveScan()
    void (async () => {
      await runDemoScan()
      router.replace("/dashboard", { scroll: false })
    })()
  }, [run, router, runDemoScan])

  useEffect(() => {
    if (run !== "live" || !isAuthenticated) return
    const pending = consumePendingLiveScan()
    if (!pending) {
      router.replace("/dashboard", { scroll: false })
      return
    }
    void (async () => {
      await runLiveScan(pending.repo)
      router.replace("/dashboard", { scroll: false })
    })()
  }, [run, isAuthenticated, router, runLiveScan])

  useEffect(() => {
    if (!isAuthenticated || run === "live") return
    if (!peekPendingLiveScan()) return
    const pending = consumePendingLiveScan()
    if (!pending) return
    void runLiveScan(pending.repo)
  }, [isAuthenticated, run, runLiveScan])

  const totalScans = analysisHistory.length
  const avgScore =
    totalScans > 0
      ? Math.round(
          analysisHistory.reduce((sum, h) => sum + h.score, 0) / totalScans
        )
      : 0
  const latest = analysisHistory[0]

  const handleNewRepoAnalyze = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newRepoUrl.trim()
    const validation = validateRepoUrl(trimmed)
    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: "Invalid repository",
        description: validation.error,
      })
      return
    }
    writePendingLiveScan(trimmed)
    if (!isAuthenticated) {
      setAuthTab("signup")
      setAuthModalOpen(true)
      return
    }
    void runLiveScan(trimmed)
    setNewRepoUrl("")
  }

  const handleTryDemoClick = () => {
    void runDemoScan()
  }

  const handleRerun = async (item: AnalysisHistoryItem) => {
    if (item.mode === "demo") {
      await runDemoScan()
      return
    }
    if (!isAuthenticated) {
      writePendingLiveScan(item.repository)
      setAuthTab("signup")
      setAuthModalOpen(true)
      return
    }
    await runLiveScan(item.repository)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onOpenAuth={handleOpenAuth} />

      {showScanner && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/90 backdrop-blur-sm px-4">
          <Scanner />
        </div>
      )}

      <main className="container mx-auto pt-24 pb-16 px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Total scans
                  </p>
                  <p className="text-3xl font-bold">{totalScans}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Avg trust score
                  </p>
                  <p className="text-3xl font-bold">{avgScore}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card border border-border rounded-xl p-5 sm:col-span-2 xl:col-span-2"
                >
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Latest scan
                  </p>
                  <p className="font-mono text-sm truncate">
                    {latest?.repository ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {latest
                      ? `${latest.status} · ${latest.mode === "demo" ? "Demo" : "Live"}`
                      : "Run a scan to populate metrics"}
                  </p>
                </motion.div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                New scan
              </h2>
              <form
                onSubmit={handleNewRepoAnalyze}
                className="flex flex-col lg:flex-row gap-3"
              >
                <div className="relative flex-1 flex items-center gap-2 rounded-lg border border-border bg-secondary/20 px-3">
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    value={newRepoUrl}
                    onChange={(e) => setNewRepoUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                  />
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary text-primary-foreground"
                  >
                    Analyze
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={handleTryDemoClick}
                    className="border-primary/30 text-primary"
                  >
                    Try demo
                  </Button>
                </div>
              </form>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <History className="h-5 w-5 text-muted-foreground" />
                Scan history
              </h2>
              <div className="space-y-2">
                {analysisHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-10 border border-dashed border-border rounded-xl">
                    No scans yet
                  </p>
                ) : (
                  analysisHistory.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full text-left flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border transition-colors ${
                        selectedScan?.id === item.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:bg-secondary/30"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-sm truncate">
                            {item.repository}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                              item.mode === "demo"
                                ? "bg-accent/20 text-accent"
                                : "bg-primary/15 text-primary"
                            }`}
                          >
                            {item.mode}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p
                            className={`text-xl font-bold ${
                              item.score >= 80
                                ? "text-primary"
                                : item.score >= 50
                                  ? "text-yellow-500"
                                  : "text-destructive"
                            }`}
                          >
                            {item.score}
                          </p>
                          <p className="text-xs text-muted-foreground max-w-[140px] truncate">
                            {item.status}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="shrink-0"
                          disabled={isLoading}
                          onClick={(e) => {
                            e.stopPropagation()
                            void handleRerun(item)
                          }}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">Report</h2>
              {selectedScan ? (
                <Dashboard result={selectedScan} />
              ) : (
                <div className="border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground">
                  Select a scan from history or run a new scan.
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                Profile
              </h2>
              {isAuthenticated && user ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Name
                    </p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-sm break-all">{user.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => logout()}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Sign in to run live repository scans and keep them in your
                    session history.
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => handleOpenAuth("login")}
                  >
                    Log in
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOpenAuth("signup")}
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-card/50 border border-border/60 rounded-xl p-5 text-sm text-muted-foreground flex gap-3">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p>
                Demo scans never leave your browser. Live scans call the
                analysis API and require an account.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authTab}
      />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
