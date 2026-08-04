import React from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, FileText, Lock, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/70 bg-white/80 backdrop-blur-sm text-muted-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img className="w-8 h-8" src="/logo.png" alt="DOCKY Logo" />
              <span className="text-xl font-bold tracking-tight text-foreground">
                DOCKY
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              AI-powered contract & compliance intelligence SaaS. Upload PDF
              agreements for instant risk detection, structured clause
              extractions, and compliance verification.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/80 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted border border-border">
                <Lock className="w-3 h-3 text-emerald-500" /> AES-256 Encrypted
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted border border-border">
                <Sparkles className="w-3 h-3 text-amber-500" /> Enterprise AI
                (Zero Model Training)
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/upload"
                  className="hover:text-foreground transition-colors"
                >
                  Upload Contract
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/documents"
                  className="hover:text-foreground transition-colors"
                >
                  My Documents
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Account / Support */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Support & Contact
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Have questions regarding data processing or your subscription?
              Reach out to our support team.
            </p>
            <div className="space-y-1.5 text-xs">
              <a
                href="mailto:dockybusiness4@gmail.com"
                className="text-primary hover:underline font-medium block"
              >
                dockybusiness4@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} DOCKY SaaS Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
