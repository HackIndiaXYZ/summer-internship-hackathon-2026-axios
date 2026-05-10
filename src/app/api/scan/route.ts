import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { GoogleGenerativeAI } from "@google/generative-ai";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json();
    
    // URL Cleanup: Extract owner/repo and strip away ".git" if present
    const urlParts = repoUrl.replace("https://github.com/", "").split("/");
    const owner = urlParts[0];
    const repo = urlParts[1]?.replace(/\.git$/, "");

    if (!owner || !repo) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }

    // 1. Fetch File Tree using HEAD to be branch-agnostic
    const { data: tree } = await octokit.rest.git.getTree({
      owner, 
      repo, 
      tree_sha: "HEAD", 
      recursive: "true",
    });

    const findings: any[] = [];
    let confidenceScore = 100;

    // 2. Filter for JS/TS files and limit to the first 3 for speed
    const codeFiles = tree.tree.filter(f => /\.(js|ts|tsx)$/.test(f.path || "")).slice(0, 3);

    for (const file of codeFiles) {
      const { data: fileContent }: any = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: file.path!,
      });

      const content = Buffer.from(fileContent.content, "base64").toString("utf-8");

      // --- STAGE 4: AI Logic Layer ---
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `Analyze this code for security risks like hardcoded secrets, dangerous functions, or non-existent libraries.
      Return ONLY a JSON array of objects: [{ "issue": string, "severity": "High" | "Medium", "reason": string }]
      
      Code:
      ${content.substring(0, 2000)}`;

      try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const cleanedJson = responseText.replace(/```json|```/g, "").trim();
        const aiResponse = JSON.parse(cleanedJson);

        aiResponse.forEach((finding: any) => {
          findings.push({ ...finding, file: file.path });
          // Stage 7: Deduction Algorithm
          confidenceScore -= (finding.severity === "High" ? 15 : 5);
        });
      } catch (aiError) {
        console.error("Individual File AI Error:", aiError);
        continue; 
      }
    }

    return NextResponse.json({ 
      success: true, 
      findings, 
      score: Math.max(0, confidenceScore) 
    });

  } catch (error: any) {
    console.error("Master Scan Error:", error);
    return NextResponse.json({ error: "Scan failed: " + error.message }, { status: 500 });
  }
}