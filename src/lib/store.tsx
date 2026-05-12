"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AnalysisResult } from "@/types"

interface User {
  name: string
  email: string
  isLoggedIn: boolean
}

export interface AnalysisHistoryItem extends AnalysisResult {
  id: string
  timestamp: Date
  mode: "demo" | "live"
}

interface AppContextType {
  user: User | null
  isAuthenticated: boolean
  login: (name: string, email: string, rememberMe: boolean) => void
  logout: () => void
  currentResult: AnalysisResult | null
  analysisHistory: AnalysisHistoryItem[]
  startAnalysis: (repoUrl: string, mode: "demo" | "live") => Promise<AnalysisHistoryItem>
  addToHistory: (result: AnalysisResult, mode: "demo" | "live") => AnalysisHistoryItem
  clearCurrentResult: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const PENDING_SCAN_STORAGE_KEY = "vigilix_pending_scan"

export function writePendingLiveScan(repo: string): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(
    PENDING_SCAN_STORAGE_KEY,
    JSON.stringify({ mode: "live" as const, repo: repo.trim() })
  )
}

export function peekPendingLiveScan(): { mode: "live"; repo: string } | null {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem(PENDING_SCAN_STORAGE_KEY)
  if (!raw) return null
  try {
    const j = JSON.parse(raw) as { mode?: string; repo?: string }
    if (j?.mode === "live" && typeof j.repo === "string" && j.repo.length > 0) {
      return { mode: "live", repo: j.repo }
    }
  } catch {
    /* ignore */
  }
  return null
}

export function clearPendingLiveScan(): void {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(PENDING_SCAN_STORAGE_KEY)
}

export function consumePendingLiveScan(): { mode: "live"; repo: string } | null {
  const p = peekPendingLiveScan()
  if (p) clearPendingLiveScan()
  return p
}

const DEMO_RESULT: AnalysisResult = {
  score: 40,
  status: "Not Production Ready",
  mode: "demo",
  issues: [
    {
      id: "demo-1",
      type: "Hardcoded Secret",
      title: "Hardcoded API Key Exposed",
      file: "src/config/keys.js",
      line: 12,
      originalCode: 'const STRIPE_SECRET = "sk_live_51H...xyz";',
      secureCode: 'const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;',
      severity: "Critical",
      explanation: "A live Stripe secret key is hardcoded into the source file.",
      recommendation: "Move the key to environment variables.",
      aiInsight: "AI models often hardcode keys in examples to keep tutorials simple.",
      trustImpact: 25
    },
    {
      id: "demo-2",
      type: "Dangerous Function",
      title: "Usage of eval() detected",
      file: "src/routes/api.js",
      line: 45,
      originalCode: 'const result = eval(req.body.dynamicQuery);',
      secureCode: 'const result = executeSafeQuery(req.body.dynamicQuery);',
      severity: "High",
      explanation: "The eval() function executes arbitrary JavaScript from user input.",
      recommendation: "Never use eval() on user input.",
      aiInsight: "AI assistants sometimes suggest eval() as a quick fix.",
      trustImpact: 15
    },
    {
      id: "demo-3",
      type: "AI Hallucination",
      title: "Suspicious Import",
      file: "src/utils/crypto.ts",
      line: 2,
      originalCode: 'import { UltraHash } from "fake-crypto-lib";',
      secureCode: 'import { createHash } from "crypto";',
      severity: "Medium",
      explanation: "The package 'fake-crypto-lib' does not exist.",
      recommendation: "Use the built-in Node.js crypto module.",
      aiInsight: "This is a classic AI hallucination.",
      trustImpact: 10
    },
    {
      id: "demo-4",
      type: "Performance",
      title: "N+1 query pattern in list endpoint",
      file: "src/services/users.ts",
      line: 88,
      originalCode:
        "for (const id of ids) { const u = await db.user.findUnique({ where: { id } }); }",
      secureCode:
        "const users = await db.user.findMany({ where: { id: { in: ids } } });",
      severity: "Low",
      explanation:
        "Each iteration hits the database separately, which scales poorly under load.",
      recommendation:
        "Batch-fetch with findMany / a single JOIN, or use DataLoader-style caching.",
      aiInsight:
        "AI-generated CRUD snippets often use the simplest loop pattern without considering query cost.",
      trustImpact: 5
    },
    {
      id: "demo-5",
      type: "Performance",
      title: "Heavy component re-renders on every keystroke",
      file: "src/components/SearchPanel.tsx",
      line: 34,
      originalCode:
        "const filtered = hugeList.filter((x) => x.name.includes(query));",
      secureCode:
        "const filtered = useMemo(() => hugeList.filter((x) => x.name.includes(query)), [hugeList, query]);",
      severity: "Low",
      explanation:
        "Recomputing large arrays on each render increases TTI and can block the main thread.",
      recommendation:
        "Memoize derived data, debounce input, or move filtering to a worker or server.",
      aiInsight:
        "Models frequently omit useMemo/useCallback when scaffolding interactive UIs.",
      trustImpact: 5
    }
  ],
  scannedFiles: 14,
  repository: "vigilix/test-vulnerable-repo"
}

