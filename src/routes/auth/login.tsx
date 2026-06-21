import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth, UserRole } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  FileSearch,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  User,
  Shield,
  Eye,
  BarChart3,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, mockSignIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate({ to: "/" });
    } catch (err) {
      setError("Invalid email or password. Try Quick Login instead.");
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = async () => {
    setLoading(true);
    await mockSignIn(selectedRole);
    localStorage.setItem("docintel-mock-user", selectedRole);
    navigate({ to: "/" });
  };

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

      {/* Demo Account Warning (neutral, Linear style) */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-white/70 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white">Demo Account</p>
            <p className="text-xs text-white/60 mt-1">
              Use Quick Login below. No real credentials required.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Login */}
      <div className="space-y-4">
        <Select
          value={selectedRole}
          onValueChange={(value) => setSelectedRole(value as UserRole)}
        >
          <SelectTrigger className="w-full h-11 bg-white/5 border border-white/10 text-white">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>

          <SelectContent className="bg-[#0A0A0A] border border-white/10 text-white">
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="compliance_manager">
              Compliance Manager
            </SelectItem>
            <SelectItem value="auditor">Auditor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleMockLogin}
          className="w-full h-11 bg-white text-black hover:bg-white/90"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Quick Login as{" "}
              {selectedRole
                .replace("_", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="bg-white/10" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-2 text-white/50">
            or continue with email
          </span>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!!error && (
          <div className="text-sm text-white/70 text-center">{error}</div>
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
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-white/80">
              Password
            </Label>

            <Link
              to="/forgot-password"
              className="text-sm text-white/60 hover:text-white"
            >
              Forgot password?
            </Link>
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
