"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Shield, Database, HardDrive, Eye } from "lucide-react"

const privacyFeatures = [
  {
    icon: Database,
    title: "In-Memory Analysis",
    description: "Code is processed entirely in memory and discarded immediately after analysis.",
  },
  {
    icon: HardDrive,
    title: "Local Device Sessions",
    description: "Your authentication stays on your device. We never track across sessions.",
  },
  {
    icon: Eye,
    title: "No Permanent Storage",
    description: "Repository data is never persisted to disk. Your code remains yours alone.",
  },
]

export function PrivacySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} id="privacy" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Shield graphic */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative">
              {/* Glow rings */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 w-80 h-80 rounded-full border border-primary/20"
              />
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute inset-[-20px] w-[360px] h-[360px] rounded-full border border-primary/10"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute inset-[-40px] w-[400px] h-[400px] rounded-full border border-primary/5"
              />

              {/* Center shield */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-80 h-80 rounded-full bg-gradient-to-b from-primary/20 to-primary/5 flex items-center justify-center backdrop-blur-sm"
              >
                <div className="absolute inset-4 rounded-full bg-card/80 border border-border/50 flex items-center justify-center">
                  <Shield className="h-24 w-24 text-primary" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-medium text-primary/80 tracking-wide uppercase mb-4 block">
                Privacy-First
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
                Your code, your privacy
              </h2>
              <p className="text-muted-foreground text-lg mb-10 text-pretty">
                Security analysis shouldn&apos;t mean sacrificing privacy. Vigilix AI is built from the ground up with a privacy-first architecture.
              </p>
            </motion.div>

            {/* Privacy features */}
            <div className="space-y-6">
              {privacyFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
