import React from "react";
import { LegalLayout, TOCItem } from "./legal-layout";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Shield,
  Lock,
  Cpu,
  Database,
  EyeOff,
  UserCheck,
  Cookie,
  AlertTriangle,
  Mail,
  CheckCircle2,
  FileCheck,
} from "lucide-react";

const tocItems: TOCItem[] = [
  { id: "overview", title: "1. Overview & Scope" },
  { id: "data-collected", title: "2. Information We Collect" },
  { id: "how-we-use-data", title: "3. How We Use Your Data" },
  { id: "ai-processing", title: "4. AI Processing & Third-Party Models" },
  { id: "data-ownership", title: "5. Data Ownership & Non-Sale Guarantee" },
  { id: "third-party-services", title: "6. Third-Party Service Providers" },
  { id: "security-retention", title: "7. Security & Data Retention" },
  { id: "user-rights", title: "8. Your Privacy Rights (GDPR / CCPA)" },
  { id: "cookies", title: "9. Cookies & Tracking" },
  { id: "policy-updates-contact", title: "10. Updates & Contact Info" },
];

export function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How DOCKY collects, processes, protects, and handles your documents, account data, and AI interactions."
      lastUpdated="July 28, 2026"
      tocItems={tocItems}
    >
      {/* Disclaimer Box */}
      <Alert className="bg-primary/5 border-primary/20 text-foreground">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
        <div>
          <AlertTitle className="font-bold text-sm">
            Key Summary & AI Disclaimer
          </AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
            DOCKY processes uploaded PDF contracts using enterprise AI models
            (via OpenRouter) strictly to deliver contract risk analysis and
            compliance insights.{" "}
            <strong>
              We do not claim ownership of your documents and we never sell your
              personal data. Uploaded documents are processed through OpenRouter
              and third-party AI providers to generate analyses. Data handling
              practices may vary depending on the AI provider used. AI-generated
              outputs are provided for informational purposes only and do not
              constitute legal advice.
            </strong>{" "}
            AI-generated outputs are for informational purposes only and do not
            constitute legal advice.
          </AlertDescription>
        </div>
      </Alert>

      {/* Section 1: Overview */}
      <section id="overview" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            1
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Overview & Scope
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            Welcome to <strong>DOCKY</strong> ("we," "our," or "us"). This
            Privacy Policy explains how we collect, use, disclose, and protect
            personal information and user content when you access or use our
            AI-powered contract and document compliance SaaS platform at{" "}
            <code>docky.ai</code> and related services (collectively, the
            "Platform").
          </p>
          <p>
            By using the Platform, you acknowledge that you have read this
            Privacy Policy.
          </p>
        </div>
      </section>

      {/* Section 2: Data Collected */}
      <section id="data-collected" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            2
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Information We Collect
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <p>
            We collect several types of information to provide and improve our
            services:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-background space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                <UserCheck className="w-4 h-4 text-primary" /> Account
                Information
              </div>
              <p className="text-xs">
                Full name, business email address, encrypted password hash,
                profile preferences, and account metadata.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-background space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                <FileCheck className="w-4 h-4 text-primary" /> Uploaded
                Documents
              </div>
              <p className="text-xs">
                PDF contracts, legal documents, extracted text chunks, document
                titles, file size, page counts, and clause structures submitted
                for analysis.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-background space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                <Cpu className="w-4 h-4 text-primary" /> Analysis & AI Chat Data
              </div>
              <p className="text-xs">
                Extracted risk tags, compliance scores, structured clause
                breakdowns, user prompts, assistant answers, and saved
                annotations.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-background space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                <Database className="w-4 h-4 text-primary" /> Billing & Payment
                Details
              </div>
              <p className="text-xs">
                Subscription tier, payment status, transaction identifiers, and
                invoicing details. Payment card credentials are handled directly
                by Paddle (Merchant of Record).
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            <strong>Technical & Usage Data:</strong> We automatically collect IP
            addresses, browser types, operating systems, referring URLs, access
            timestamps, error logs, and feature usage statistics to ensure
            stability and performance.
          </p>
        </div>
      </section>

      {/* Section 3: How We Use Data */}
      <section id="how-we-use-data" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            3
          </div>
          <h2 className="text-xl font-bold text-foreground">
            How We Use Your Data
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            We process your data strictly for legitimate operational and service
            delivery purposes:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong>AI Analysis Execution:</strong> Parsing PDF documents,
              extracting legal clauses, calculating risk flags, and generating
              compliance summaries.
            </li>
            <li>
              <strong>Service Management:</strong> Authenticating user accounts,
              maintaining session state, processing subscriptions, and handling
              billing inquiries.
            </li>
            <li>
              <strong>Customer Support:</strong> Responding to help tickets,
              troubleshooting document parsing issues, and investigating system
              bugs.
            </li>
            <li>
              <strong>Security & Abuse Prevention:</strong> Monitoring against
              unauthorized uploads, malicious activity, API rate-limiting
              breaches, and service misuse.
            </li>
            <li>
              <strong>Platform Optimization:</strong> Improving application
              speed, user experience, error monitoring, and platform
              infrastructure.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 4: AI Processing & Third-Party Models */}
      <section id="ai-processing" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            4
          </div>
          <h2 className="text-xl font-bold text-foreground">
            AI Processing & Third-Party Models
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-foreground text-sm">
              <Cpu className="w-4 h-4 text-primary" /> How AI Document
              Processing Works
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              DOCKY utilizes <strong>OpenRouter</strong> as a secure AI gateway
              to pass document context to enterprise Large Language Models (such
              as OpenAI GPT models, Anthropic Claude, Google Gemini, Meta Llama,
              or DeepSeek models) to perform high-speed risk identification and
              clause parsing.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Strict Data
              Safeguards for AI Processing
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                <strong>Zero Model Training:</strong> Uploaded documents,
                extracted text chunks, and analysis outputs sent to underlying
                AI model providers via API are{" "}
                <strong>
                  never used to train, retrain, or improve public AI models
                </strong>
                .
              </li>
              <li>
                <strong>Ephemeral Processing:</strong> AI providers process text
                prompts transiently during the request lifecycle and do not
                retain long-term copies of your confidential legal documents.
              </li>
              <li>
                <strong>Encryption in Transit:</strong> All data transmitted to
                OpenRouter and model provider APIs is encrypted via TLS 1.3.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 5: Data Ownership & Non-Sale Guarantee */}
      <section id="data-ownership" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            5
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Data Ownership & Non-Sale Guarantee
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-background space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                <Shield className="w-4 h-4 text-primary" /> You Own Your Content
              </div>
              <p className="text-xs">
                DOCKY does <strong>not claim any ownership rights</strong> over
                the PDF documents, contracts, text extracts, or reports you
                upload or generate on the Platform. All rights remain
                exclusively yours.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-background space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                <EyeOff className="w-4 h-4 text-primary" /> We Never Sell Data
              </div>
              <p className="text-xs">
                DOCKY <strong>never sells, rents, leases, or trades</strong>{" "}
                your personal information, organization data, or uploaded
                documents to third-party advertisers, data brokers, or marketing
                partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Third-Party Service Providers */}
      <section id="third-party-services" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            6
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Third-Party Service Providers
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            To operate our commercial SaaS application, we engage trusted
            third-party service providers who process data strictly under
            contractually enforced confidentiality terms:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg border border-border bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <strong className="text-foreground">
                  Paddle (Merchant of Record):
                </strong>{" "}
                Payment gateway, billing engine, sales tax compliance, and
                subscription management.
              </div>
              <Badge variant="outline" className="w-fit text-[10px]">
                Payments
              </Badge>
            </div>

            <div className="p-3 rounded-lg border border-border bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <strong className="text-foreground">
                  OpenRouter & AI Model Infrastructure:
                </strong>{" "}
                Secure enterprise API provider for underlying LLMs (OpenAI,
                Anthropic, Gemini, DeepSeek).
              </div>
              <Badge variant="outline" className="w-fit text-[10px]">
                AI Processing
              </Badge>
            </div>

            <div className="p-3 rounded-lg border border-border bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <strong className="text-foreground">
                  Database & Storage (Neon / Vercel):
                </strong>{" "}
                Encrypted database hosting, file storage, and serverless
                infrastructure.
              </div>
              <Badge variant="outline" className="w-fit text-[10px]">
                Infrastructure
              </Badge>
            </div>

            <div className="p-3 rounded-lg border border-border bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <strong className="text-foreground">Email Services:</strong>{" "}
                Transactional notification emails, password reset links, and
                account updates.
              </div>
              <Badge variant="outline" className="w-fit text-[10px]">
                Communications
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Security & Data Retention */}
      <section id="security-retention" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            7
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Security Practices & Retention
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" /> Robust Security
              Standards
            </h3>
            <p className="text-xs leading-relaxed">
              We employ enterprise-grade security standards to safeguard your
              contracts:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>
                <strong>Encryption at Rest:</strong> Storage buckets and
                database records are encrypted using AES-256 standards.
              </li>
              <li>
                <strong>Encryption in Transit:</strong> All data exchanged
                between your browser, our servers, and third-party APIs is
                encrypted using TLS 1.3 protocols.
              </li>
              <li>
                <strong>Access Control & Isolation:</strong> Row-Level Security
                (RLS) ensures multi-tenant database isolation, preventing
                unauthorized cross-account document access.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-sm">
              Data Retention & Permanent Deletion
            </h3>
            <p className="text-xs leading-relaxed">
              We retain your documents and analysis records as long as your
              account remains active. When you delete a document or terminate
              your account, all corresponding files, parsed text, and chat
              histories are permanently purged from active databases within 30
              days.
            </p>
          </div>
        </div>
      </section>

      {/* Section 8: Your Rights */}
      <section id="user-rights" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            8
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Your Privacy Rights (GDPR & CCPA)
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            Depending on your jurisdiction, you hold specific statutory rights
            regarding your personal data:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong>Right to Access & Export:</strong> Request a copy of all
              personal information and document records held by DOCKY in a
              structured format.
            </li>
            <li>
              <strong>Right to Rectification:</strong> Request correction of
              inaccurate account details.
            </li>
            <li>
              <strong>Right to Erasure ("Right to be Forgotten"):</strong>{" "}
              Request complete deletion of your account and associated document
              data.
            </li>
            <li>
              <strong>Right to Restrict Processing:</strong> Request suspension
              of specific non-essential data processing activities.
            </li>
            <li>
              <strong>Non-Discrimination:</strong> We will never discriminate
              against you for exercising any of your statutory privacy rights.
            </li>
          </ul>
          <p className="text-xs">
            To submit a privacy rights request, email our Data Protection
            Officer at <code>privacy@docky.ai</code>.
          </p>
        </div>
      </section>

      {/* Section 9: Cookies */}
      <section id="cookies" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            9
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Cookies & Local Storage
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            We use essential cookies and local browser storage to keep you
            logged in securely, preserve sidebar state, remember your theme
            preference (dark/light), and analyze core session performance.
          </p>
          <p className="text-xs">
            You can adjust browser settings to block non-essential cookies.
            However, disabling essential session tokens will prevent you from
            logging into your DOCKY account.
          </p>
        </div>
      </section>

      {/* Section 10: Updates & Contact */}
      <section id="policy-updates-contact" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            10
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Policy Updates & Contact Information
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <p>
            We may update this Privacy Policy periodically to reflect changes in
            AI regulations, technology, or legal requirements. Material updates
            will be communicated via email or a prominent banner on the Platform
            at least 14 days prior to taking effect.
          </p>

          <div className="p-4 rounded-xl border border-border bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> Questions or Privacy
                Inquiries?
              </h4>
              <p className="text-xs text-muted-foreground">
                Our security and legal compliance team is available to assist
                you.
              </p>
            </div>
            <a
              href="mailto:privacy@docky.ai"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
            >
              Contact Privacy Team
            </a>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}
