import { AnalysisResult } from "@/types";
import { IssueCard } from "./IssueCard";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function Dashboard({ result }: { result: AnalysisResult }) {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "Safe To Ship": return { icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10" };
      case "Needs Review": return { icon: Shield, color: "text-yellow-500", bg: "bg-yellow-500/10" };
      default: return { icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10" };
    }
  };

  const StatusIcon = getStatusDetails(result.status).icon;
  const statusColor = getStatusDetails(result.status).color;
  const statusBg = getStatusDetails(result.status).bg;

  // Calculate circumference for the SVG ring
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.score / 100) * circumference;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {result.mode === "demo" && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-accent/20 text-accent border border-accent/30">
            Demo mode
          </Badge>
          <span className="text-sm text-muted-foreground">
            Sample AI vulnerability report for presentation
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Ring Card */}
        <div className="col-span-1 md:col-span-1 bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
            <Shield className="w-32 h-32" />
          </div>
          
          <h2 className="text-lg font-medium text-muted-foreground mb-6 z-10">AI Trust Score</h2>
          
          <div className="relative w-40 h-40 flex items-center justify-center z-10">
            {/* Background Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-muted"
              />
              {/* Progress Ring */}
              <motion.circle
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                className={result.score > 80 ? "text-primary" : result.score > 50 ? "text-yellow-500" : "text-destructive"}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black">{result.score}</span>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="col-span-1 md:col-span-2 bg-card border border-border rounded-xl p-8 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Target Repository</p>
              <h2 className="text-2xl font-bold font-mono text-foreground mt-1">{result.repository}</h2>
            </div>
            <div className={`flex items-center px-4 py-2 rounded-full border ${statusBg} border-current ${statusColor}`}>
              <StatusIcon className="w-5 h-5 mr-2" />
              <span className="font-bold">{result.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Files Scanned</p>
              <p className="text-2xl font-mono text-foreground">{result.scannedFiles}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Issues Found</p>
              <p className="text-2xl font-mono text-destructive">{result.issues.length}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">AI Insights</p>
              <p className="text-2xl font-mono text-accent">{result.issues.filter(i => i.aiInsight).length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold border-b border-border pb-2 flex items-center">
          <ShieldAlert className="w-5 h-5 mr-2 text-primary" />
          Vulnerability Report
        </h3>
        {result.issues.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
            <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-primary opacity-50" />
            <p>No issues detected. Codebase appears secure and ready for deployment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {result.issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
