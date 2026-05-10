export type Severity = "Critical" | "High" | "Medium" | "Low";

export interface Issue {
  id: string;
  type: string;
  severity: Severity;
  file: string;
  line: number;
  title: string;
  explanation: string;
  recommendation: string;
  aiInsight: string;
  trustImpact: number;
  originalCode: string;
  secureCode: string;
}

export interface AnalysisResult {
  score: number;
  status: "Safe To Ship" | "Needs Review" | "Not Production Ready";
  issues: Issue[];
  scannedFiles: number;
  repository: string;
}

export interface RepoDetails {
  owner: string;
  repo: string;
}
