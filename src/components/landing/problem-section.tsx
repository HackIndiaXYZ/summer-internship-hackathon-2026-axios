"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { AlertTriangle, Package, Zap } from "lucide-react"

const problems = [
  {
    icon: AlertTriangle,
    title: "Blind Trust",
    description: "Developers increasingly deploy AI-generated code they didn't fully review.",
  },
  {
    icon: Package,
    title: "Hallucinated Dependencies",
    description: "AI assistants may suggest insecure or non-existent libraries.",
  },
  {
    icon: Zap,
    title: "Unsafe Shortcuts",
    description: "Generated boilerplate often prioritizes speed over safety.",
  },
]

export function ProblemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-medium text-primary/80 tracking-wide uppercase mb-4 block">
            The Problem
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            AI is changing how we write code
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-pretty">
            But with speed comes risk. Without proper verification, AI-generated code can introduce critical vulnerabilities.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              className="group relative"
            >
              <div className="relative p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 h-full">
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                    <problem.icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {problem.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
