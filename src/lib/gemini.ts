import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Issue, Severity } from "../types";
import { StaticAnalysisResult } from "./analyzer";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        severity: {
          type: SchemaType.STRING,
          description: "Must be one of: Critical, High, Medium, Low",
        },
        explanation: {
          type: SchemaType.STRING,
          description: "Plain English explanation of the security risk or hallucination",
        },
        recommendation: {
          type: SchemaType.STRING,
          description: "Plain English recommendation on how to fix it",
        },
        aiInsight: {
          type: SchemaType.STRING,
          description: "Insight into why this looks AI-generated or hallucinatory",
        },
        trustImpact: {
          type: SchemaType.NUMBER,
          description: "How many points to deduct from the Trust Score (2-25)",
        },
        secureCode: {
          type: SchemaType.STRING,
          description: "The securely rewritten line or block of code to replace the original",
        },
      },
      required: ["severity", "explanation", "recommendation", "aiInsight", "trustImpact", "secureCode"],
    },
  },
});

export async function enhanceIssueWithAI(
  rawResult: StaticAnalysisResult,
  idCounter: number
): Promise<Issue> {
  const prompt = `
    Analyze this code snippet found in a codebase.
    
    File: ${rawResult.file}
    Line: ${rawResult.line}
    Detected Issue Type: ${rawResult.type}
    Code:
    \`\`\`
    ${rawResult.originalCode}
    \`\`\`
    
    Provide an explainable security analysis, a secure code rewrite, and an insight into whether this is a common AI hallucination or AI-generated shortcut.
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const aiData = JSON.parse(responseText);

    return {
      id: `issue-${idCounter}`,
      type: rawResult.type,
      title: rawResult.title,
      file: rawResult.file,
      line: rawResult.line,
      originalCode: rawResult.originalCode,
      severity: aiData.severity as Severity,
      explanation: aiData.explanation,
      recommendation: aiData.recommendation,
      aiInsight: aiData.aiInsight,
      trustImpact: aiData.trustImpact,
      secureCode: aiData.secureCode,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if AI fails (e.g. rate limits)
    return {
      id: `issue-${idCounter}`,
      type: rawResult.type,
      title: rawResult.title,
      file: rawResult.file,
      line: rawResult.line,
      originalCode: rawResult.originalCode,
      severity: "Medium",
      explanation: "Failed to generate AI analysis due to API limits.",
      recommendation: "Review the code manually for security issues.",
      aiInsight: "Could not determine AI generation risk.",
      trustImpact: 5,
      secureCode: "// Secure code generation failed",
    };
  }
}
