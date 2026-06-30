import { useParams, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useDocument, useDocumentAnalysis } from "@/hooks/useDocuments";
import { useComplianceQueries, useCreateComplianceQuery } from "@/hooks/useCompliance";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  Share2,
  ArrowLeft,
  Calendar,
  Users,
  Building2,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  Shield,
  AlertCircle,
  Clock,
  MapPin,
  FileWarning,
  Scale,
  Gavel,
  Target,
  Lightbulb,
  MessageSquare,
  Send,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const severityColors = {
  high: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    border: "border-destructive/30",
    badge: "destructive" as const,
  },
  medium: {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/30",
    badge: "secondary" as const,
  },
  low: {
    bg: "bg-info/10",
    text: "text-info",
    border: "border-info/30",
    badge: "outline" as const,
  },
};

export function DocumentPage() {
  const { documentId } = useParams({ from: "/app/documents/$documentId" });
  const { data: document, isLoading: docLoading } = useDocument(documentId);
  const { data: analysis, isLoading: analysisLoading } =
    useDocumentAnalysis(documentId);
  const { user } = useAuth();
  
  const { data: queries, isLoading: queriesLoading } = useComplianceQueries(documentId);
  const createQueryMutation = useCreateComplianceQuery();
  const [newQuery, setNewQuery] = useState("");

  const isLoading = docLoading || analysisLoading || queriesLoading;

  const handleAskQuery = async () => {
    if (!newQuery.trim() || !user) return;
    
    await createQueryMutation.mutateAsync({
      queryText: newQuery,
      userId: user.id,
      documentId: documentId,
    });
    setNewQuery("");
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const complianceScore = document?.compliance_score ?? 78;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"
      >
        <div className="space-y-2">
          <Link
            to="/documents"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Documents
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand to-accent">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {document?.filename || "Contract_Acme_2024.pdf"}
              </h1>
              <p className="text-muted-foreground text-sm">
                Uploaded on{" "}
                {new Date(
                  document?.created_at || Date.now(),
                ).toLocaleDateString()}{" "}
                by Demo User
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share Report
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </motion.div>

      {/* Top Stats */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  complianceScore >= 80
                    ? "bg-success/10"
                    : complianceScore >= 60
                      ? "bg-warning/10"
                      : "bg-destructive/10"
                }`}
              >
                <Shield
                  className={`h-5 w-5 ${
                    complianceScore >= 80
                      ? "text-success"
                      : complianceScore >= 60
                        ? "text-warning"
                        : "text-destructive"
                  }`}
                />
              </div>
              <div>
                <p className="text-2xl font-bold">{complianceScore}%</p>
                <p className="text-xs text-muted-foreground">
                  Compliance Score
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {((analysis?.risks as Record<string, any>)?.risks as any[])
                    ?.length || 6}
                </p>
                <p className="text-xs text-muted-foreground">Risk Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <AlertCircle className="h-0 h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {(analysis?.missing_clauses as any)?.clauses?.length || 3}
                </p>
                <p className="text-xs text-muted-foreground">Missing Clauses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand/10">
                <Calendar className="h-5 w-5 text-brand" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {(analysis?.important_dates as any)?.dates?.length || 5}
                </p>
                <p className="text-xs text-muted-foreground">Important Dates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Executive Summary */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-brand/5 via-background to-accent/5 border-brand/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-brand" />
              <CardTitle>Executive Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {analysis?.executive_summary ||
                "This contract establishes a service agreement between the parties for the provision of cloud computing services. The agreement contains standard terms with some notable clauses regarding data privacy and liability limitations. Overall compliance is good with a few areas requiring attention."}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contract Analysis */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-brand" />
              <CardTitle>Contract Analysis</CardTitle>
            </div>
            <CardDescription>
              Detailed breakdown of contract terms and parties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="parties">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="parties">Parties</TabsTrigger>
                <TabsTrigger value="obligations">Obligations</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="penalties">Penalties</TabsTrigger>
                <TabsTrigger value="clauses">Clauses</TabsTrigger>
              </TabsList>
              <TabsContent value="parties" className="mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {(
                    (analysis?.parties as any)?.parties || [
                      {
                        name: "Acme Corporation",
                        role: "Service Provider",
                        address: "123 Business Ave, San Francisco, CA 94102",
                      },
                      {
                        name: "TechStart Inc.",
                        role: "Client",
                        address: "456 Innovation Blvd, Austin, TX 78701",
                      },
                    ]
                  ).map((party: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-border/50 bg-muted/30 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-brand/10">
                          <Building2 className="h-5 w-5 text-brand" />
                        </div>
                        <div>
                          <p className="font-medium">{party.name}</p>
                          <Badge variant="secondary">{party.role}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {party.address}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="obligations" className="mt-4">
                <div className="space-y-3">
                  {(
                    (analysis?.obligations as any)?.obligations || [
                      {
                        party: "Acme Corporation",
                        obligation: "Provide 99.9% uptime guarantee",
                      },
                      {
                        party: "Acme Corporation",
                        obligation: "Maintain data security compliance",
                      },
                      {
                        party: "TechStart Inc.",
                        obligation: "Pay invoices within 30 days",
                      },
                      {
                        party: "TechStart Inc.",
                        obligation: "Provide accurate usage data",
                      },
                    ]
                  ).map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border/50"
                    >
                      <div
                        className={`p-2 rounded-lg ${i < 2 ? "bg-brand/10" : "bg-accent/10"}`}
                      >
                        <Users
                          className={`h-4 w-4 ${i < 2 ? "text-brand" : "text-accent"}`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.party}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.obligation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="payment" className="mt-4">
                <div className="space-y-3">
                  {(
                    (analysis?.payment_terms as any)?.terms || [
                      {
                        description: "Monthly subscription fee",
                        amount: "$5,000",
                        frequency: "Monthly",
                      },
                      {
                        description: "Late payment penalty",
                        amount: "1.5% per month",
                        frequency: "On overdue",
                      },
                      {
                        description: "Early termination fee",
                        amount: "3 months of service",
                        frequency: "On termination",
                      },
                    ]
                  ).map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-success" />
                        <div>
                          <p className="text-sm font-medium">
                            {item.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.frequency}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">{item.amount}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="penalties" className="mt-4">
                <div className="space-y-3">
                  {(
                    (analysis?.penalties as any)?.penalties || [
                      {
                        type: "Service Level Failure",
                        penalty: "10% credit of monthly fee per 0.1% below SLA",
                      },
                      {
                        type: "Data Breach",
                        penalty: "Direct damages up to $500,000",
                      },
                      {
                        type: "Confidentiality Breach",
                        penalty: "Injunctive relief plus damages",
                      },
                    ]
                  ).map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5"
                    >
                      <div className="p-2 rounded-lg bg-destructive/10">
                        <Gavel className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.penalty}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="clauses" className="mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-brand/10">
                        <Scale className="h-5 w-5 text-brand" />
                      </div>
                      <p className="font-medium">Governing Law</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {analysis?.governing_law ||
                        "State of Delaware, United States"}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-warning/10">
                        <RefreshCw className="h-5 w-5 text-warning" />
                      </div>
                      <p className="font-medium">Renewal Terms</p>
                    </div>
                    {(
                      (analysis?.renewal_terms as any)?.terms || [
                        {
                          type: "Auto-renewal",
                          period: "12 months",
                          notice_period: "60 days prior",
                        },
                      ]
                    ).map((term: any, i: number) => (
                      <div key={i} className="text-sm text-muted-foreground">
                        <p>
                          {term.type}: {term.period}
                        </p>
                        <p className="text-xs">Notice: {term.notice_period}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Compliance Analysis */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand" />
              <CardTitle>Compliance Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="hsl(var(--muted))"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={
                      complianceScore >= 80
                        ? "#22c55e"
                        : complianceScore >= 60
                          ? "#f59e0b"
                          : "#ef4444"
                    }
                    strokeWidth="12"
                    strokeDasharray={`${complianceScore * 3.51} 351`}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{complianceScore}%</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <p className="font-medium">
                  {complianceScore >= 80
                    ? "Good Standing"
                    : complianceScore >= 60
                      ? "Needs Attention"
                      : "Critical Issues"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {complianceScore >= 80
                    ? "Most compliance requirements are met. Minor improvements recommended."
                    : complianceScore >= 60
                      ? "Several compliance gaps identified. Review recommendations below."
                      : "Significant compliance issues found. Immediate action required."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Regulatory Compliance</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {(
                  (analysis?.compliance_requirements as any)?.requirements || [
                    {
                      regulation: "GDPR",
                      status: "Partially Compliant",
                      details: "Data processing clauses present",
                    },
                    {
                      regulation: "SOC 2",
                      status: "Compliant",
                      details: "SOC 2 Type II required annually",
                    },
                    {
                      regulation: "HIPAA",
                      status: "Not Applicable",
                      details: "No PHI data involved",
                    },
                    {
                      regulation: "CCPA",
                      status: "Partially Compliant",
                      details: "California notification required",
                    },
                  ]
                ).map((req: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border/50"
                  >
                    <div
                      className={`w-3 h-3 rounded-full mt-1 ${
                        req.status === "Compliant"
                          ? "bg-success"
                          : req.status === "Not Applicable"
                            ? "bg-slate-400"
                            : "bg-warning"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{req.regulation}</p>
                        <Badge
                          variant={
                            req.status === "Compliant" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {req.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {req.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Risk Analysis */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <CardTitle>Risk Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {["high", "medium", "low"].map((severity) => (
                <div
                  key={severity}
                  className={`rounded-lg ${severityColors[severity as keyof typeof severityColors].bg} border ${severityColors[severity as keyof typeof severityColors].border} p-4`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Badge
                      variant={
                        severityColors[severity as keyof typeof severityColors]
                          .badge
                      }
                      className="capitalize"
                    >
                      {severity} Risk
                    </Badge>
                    <span
                      className={`text-sm ${severityColors[severity as keyof typeof severityColors].text}`}
                    >
                      {((analysis?.risks as any)?.risks || []).filter(
                        (r: any) => r.severity === severity,
                      ).length ||
                        (severity === "high"
                          ? 2
                          : severity === "medium"
                            ? 3
                            : 1)}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {(
                      (analysis?.risks as any)?.risks || [
                        {
                          category: "Legal",
                          description: "Indemnification clause absent",
                          severity: "high",
                        },
                        {
                          category: "Financial",
                          description: "Unlimited data breach liability",
                          severity: "high",
                        },
                        {
                          category: "Operational",
                          description: "Auto-renewal limited notice",
                          severity: "medium",
                        },
                        {
                          category: "Compliance",
                          description: "GDPR DPA not attached",
                          severity: "medium",
                        },
                        {
                          category: "Legal",
                          description: "Force majeure missing",
                          severity: "medium",
                        },
                        {
                          category: "Operational",
                          description: "Short audit notice period",
                          severity: "low",
                        },
                      ]
                    )
                      .filter((r: any) => r.severity === severity)
                      .slice(0, 3)
                      .map((risk: any, i: number) => (
                        <div key={i} className="text-xs">
                          <p className="font-medium">{risk.category}</p>
                          <p className="text-muted-foreground">
                            {risk.description}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Missing Clauses */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <CardTitle>Missing Clauses</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(
                (analysis?.missing_clauses as any)?.clauses || [
                  {
                    name: "Force Majeure",
                    severity: "medium",
                    recommendation:
                      "Add clause for unforeseeable circumstances",
                  },
                  {
                    name: "Indemnification",
                    severity: "high",
                    recommendation: "Include mutual indemnification",
                  },
                  {
                    name: "Intellectual Property Rights",
                    severity: "low",
                    recommendation: "Clarify IP ownership",
                  },
                ]
              ).map((clause: any, i: number) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${severityColors[clause.severity as keyof typeof severityColors].border}`}
                >
                  <div
                    className={`p-2 rounded-lg ${severityColors[clause.severity as keyof typeof severityColors].bg}`}
                  >
                    <AlertCircle
                      className={`h-4 w-4 ${severityColors[clause.severity as keyof typeof severityColors].text}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{clause.name}</p>
                      <Badge
                        variant={
                          severityColors[
                            clause.severity as keyof typeof severityColors
                          ].badge
                        }
                      >
                        {clause.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {clause.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-brand" />
              <CardTitle>AI Recommendations</CardTitle>
            </div>
            <CardDescription>
              Prioritized action items based on risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="space-y-2">
              {(
                (analysis?.recommendations as any)?.recommendations || [
                  {
                    priority: "critical",
                    title: "Add Mutual Indemnification Clause",
                    description:
                      "Include comprehensive indemnification language protecting both parties from third-party claims.",
                  },
                  {
                    priority: "critical",
                    title: "Cap Data Breach Liability",
                    description:
                      "Negotiate a reasonable cap on data breach liability aligned with your risk appetite.",
                  },
                  {
                    priority: "high",
                    title: "Attach Data Processing Agreement",
                    description:
                      "Add a GDPR-compliant DPA as an exhibit to ensure compliance with EU data protection requirements.",
                  },
                  {
                    priority: "high",
                    title: "Extend Audit Notice Period",
                    description:
                      "Request a minimum of 7 business days notice for any audit activities.",
                  },
                  {
                    priority: "medium",
                    title: "Add Force Majeure Clause",
                    description:
                      "Include standard force majeure provisions for events beyond reasonable control.",
                  },
                  {
                    priority: "medium",
                    title: "Clarify Non-Compete Duration",
                    description:
                      "Reduce non-compete period to 1 year to align with standard market practice.",
                  },
                  {
                    priority: "low",
                    title: "Add Intellectual Property Clause",
                    description:
                      "Explicitly define ownership of any IP created during the engagement.",
                  },
                ]
              ).map((rec: any, i: number) => (
                <AccordionItem
                  key={i}
                  value={`rec-${i}`}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          rec.priority === "critical"
                            ? "bg-destructive"
                            : rec.priority === "high"
                              ? "bg-warning"
                              : rec.priority === "medium"
                                ? "bg-info"
                                : "bg-slate-400"
                        }`}
                      />
                      <span className="font-medium text-left">{rec.title}</span>
                      <Badge
                        variant="outline"
                        className="capitalize hidden sm:inline-flex"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground pl-5">
                      {rec.description}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>

      {/* Important Dates */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand" />
              <CardTitle>Important Dates</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6">
                {(
                  (analysis?.important_dates as any)?.dates || [
                    {
                      type: "Effective Date",
                      date: "2024-01-15",
                      description: "Contract becomes effective",
                    },
                    {
                      type: "Expiration Date",
                      date: "2025-01-14",
                      description: "Initial term expires",
                    },
                    {
                      type: "Renewal Notice Deadline",
                      date: "2024-11-15",
                      description: "Last day to provide non-renewal notice",
                    },
                    {
                      type: "Annual Review",
                      date: "2024-07-15",
                      description: "Scheduled contract review meeting",
                    },
                    {
                      type: "SOC 2 Report Due",
                      date: "2024-03-01",
                      description: "Annual certification required",
                    },
                  ]
                ).map((item: any, i: number) => (
                  <div key={i} className="relative pl-10">
                    <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-background border-2 border-brand" />
                    <div className="p-4 rounded-lg border border-border/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-brand" />
                        <span className="font-medium">{item.type}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <p className="text-sm font-semibold mt-2">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Compliance Queries Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-brand" />
              <CardTitle>Ask Compliance AI</CardTitle>
            </div>
            <CardDescription>
              Ask specific compliance questions about this document.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask a question..."
                value={newQuery}
                onChange={(e) => setNewQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAskQuery();
                  }
                }}
              />
              <Button onClick={handleAskQuery} disabled={createQueryMutation.isPending || !newQuery.trim()}>
                {createQueryMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Ask
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4 mt-6">
              {queries?.map((query) => (
                <div key={query.id} className="p-4 rounded-lg border bg-muted/20">
                  <p className="font-medium">Q: {query.queryText}</p>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {query.status === "completed" && query.response ? (
                      <p>A: {JSON.stringify(query.response.response)}</p>
                    ) : (
                      <p className="italic">Status: {query.status}...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer Actions */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between py-4 border-t"
      >
        <Button variant="outline" asChild>
          <Link to="/documents">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documents
          </Link>
        </Button>
        <Button
          variant="destructive"
          className="opacity-50 cursor-not-allowed"
          disabled
        >
          Delete Document
        </Button>
      </motion.div>
    </motion.div>
  );
}
