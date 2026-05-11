"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { BarChart3, FileSearch, Wand2, Lock } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "AI Trust Score",
    description: "Get a comprehensive trust score for your AI-generated code based on security patterns, dependencies, and best practices.",
    size: "large",
  },
  {
    icon: FileSearch,
    title: "Explainable Security",
    description: "Understand exactly why code is flagged with clear, actionable explanations.",
    size: "small",
  },
  {
    icon: Wand2,
    title: "Secure Rewrite Suggestions",
    description: "Receive AI-powered suggestions to fix vulnerabilities while maintaining functionality.",
    size: "small",
  },
  {
    icon: Lock,
    title: "Privacy-First Analysis",
    description: "Your code is analyzed in-memory and never stored. We believe security shouldn't compromise privacy.",
    size: "large",
  },
]

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-medium text-primary/80 tracking-wide uppercase mb-4 block">
            The Solution
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Vigilix AI brings trust to AI code
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-pretty">
            A comprehensive platform designed to verify, explain, and secure every line of AI-generated code.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              className={`group relative ${feature.size === "large" ? "md:col-span-2" : ""}`}
            >
              <div className="relative overflow-hidden p-8 md:p-10 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                {/* Animated gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Corner glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6">
                  <div className="shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors"
                    >
                      <feature.icon className="h-7 w-7 text-primary" />
                    </motion.div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed max-w-2xl">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
