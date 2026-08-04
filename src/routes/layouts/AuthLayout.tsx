import { Outlet } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileSearch, Shield, BarChart3, Zap } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--foreground)) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Decorative Glass Cards */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-3xl border border-border/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(37,99,235,0.08)] transform rotate-12" />
        <div className="absolute bottom-40 right-20 w-48 h-48 rounded-2xl border border-border/70 bg-white/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(16,185,129,0.08)] transform -rotate-6" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full blur-3xl bg-gradient-to-br from-[#2563EB]/10 to-[#10B981]/10" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563EB]/10 to-[#10B981]/10 border border-border flex items-center justify-center">
                <img src="/logo.png" alt="DOCKY Logo" className="w-7 h-7" />
              </div>
              <span className="text-2xl font-bold text-foreground tracking-tight">
                DOCKY
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-6">
              AI-Powered
              <br />
              <span className="bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#10B981] bg-clip-text text-transparent">
                Document Intelligence
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-12 max-w-md">
              Transform your contract management with advanced AI analysis,
              compliance scoring, and risk detection.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Shield, text: "Automated Compliance Analysis" },
                { icon: BarChart3, text: "Risk Assessment & Scoring" },
                { icon: Zap, text: "Instant AI-Powered Insights" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted/50 backdrop-blur flex items-center justify-center border border-border/20">
                    <feature.icon className="w-4 h-4 text-foreground/70" />
                  </div>
                  <span className="text-muted-foreground">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative bg-background">
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <Outlet />
          </motion.div>
        </div>

        {/* Footer */}
        <div className="py-6 text-center text-sm text-muted-foreground border-t border-border">
          <p>&copy; {new Date().getFullYear()} DOCKY. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
