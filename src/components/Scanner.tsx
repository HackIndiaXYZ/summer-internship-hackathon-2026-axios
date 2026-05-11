"use client"
import { motion } from "framer-motion";
import { Search, ShieldAlert, Cpu, Fingerprint } from "lucide-react";

const steps = [
  { icon: Search, text: "Cloning Repository In-Memory" },
  { icon: Fingerprint, text: "Running Static Analysis" },
  { icon: Cpu, text: "Detecting AI Hallucinations" },
  { icon: ShieldAlert, text: "Generating Secure Patches" }
];

export function Scanner() {
  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-xl bg-card border border-border flex flex-col items-center justify-center space-y-8">
      {/* Glowing Radar Animation */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
        <div className="absolute inset-2 rounded-full border border-primary/40"></div>
        <motion.div 
          className="absolute inset-0 rounded-full bg-primary/10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <Cpu className="w-12 h-12 text-primary animate-pulse" />
      </div>

      <div className="space-y-4 w-full">
        <h3 className="text-xl font-bold text-center text-foreground animate-pulse">
          Analyzing Codebase
        </h3>
        <div className="space-y-3">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.5 }}
              className="flex items-center space-x-3 text-muted-foreground"
            >
              <step.icon className="w-5 h-5 text-accent" />
              <span className="text-sm">{step.text}...</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
