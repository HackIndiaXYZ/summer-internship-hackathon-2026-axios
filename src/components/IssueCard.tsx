import { Issue } from "@/types";
import { AlertTriangle, ShieldCheck, Zap, Info } from "lucide-react";
import { motion } from "framer-motion";

export function IssueCard({ issue }: { issue: Issue }) {
  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "Critical": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "High": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "Medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "Low": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden flex flex-col"
    >
      <div className="p-5 border-b border-border flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSeverityColor(issue.severity)}`}>
              {issue.severity}
            </span>
            <h3 className="text-lg font-semibold text-foreground">{issue.title}</h3>
          </div>
          <div className="flex items-center text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded inline-flex">
            <span>{issue.file}</span>
            <span className="mx-2 text-border">|</span>
            <span>Line {issue.line}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-destructive font-bold text-lg">-{issue.trustImpact}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Trust Impact</span>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Explanations */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center text-sm font-semibold text-foreground mb-1">
              <AlertTriangle className="w-4 h-4 mr-2 text-destructive" />
              The Risk
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{issue.explanation}</p>
          </div>
          
          <div>
            <div className="flex items-center text-sm font-semibold text-foreground mb-1">
              <ShieldCheck className="w-4 h-4 mr-2 text-primary" />
              Recommendation
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{issue.recommendation}</p>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <div className="flex items-center text-xs font-bold text-primary uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 mr-2" />
              AI Insight
            </div>
            <p className="text-sm text-foreground/90 italic">"{issue.aiInsight}"</p>
          </div>
        </div>

        {/* Side-by-Side Diff */}
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden border border-border">
            <div className="bg-red-950/30 px-3 py-2 border-b border-red-900/50 flex justify-between items-center">
              <span className="text-xs font-mono text-red-400">Original (Insecure)</span>
            </div>
            <div className="p-4 bg-black overflow-x-auto">
              <pre className="text-sm font-mono text-red-300">
                <code>- {issue.originalCode}</code>
              </pre>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden border border-border">
            <div className="bg-green-950/30 px-3 py-2 border-b border-green-900/50 flex justify-between items-center">
              <span className="text-xs font-mono text-green-400">Secure Rewrite</span>
            </div>
            <div className="p-4 bg-black overflow-x-auto">
              <pre className="text-sm font-mono text-green-300">
                <code>+ {issue.secureCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