const SEEDED_HISTORY: AnalysisHistoryItem[] = [
  {
    id: "seed-demo",
    repository: "demo/sample-ai-service",
    score: 52,
    status: "Needs Review",
    issues: [],
    scannedFiles: 42,
    mode: "demo",
    timestamp: new Date(Date.now() - 86400000 * 3)
  },
  {
    id: "seed-1",
    repository: "facebook/react",
    score: 92,
    status: "Safe To Ship",
    issues: [],
    scannedFiles: 156,
    mode: "live",
    timestamp: new Date(Date.now() - 86400000 * 2)
  },
  {
    id: "seed-2",
    repository: "expressjs/express",
    score: 78,
    status: "Needs Review",
    issues: [
      {
        id: "seed-issue-1",
        type: "Insecure Protocol",
        title: "Insecure HTTP request found",
        file: "lib/app.js",
        line: 45,
        originalCode: "http.get('http://api.example.com')",
        secureCode: "https.get('https://api.example.com')",
        severity: "Medium",
        explanation: "Insecure HTTP protocol used",
        recommendation: "Use HTTPS",
        aiInsight: "AI sometimes suggests HTTP for simplicity",
        trustImpact: 8
      }
    ],
    scannedFiles: 89,
    mode: "live",
    timestamp: new Date(Date.now() - 86400000)
  }
]

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistoryItem[]>(SEEDED_HISTORY)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // #region agent log
    // #endregion
    const stored = localStorage.getItem("vigilix_user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {}
    }
  }, [])

  const login = (name: string, email: string, rememberMe: boolean) => {
    // #region agent log
    // #endregion
    const userData = { name, email, isLoggedIn: true }
    setUser(userData)
    if (rememberMe) {
      localStorage.setItem("vigilix_user", JSON.stringify(userData))
    } else {
      sessionStorage.setItem("vigilix_user", JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("vigilix_user")
    sessionStorage.removeItem("vigilix_user")
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      router.push("/")
    }
  }

  const addToHistory = (result: AnalysisResult, mode: "demo" | "live"): AnalysisHistoryItem => {
    const newItem: AnalysisHistoryItem = {
      ...result,
      mode,
      id: `scan-${Date.now()}`,
      timestamp: new Date()
    }
    setAnalysisHistory(prev => [newItem, ...prev])
    setCurrentResult(result)
    return newItem
  }

  const clearCurrentResult = () => setCurrentResult(null)

  const startAnalysis = async (repoUrl: string, mode: "demo" | "live"): Promise<AnalysisHistoryItem> => {
    setIsLoading(true)

    try {
      if (mode === "demo") {
        await new Promise(resolve => setTimeout(resolve, 2000))
        const result: AnalysisResult = {
          ...DEMO_RESULT,
          repository: repoUrl.trim() || DEMO_RESULT.repository,
          mode: "demo"
        }
        return addToHistory(result, "demo")
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: repoUrl }),
      })
const text = await response.text()

let parsed: AnalysisResult

try {
  parsed = JSON.parse(text)
} catch {
  throw new Error(text || "Invalid server response")
}

if (!response.ok) {
  throw new Error(
    (parsed as any)?.error || "Analysis failed"
  )
}

const result: AnalysisResult = {
  ...parsed,
  mode: "live",
}
      return addToHistory(result, "live")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        currentResult,
        analysisHistory,
        startAnalysis,
        addToHistory,
        clearCurrentResult,
        isLoading,
        setIsLoading
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}