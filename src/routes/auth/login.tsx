import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileSearch, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError((err as Error)?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, navigate]);

  return (
    <div className="space-y-8">
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <FileSearch className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-semibold text-white">DocIntel</span>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Welcome back
        </h1>
        <p className="text-sm text-white/60">
          Sign in to your account to continue
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!!error && (
          <div className="text-sm text-red-400 text-center bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/80">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9 h-11 bg-white/5 border border-white/10 text-white placeholder:text-white/40"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-white/80">
              Password
            </Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 h-11 bg-white/5 border border-white/10 text-white placeholder:text-white/40"
              required
            />
          </div>
        </div>

        {/* Remember */}
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm text-white/70">
            Remember me
          </Label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-11 bg-white text-black hover:bg-white/90"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-white/50">
        Don't have an account?{" "}
        <Link to="/register" className="text-white hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
