import { Outlet } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';
import { FileSearch, Shield, BarChart3, Zap } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Glassmorphism Cards */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl backdrop-blur-xl border border-white/10 transform rotate-12" />
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl backdrop-blur-xl border border-white/10 transform -rotate-6" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <FileSearch className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">DocIntel</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              AI-Powered<br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Document Intelligence
              </span>
            </h1>

            <p className="text-lg text-slate-400 mb-12 max-w-md">
              Transform your contract management with advanced AI analysis, compliance scoring, and risk detection.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Shield, text: 'Automated Compliance Analysis' },
                { icon: BarChart3, text: 'Risk Assessment & Scoring' },
                { icon: Zap, text: 'Instant AI-Powered Insights' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-slate-300">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative bg-background">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

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
        <div className="py-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DocIntel. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
