import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileSearch,
  Mail,
  Loader2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We've sent a password reset link to:
            <br />
            <strong className="text-foreground">{email}</strong>
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder or
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setSubmitted(false)}
          >
            Try another email
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-accent flex items-center justify-center">
          <FileSearch className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold">DOCKY</span>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Forgot password?</h1>
        <p className="text-muted-foreground">
          No worries, we'll send you reset instructions.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9 h-11 bg-muted/50 border-border/50"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-brand to-accent hover:from-brand-dark hover:to-accent"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Reset Password
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Footer */}
      <Link
        to="/login"
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>
    </div>
  );
}
