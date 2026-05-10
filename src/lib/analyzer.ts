import { Issue, Severity } from "../types";

export interface StaticAnalysisResult {
  file: string;
  line: number;
  type: string;
  title: string;
  originalCode: string;
}

const HEURISTICS = [
  {
    regex: /(?:API_KEY|SECRET|TOKEN|PASSWORD)\s*=\s*['"][a-zA-Z0-9_\-]+['"]/i,
    type: "Hardcoded Secret",
    title: "Hardcoded API Key or Secret Exposed"
  },
  {
    regex: /eval\s*\(/,
    type: "Dangerous Function",
    title: "Usage of eval() detected"
  },
  {
    regex: /dangerouslySetInnerHTML/,
    type: "XSS Vulnerability",
    title: "dangerouslySetInnerHTML used"
  },
  {
    regex: /http:\/\/[^\s'"]+/,
    type: "Insecure Protocol",
    title: "Insecure HTTP request found"
  },
  {
    regex: /from\s+['"](fake-[a-z]+|hallucinated-[a-z]+)['"]/i,
    type: "AI Hallucination",
    title: "Suspicious or Hallucinated Import"
  }
];

export function runStaticAnalysis(files: { path: string; content: string }[]): StaticAnalysisResult[] {
  const results: StaticAnalysisResult[] = [];

  for (const file of files) {
    const lines = file.content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const lineContent = lines[i];
      
      for (const rule of HEURISTICS) {
        if (rule.regex.test(lineContent)) {
          results.push({
            file: file.path,
            line: i + 1,
            type: rule.type,
            title: rule.title,
            originalCode: lineContent.trim(),
          });
        }
      }
    }
  }

  return results;
}
