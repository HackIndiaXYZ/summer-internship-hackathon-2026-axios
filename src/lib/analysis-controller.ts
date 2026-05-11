import { parseGitHubUrl } from "./github"

export type AnalysisMode = "demo" | "live"

export interface AnalysisResponse {
  success: boolean
  result?: any
  error?: string
  redirectPath?: string
}

export function validateRepoUrl(url: string): { valid: boolean; error?: string } {
  if (!url.trim()) {
    return { valid: false, error: "Please enter a repository URL" }
  }
  
  const parsed = parseGitHubUrl(url)
  if (!parsed) {
    return { valid: false, error: "Invalid GitHub URL format. Use: github.com/owner/repo" }
  }
  
  return { valid: true }
}

export async function runAnalysis(
  input: string,
  mode: AnalysisMode,
  startAnalysisFn: (url: string, mode: AnalysisMode) => Promise<any>
): Promise<AnalysisResponse> {
  try {
    const result = await startAnalysisFn(input, mode)
    return {
      success: true,
      result,
      redirectPath: "/dashboard"
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Analysis failed"
    }
  }
}