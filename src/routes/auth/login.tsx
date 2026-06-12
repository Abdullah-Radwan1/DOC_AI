import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { FileSearch, Mail, Lock, Loader2, ArrowRight, User, Shield, Eye, BarChart3 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, mockSignIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate({ to: '/' });
    } catch (err) {
      setError('Invalid email or password. Try Quick Login instead.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = async () => {
    setLoading(true);
    await mockSignIn(selectedRole);
    localStorage.setItem('docintel-mock-user', selectedRole);
    navigate({ to: '/' });
  };

  return (
    <div className="space-y-8">
      {/* Mobile Logo - Only visible on mobile */}
      <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <FileSearch className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold">DocIntel</span>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to your account to continue</p>
      </div>

      {/* Demo Account Warning */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Demo Account</p>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
              For demo purposes, use the Quick Login below. No real credentials required.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Login */}
      <div className="space-y-4">
        <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
          <SelectTrigger className="w-full h-11">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </div>
            </SelectItem>
            <SelectItem value="compliance_manager">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Compliance Manager</span>
              </div>
            </SelectItem>
            <SelectItem value="auditor">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Auditor</span>
              </div>
            </SelectItem>
            <SelectItem value="viewer">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Viewer</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleMockLogin}
          className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Quick Login as {selectedRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or continue with email</span>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!!error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 text-center"
          >
            {error}
          </motion.div>
        )}

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
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 h-11 bg-muted/50 border-border/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
        </div>

        <Button
          type="submit"
          className="w-full h-11"
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
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
