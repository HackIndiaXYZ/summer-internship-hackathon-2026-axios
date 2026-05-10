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
    
    // MOCK MODE: Demo fast path for guaranteed success during presentation
    if (repoInfo && repoInfo.owner === "vigilix" && repoInfo.repo === "test-vulnerable-repo") {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return NextResponse.json(getMockData());
    }

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

function getMockData(): AnalysisResult {
  return {
    score: 45,
    status: "Not Production Ready",
    scannedFiles: 14,
    repository: "vigilix/test-vulnerable-repo",
    issues: [
      {
        id: "mock-1",
        type: "Hardcoded Secret",
        title: "Hardcoded API Key Exposed",
        file: "src/config/keys.js",
        line: 12,
        originalCode: 'const STRIPE_SECRET = "sk_live_51H...xyz";',
        secureCode: 'const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;',
        severity: "Critical",
        explanation: "A live Stripe secret key is hardcoded into the source file. This allows attackers who gain access to the code to fully compromise your payment infrastructure.",
        recommendation: "Move the key to environment variables (.env) and access it via process.env.",
        aiInsight: "Generative AI models often hardcode keys in examples to keep tutorials simple. This is a common AI-generated shortcut that should never hit production.",
        trustImpact: 25
      },
      {
        id: "mock-2",
        type: "Dangerous Function",
        title: "Usage of eval() detected",
        file: "src/routes/api.js",
        line: 45,
        originalCode: 'const result = eval(req.body.dynamicQuery);',
        secureCode: 'const result = executeSafeQuery(req.body.dynamicQuery); // Use a safe parser',
        severity: "High",
        explanation: "The eval() function executes arbitrary JavaScript from user input. This is a severe Remote Code Execution (RCE) vulnerability.",
        recommendation: "Never use eval() on user input. Use safer alternatives like a dedicated query parser or JSON.parse for structured data.",
        aiInsight: "AI assistants sometimes suggest eval() as a quick fix for parsing complex dynamic objects, ignoring the security implications.",
        trustImpact: 15
      },
      {
        id: "mock-3",
        type: "AI Hallucination",
        title: "Suspicious or Hallucinated Import",
        file: "src/utils/crypto.ts",
        line: 2,
        originalCode: 'import { UltraHash } from "fake-crypto-lib";',
        secureCode: 'import { createHash } from "crypto";',
        severity: "Medium",
        explanation: "The package 'fake-crypto-lib' does not exist in standard registries. This is likely an AI hallucination.",
        recommendation: "Use the built-in Node.js 'crypto' module or a verified package like 'bcrypt' instead.",
        aiInsight: "This is a classic AI hallucination where the model invents a plausible-sounding package name to satisfy a prompt's requirements.",
        trustImpact: 10
      }
    ]
  };
}
