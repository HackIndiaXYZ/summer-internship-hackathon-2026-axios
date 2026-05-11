"use client"

import { useState } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FinalCTAProps {
  onAnalyze: (repo: string) => void
  onTryDemo?: () => void
}

export function FinalCTA({ onAnalyze, onTryDemo }: FinalCTAProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [repoUrl, setRepoUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (repoUrl.trim()) {
      onAnalyze(repoUrl)
    }
  }

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-background to-background" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Start Your Trust Analysis
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Verify your AI-generated code in seconds.
          </p>
        </motion.div>

        {/* Input */}
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="relative max-w-xl mx-auto"
        >
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center gap-2 p-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl focus-within:border-primary/50 transition-colors">
              <Search className="h-5 w-5 text-muted-foreground ml-4 shrink-0" />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="Enter GitHub repository URL..."
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground py-3 px-2"
              />
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 px-6 shrink-0"
              >
                Analyze
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              {onTryDemo && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onTryDemo}
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Try Demo
                </Button>
              )}
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  )
}
