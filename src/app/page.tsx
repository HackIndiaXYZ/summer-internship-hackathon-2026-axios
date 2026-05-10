"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronRight, Lock } from "lucide-react";
import { Scanner } from "@/components/Scanner";
import { Dashboard } from "@/components/Dashboard";
import { AnalysisResult } from "@/types";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze repository");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const setDemoUrl = () => {
    setUrl("https://github.com/vigilix/test-vulnerable-repo");
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setResult(null); setIsScanning(false); }}>
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">Vigilix <span className="text-primary">AI</span></span>
          </div>
          <nav className="flex items-center space-x-4 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
            <a href="#" className="hover:text-foreground transition-colors">Security</a>
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold flex items-center border border-primary/20">
              <Lock className="w-3 h-3 mr-1" />
              Privacy-First
            </div>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <AnimatePresence mode="wait">
          {!isScanning && !result && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto text-center space-y-8"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-sm font-medium mb-4">
                <span className="flex w-2 h-2 rounded-full bg-accent mr-2 animate-pulse"></span>
                Trust infrastructure for AI-assisted development
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                Secure your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  AI-Generated Code
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Determine whether your AI-generated code is trustworthy, secure, and ready to deploy. 
                We detect hallucinations, expose insecure shortcuts, and suggest secure rewrites.
              </p>

              <form onSubmit={handleAnalyze} className="max-w-xl mx-auto mt-12 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-card border border-border rounded-xl p-2 shadow-2xl">
                  <div className="pl-4 pr-2 text-muted-foreground flex items-center">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.3 5.3 0 0 0-.1-3.8s-1.3-.4-4 1.4a13.8 13.8 0 0 0-7 0c-2.7-1.8-4-1.4-4-1.4a5.3 5.3 0 0 0-.1 3.8 5.4 5.4 0 0 0-1.5 3.8c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path><path d="M9 18c-4.5 1.5-5-2.5-7-3"></path></svg>
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste a public GitHub URL..."
                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground px-2 py-3"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-bold transition-all flex items-center"
                  >
                    Analyze
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                {error && <p className="text-destructive text-sm mt-3 text-left">{error}</p>}
                
                <div className="mt-4 text-xs text-muted-foreground text-left">
                  Try the demo: <button type="button" onClick={setDemoUrl} className="text-accent hover:underline">vigilix/test-vulnerable-repo</button>
                </div>
              </form>

              <div className="pt-12 text-sm text-muted-foreground flex items-center justify-center space-x-2">
                <Shield className="w-4 h-4 opacity-50" />
                <span>We temporarily analyze public repositories in-memory and do not permanently store source code.</span>
              </div>
            </motion.div>
          )}

          {isScanning && (
            <motion.div 
              key="scanning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="py-20"
            >
              <Scanner />
            </motion.div>
          )}

          {result && !isScanning && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Dashboard result={result} />
              
              <div className="mt-12 text-center">
                <button 
                  onClick={() => setResult(null)}
                  className="px-6 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Scan Another Repository
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}