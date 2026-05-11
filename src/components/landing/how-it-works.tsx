"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { GitBranch, Scan, Rocket } from "lucide-react"

const steps = [
  {
    icon: GitBranch,
    number: "01",
    title: "Paste Repository",
    description: "Enter your GitHub repository URL to begin the analysis.",
  },
  {
    icon: Scan,
    number: "02",
    title: "Analyze AI Risks",
    description: "Our engine scans for hallucinations, insecure patterns, and exposed secrets.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Ship With Confidence",
    description: "Review findings, apply fixes, and deploy knowing your code is secure.",
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-medium text-primary/80 tracking-wide uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Three steps to trust
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent origin-left"
          />

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                className="relative text-center group"
              >
                {/* Icon */}
                <div className="relative inline-block mb-8">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="relative z-10 w-28 h-28 rounded-3xl bg-card border border-border/50 flex items-center justify-center group-hover:border-primary/30 transition-colors"
                  >
                    {/* Glow */}
                    <div className="absolute inset-0 rounded-3xl bg-primary/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                    
                    <step.icon className="h-10 w-10 text-primary relative z-10" />
                  </motion.div>

                  {/* Number badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{step.number}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="md:hidden mt-8 text-primary/40"
                  >
                    <svg className="w-6 h-6 mx-auto rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
