import React from "react";
import { LegalLayout, TOCItem } from "./legal-layout";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  FileText,
  AlertOctagon,
  ShieldCheck,
  CreditCard,
  Ban,
  Scale,
  Zap,
  HelpCircle,
  FileCheck,
  AlertTriangle,
} from "lucide-react";

const tocItems: TOCItem[] = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "acceptable-use", title: "2. Acceptable Use & Prohibitions" },
  { id: "ownership-responsibility", title: "3. Ownership & User Content" },
  { id: "subscriptions-billing", title: "4. Subscriptions, Billing & Refunds" },
  { id: "ai-disclaimer", title: "5. AI Analysis & Legal Disclaimer" },
  { id: "limitation-liability", title: "6. Limitation of Liability" },
  {
    id: "suspension-termination",
    title: "7. Account Suspension & Termination",
  },
  { id: "intellectual-property", title: "8. Intellectual Property Rights" },
  { id: "governing-law", title: "9. Governing Law & Dispute Resolution" },
  { id: "modifications-contact", title: "10. Modifications & Contact Info" },
];

export function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="Terms and conditions governing your access to and use of the DOCKY document intelligence SaaS platform."
      lastUpdated="July 28, 2026"
      tocItems={tocItems}
    >
      {/* Important Legal Disclaimer Banner */}
      <Alert className="bg-amber-500/10 border-amber-500/30 text-foreground">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
        <div>
          <AlertTitle className="font-bold text-sm">
            Critical Legal Notice
          </AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
            DOCKY provides automated AI-assisted contract risk and compliance
            analysis.{" "}
            <strong>
              DOCKY IS NOT A LAW FIRM AND DOES NOT PROVIDE LEGAL ADVICE.
            </strong>{" "}
            All outputs, clause classifications, and risk indicators are for
            informational purposes only. Always consult a qualified attorney for
            legal counsel regarding your contracts.
          </AlertDescription>
        </div>
      </Alert>

      {/* Section 1: Acceptance */}
      <section id="acceptance" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            1
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Acceptance of Terms
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            These Terms of Service ("Terms") constitute a legally binding
            agreement between you ("User," "you," or "your") and{" "}
            <strong>DOCKY</strong> ("we," "us," or "our") governing your
            subscription to and use of our web application, API endpoints, and
            document analysis services at <code>docky.ai</code> (the
            "Platform").
          </p>
          <p>
            By creating an account, selecting a subscription plan, checking a
            consent box during registration, or uploading documents to the
            Platform, you affirm that you are at least 18 years of age, possess
            the legal capacity to enter into binding agreements, and accept all
            terms set forth herein.
          </p>
        </div>
      </section>

      {/* Section 2: Acceptable Use */}
      <section id="acceptable-use" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            2
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Acceptable Use & Prohibitions
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <p>
            You agree to use DOCKY strictly for lawful business and personal
            document analysis. You expressly represent and warrant that you will
            not:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-background space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                <Ban className="w-4 h-4 text-destructive" /> Unauthorized
                Document Uploads
              </div>
              <p className="text-xs">
                Upload contracts or documents that contain illegal material,
                trade secrets, or data you do not possess the lawful right,
                authorization, or license to process.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-background space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                <AlertOctagon className="w-4 h-4 text-destructive" /> Platform
                Abuse & Exploitation
              </div>
              <p className="text-xs">
                Attempt to reverse-engineer, decompile, extract source code,
                probe infrastructure security vulnerabilities, or bypass rate
                limits on DOCKY API endpoints.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-background space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                <Zap className="w-4 h-4 text-destructive" /> Scraping &
                Automation
              </div>
              <p className="text-xs">
                Use automated scrapers, bots, or unauthorized scripts to extract
                data, harvest content, or overload service infrastructure.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-background space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                <ShieldCheck className="w-4 h-4 text-destructive" /> Account
                Sharing
              </div>
              <p className="text-xs">
                Share account credentials with unauthorized third parties or
                resell access to the Platform without prior written consent from
                DOCKY.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Ownership */}
      <section id="ownership-responsibility" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            3
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Document Ownership & User Content
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <div className="p-4 rounded-xl border border-border bg-background space-y-2">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-primary" /> Retention of User
              Ownership
            </h3>
            <p className="text-xs leading-relaxed">
              You retain complete and unencumbered ownership of all PDF
              documents, contracts, agreements, text extractions, and analysis
              reports uploaded to or generated by DOCKY. Uploading content to
              DOCKY does not grant us any ownership rights or copyright
              transfers.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-sm">
              User Responsibility for Content
            </h3>
            <p className="text-xs leading-relaxed">
              You remain solely responsible for the lawfulness, accuracy,
              quality, and confidentiality of all documents uploaded under your
              account. DOCKY acts merely as a passive technical pipeline for
              processing user-submitted files.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Subscriptions */}
      <section id="subscriptions-billing" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            4
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Subscriptions, Billing & Refunds
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> Merchant of Record
              & Payments
            </h3>
            <p className="text-xs leading-relaxed">
              All subscription plans, recurring payments, taxes, and invoices on
              DOCKY are processed by our payment partner <strong>Paddle</strong>
              , who acts as the official Merchant of Record. By subscribing to a
              paid plan, you authorize Paddle to charge your chosen payment
              method on a recurring billing cycle (monthly or annually).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg border border-border bg-background space-y-1">
              <strong className="text-foreground">Cancellations:</strong> You
              may cancel your paid subscription at any time via your account
              Settings dashboard. Cancellation stops future recurring charges.
            </div>

            <div className="p-3 rounded-lg border border-border bg-background space-y-1">
              <strong className="text-foreground">14-Day Refund Window:</strong>{" "}
              Initial paid subscriptions are eligible for a full refund within
              14 days of purchase upon written request to billing support.
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: AI Disclaimer */}
      <section id="ai-disclaimer" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            5
          </div>
          <h2 className="text-xl font-bold text-foreground">
            AI Analysis & Legal Disclaimer
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 space-y-3">
            <h3 className="font-bold text-destructive text-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-destructive" /> Informational Tool
              Only — No Legal Advice
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              DOCKY utilizes artificial intelligence language models to parse
              text, highlight clauses, and flag potential risk areas.{" "}
              <strong>
                AI outputs may contain inaccuracies, omissions, or
                misinterpretations of legal terms.
              </strong>
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
              <li>
                No attorney-client relationship is created by using DOCKY.
              </li>
              <li>
                DOCKY does not evaluate jurisdiction-specific case law or
                statutory nuances.
              </li>
              <li>
                You should never execute, sign, or modify legal contracts based
                solely on DOCKY AI outputs without independent legal
                verification.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 6: Limitation of Liability */}
      <section id="limitation-liability" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            6
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Limitation of Liability
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, DOCKY, ITS
            OFFICERS, DIRECTORS, EMPLOYEES, AND SUPPLIERS SHALL NOT BE LIABLE
            FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
            DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, LOSS OF
            CONTRACTS, BUSINESS INTERRUPTION, OR CONTRACTUAL BREACH PENALTIES
            ARISING OUT OF YOUR USE OF OR INABILITY TO USE THE PLATFORM.
          </p>
          <p className="text-xs">
            IN NO EVENT SHALL DOCKY'S TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS
            EXCEED THE TOTAL AMOUNT PAID BY YOU TO DOCKY IN THE TWELVE (12)
            MONTHS PRECEDING THE CLAIM OR ONE HUNDRED US DOLLARS ($100.00),
            WHICHEVER IS GREATER.
          </p>
        </div>
      </section>

      {/* Section 7: Suspension & Termination */}
      <section id="suspension-termination" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            7
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Account Suspension & Termination
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            We reserve the right to suspend or terminate your account
            immediately, without prior notice or liability, if you violate these
            Terms, engage in fraudulent activity, or fail to pay subscription
            fees.
          </p>
          <p className="text-xs">
            You may terminate your account at any time via the Settings page.
            Upon termination, your right to access the Platform will cease
            immediately, and your document data will be purged in accordance
            with our Privacy Policy.
          </p>
        </div>
      </section>

      {/* Section 8: Intellectual Property */}
      <section id="intellectual-property" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            8
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Intellectual Property Rights
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            The DOCKY platform, including its brand name, logos, user interface
            designs, visual layouts, backend architecture, proprietary
            algorithms, and documentation, are the exclusive intellectual
            property of DOCKY and its licensors.
          </p>
          <p className="text-xs">
            Nothing in these Terms grants you any right, title, or interest in
            our trademarks or copyrights, except for the limited license to
            access the SaaS services as expressly authorized herein.
          </p>
        </div>
      </section>

      {/* Section 9: Governing Law */}
      <section id="governing-law" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            9
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Governing Law & Dispute Resolution
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of Delaware, United States, without regard to its conflict
            of law principles.
          </p>
          <p className="text-xs">
            In the event of any dispute or claim arising out of these Terms, the
            parties agree to first attempt informal resolution in good faith by
            contacting <code>legal@docky.ai</code>. If unresolved within 30
            days, disputes shall be submitted to binding arbitration under JAMS
            rules.
          </p>
        </div>
      </section>

      {/* Section 10: Modifications & Contact */}
      <section id="modifications-contact" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            10
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Modifications & Contact Info
          </h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <p>
            We reserve the right to revise these Terms at any time. Updated
            versions will be posted on this page with an updated "Last Updated"
            date. Your continued use of DOCKY after changes take effect
            constitutes your acceptance of the revised Terms.
          </p>

          <div className="p-4 rounded-xl border border-border bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary" /> Questions About
                Terms of Service?
              </h4>
              <p className="text-xs text-muted-foreground">
                Contact our legal support team for clarification.
              </p>
            </div>
            <a
              href="mailto:legal@docky.ai"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
            >
              Contact Legal Team
            </a>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}
