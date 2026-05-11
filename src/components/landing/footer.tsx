"use client"

import { motion } from "framer-motion"
import { Shield } from "lucide-react"
import { FaGithub } from "react-icons/fa"
const footerLinks = [
  { label: "Documentation", href: "#" },
  { label: "Security", href: "#privacy" },
  { label: "Privacy", href: "#privacy" },
  { label: "Github", href: "https://github.com", icon: FaGithub },
]

export function Footer() {
  return (
    <footer className="relative border-t border-border/50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-2.5 group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="relative">
              <Shield className="h-6 w-6 text-primary" />
              <div className="absolute inset-0 blur-lg bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">
              Vigilix AI
            </span>
          </motion.a>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {footerLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ y: -1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </motion.a>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Vigilix AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
