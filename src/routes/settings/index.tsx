import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import {
  Crown,
  Check,
  Building2,
  Users,
  Zap,
  Shield,
  Mail,
  Lock,
  Key,
  Settings as SettingsIcon,
  FileText,
  ExternalLink,
  Sparkles,
} from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Perfect for trying out the platform",
    features: [
      "3 documents per month",
      "Basic AI analysis",
      "View compliance score",
      "Email support",
    ],
    current: true,
  },
  {
    id: "professional",
    name: "Professional",
    price: 29,
    yearlyPrice: 24,
    description: "For professionals who need comprehensive analysis",
    features: [
      "Unlimited documents",
      "Advanced AI analysis",
      "Compliance scoring",
      "Export to PDF",
      "Email reminders",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    description: "For large teams with advanced requirements",
    features: [
      "Everything in Professional",
      "Team management",
      "API access",
      "SSO/SAML",
      "Audit logs",
      "Dedicated account manager",
      "Custom integrations",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [analysisAlerts, setAnalysisAlerts] = useState(true);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-5xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and subscription
        </p>
      </motion.div>

      <Tabs defaultValue="subscription" className="space-y-6">
        <motion.div variants={itemVariants}>
          <TabsList className="grid w-full grid-cols-3 h-11 bg-muted/50">
            <TabsTrigger
              value="subscription"
              className="flex items-center gap-2"
            >
              <Crown className="h-4 w-4" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          {/* Current Plan */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-brand/5 via-background to-accent/5 border-brand/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand/10">
                      <Crown className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <CardTitle>Current Plan</CardTitle>
                      <CardDescription>
                        You are currently on the Free plan
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">Free</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Document usage this month:{" "}
                      <strong className="text-foreground">1 of 3</strong>
                    </p>
                    <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "33%" }}
                        className="h-full bg-gradient-to-r from-brand to-accent"
                      />
                    </div>
                  </div>
                  <Button variant="link" className="text-primary">
                    View usage details
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4"
          >
            <span
              className={`text-sm ${billingPeriod === "monthly" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </span>
            <Switch
              checked={billingPeriod === "yearly"}
              onCheckedChange={(checked) =>
                setBillingPeriod(checked ? "yearly" : "monthly")
              }
            />
            <span
              className={`text-sm ${billingPeriod === "yearly" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Yearly
              <Badge variant="secondary" className="ml-2 text-xs">
                Save 17%
              </Badge>
            </span>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-6"
          >
            {plans.map((plan) => (
              <motion.div key={plan.id} variants={itemVariants}>
                <Card
                  className={`relative h-full flex flex-col ${
                    plan.popular
                      ? "border-2 border-primary shadow-lg scale-105"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-brand to-accent">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pb-4">
                    {plan.price !== null ? (
                      <div className="mb-4">
                        <span className="text-4xl font-bold">
                          $
                          {billingPeriod === "monthly"
                            ? plan.price
                            : plan.yearlyPrice}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                        {billingPeriod === "yearly" && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Billed annually (${plan.yearlyPrice! * 12}/year)
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="mb-4">
                        <span className="text-2xl font-bold">Custom</span>
                        <p className="text-xs text-muted-foreground mt-1">
                          Contact for pricing
                        </p>
                      </div>
                    )}
                    <div className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-left"
                        >
                          <Check className="h-4 w-4 text-success flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto pt-4">
                    {plan.current ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : plan.price === null ? (
                      <Button variant="outline" className="w-full">
                        Contact Sales
                        <Mail className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        className={`w-full ${plan.popular ? "bg-gradient-to-r from-brand to-accent hover:from-brand-dark hover:to-accent" : ""}`}
                      >
                        {plan.popular && <Sparkles className="mr-2 h-4 w-4" />}
                        Upgrade to {plan.name}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Enterprise Features */}
          <motion.div variants={itemVariants}>
            <Card className="bg-muted/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted/20">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle>Enterprise Features</CardTitle>
                    <CardDescription>
                      Advanced capabilities for larger organizations
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    {
                      icon: Users,
                      title: "Team Management",
                      description:
                        "Collaborate across your entire organization",
                    },
                    {
                      icon: Key,
                      title: "API Access",
                      description: "Integrate with your existing systems",
                    },
                    {
                      icon: Shield,
                      title: "SSO/SAML",
                      description: "Single sign-on for enterprise security",
                    },
                    {
                      icon: FileText,
                      title: "Audit Logs",
                      description: "Full compliance audit trail",
                    },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted/20">
                        <feature.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{feature.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      defaultValue={user?.full_name || "Demo User"}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user?.email || "demo@docintel.com"}
                      disabled
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      defaultValue={
                        user?.role
                          ?.replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase()) || "Admin"
                      }
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      defaultValue={
                        user?.organization_name || "Acme Corporation"
                      }
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input
                    id="current"
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new">New Password</Label>
                    <Input
                      id="new"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <Input
                      id="confirm"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of the app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Select your preferred theme
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                    >
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                    >
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("system")}
                    >
                      System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how you receive updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analysis Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when analysis is complete
                    </p>
                  </div>
                  <Switch
                    checked={analysisAlerts}
                    onCheckedChange={setAnalysisAlerts}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Expiry Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Reminders before contract expiration
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Risk Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alerts for high-risk documents
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>
                  Configure your language and date preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input id="language" defaultValue="English (US)" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      defaultValue="America/New_York"
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
