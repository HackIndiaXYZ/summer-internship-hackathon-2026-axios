import { NextResponse } from "next/server";
import { parseGitHubUrl, fetchRepoContents } from "@/lib/github";
import { runStaticAnalysis } from "@/lib/analyzer";
import { enhanceIssueWithAI } from "@/lib/gemini";
import { AnalysisResult, Issue } from "@/types";

export const maxDuration = 10; // Enforce Vercel max duration limit on Hobby tier

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const repoInfo = parseGitHubUrl(url);

    if (!repoInfo) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }

    // 1. Fetch Repository Contents
    const files = await fetchRepoContents(repoInfo.owner, repoInfo.repo);
    
    if (files.length === 0) {
      return NextResponse.json({ error: "Repository is empty or unreadable" }, { status: 404 });
    }

    // 2. Static Analysis
    const staticResults = runStaticAnalysis(files);

    // 3. AI Verification (Limit to max 3 issues to stay under 10s limit for free tier)
    const issues: Issue[] = [];
    const issuesToProcess = staticResults.slice(0, 3);
    
    // Process in parallel to save time
    const aiPromises = issuesToProcess.map((result, idx) => enhanceIssueWithAI(result, idx + 1));
    const aiEnhancedIssues = await Promise.all(aiPromises);
    
    issues.push(...aiEnhancedIssues);

    // 4. Calculate Trust Score
    let score = 100;
    for (const issue of issues) {
      score -= issue.trustImpact;
    }
    score = Math.max(0, Math.min(100, score)); // Clamp 0-100

    let status: AnalysisResult["status"] = "Safe To Ship";
    if (score < 50) status = "Not Production Ready";
    else if (score < 85) status = "Needs Review";

    const responseData: AnalysisResult = {
      score,
      status,
      issues,
      scannedFiles: files.length,
      repository: `${repoInfo.owner}/${repoInfo.repo}`,
    };

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error("API Analyze Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
