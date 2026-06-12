import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { FileSearch, Mail, Lock, Loader2, ArrowRight, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export function RegisterPage() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError('You must consent to the document processing terms to continue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await signUp(email, password, fullName);
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError('Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Account created!</h1>
          <p className="text-muted-foreground">
            We've sent a confirmation email to <strong>{email}</strong>
          </p>
        </div>
        <Button variant="outline" size="lg" className="w-full" asChild>
          <Link to="/login">Back to Sign In</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <FileSearch className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold">DocIntel</span>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground">Start your AI document intelligence journey</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!!error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 p-3 rounded-lg"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-9 h-11 bg-muted/50 border-border/50"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Work Email</Label>
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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 h-11 bg-muted/50 border-border/50"
              required
              minLength={8}
            />
          </div>
          <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
        </div>

        <Separator className="my-6" />

        {/* Consent Checkbox - Mandatory */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-muted/30">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <Label htmlFor="consent" className="text-sm font-medium leading-relaxed cursor-pointer">
                I consent to the secure storage and processing of uploaded documents by AI to generate analysis.
              </Label>
              <p className="text-xs text-muted-foreground">
                Your documents are encrypted and processed securely. By checking this box, you agree to our
                Terms of Service and Privacy Policy regarding AI document processing.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          disabled={loading || !consent}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
