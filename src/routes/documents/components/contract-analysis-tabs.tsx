import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  FileWarning,
  Building2,
  MapPin,
  Users,
  DollarSign,
  Gavel,
  Scale,
  RefreshCw,
  CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";
import { NotRequestedPlaceholder } from "./not-requested-placeholder";

interface ContractAnalysisTabsProps {
  aiAnalysis: any;
  analysis?: any;
  itemVariants: any;
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
      {text}
    </div>
  );
}

export function ContractAnalysisTabs({
  aiAnalysis,
  analysis,
  itemVariants,
}: ContractAnalysisTabsProps) {
  const source = aiAnalysis ?? analysis ?? {};

  // Options determine which sections were requested
  const options = source?.analysisOptions ?? null;
  const isSectionRequested = (key: string) => {
    if (!options) return true; // Legacy analysis support
    if (key === "clauses") {
      return options.contract?.renewalTerms !== false;
    }
    return (options.contract as any)?.[key] !== false;
  };

  const parties = source?.contract?.parties ?? [];
  const obligations = source?.contract?.obligations ?? [];
  const paymentTerms = source?.contract?.paymentTerms ?? [];
  const penalties = source?.contract?.penalties ?? [];
  const renewalTerms = source?.contract?.renewalTerms ?? [];
  const governingLaw = source?.contract?.governingLaw ?? "";
  const importantDates = source?.contract?.importantDates ?? [];

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-[#2563EB]" />
            <CardTitle>Contract Analysis</CardTitle>
          </div>
          <CardDescription>
            Structured breakdown of parties, obligations, payment terms,
            clauses, and key dates
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="parties">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="parties">Parties</TabsTrigger>
              <TabsTrigger value="obligations">Obligations</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="penalties">Penalties</TabsTrigger>
              <TabsTrigger value="clauses">Clauses</TabsTrigger>
              <TabsTrigger value="dates">Dates</TabsTrigger>
            </TabsList>

            <TabsContent value="parties" className="mt-4">
              {!isSectionRequested("parties") ? (
                <NotRequestedPlaceholder label="Parties Details" />
              ) : parties.length === 0 ? (
                <EmptyState text="No parties were extracted from this document." />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {parties.map((party: any, i: number) => (
                    <div
                      key={i}
                      className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#2563EB]/10 p-2">
                          <Building2 className="h-5 w-5 text-[#2563EB]" />
                        </div>

                        <div>
                          <p className="font-medium">
                            {party.name || "Unknown party"}
                          </p>
                          {party.role ? (
                            <Badge variant="secondary">{party.role}</Badge>
                          ) : (
                            <Badge variant="secondary">Unspecified role</Badge>
                          )}
                        </div>
                      </div>

                      {party.address ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {party.address}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No address extracted
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="obligations" className="mt-4">
              {!isSectionRequested("obligations") ? (
                <NotRequestedPlaceholder label="Obligations Details" />
              ) : obligations.length === 0 ? (
                <EmptyState text="No obligations were extracted from this document." />
              ) : (
                <div className="space-y-3">
                  {obligations.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-border/50 p-3"
                    >
                      <div className="rounded-lg bg-[#2563EB]/10 p-2">
                        <Users className="h-4 w-4 text-[#2563EB]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">
                            {item.party || "Unspecified party"}
                          </p>
                          {item.clauseReference && (
                            <Badge variant="outline">
                              {item.clauseReference}
                            </Badge>
                          )}
                          {item.pageNumber && (
                            <Badge variant="secondary">
                              Page {item.pageNumber}
                            </Badge>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.obligation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="payment" className="mt-4">
              {!isSectionRequested("paymentTerms") ? (
                <NotRequestedPlaceholder label="Payment Terms" />
              ) : paymentTerms.length === 0 ? (
                <EmptyState text="No payment terms were extracted from this document." />
              ) : (
                <div className="space-y-3">
                  {paymentTerms.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border/50 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <DollarSign className="mt-0.5 h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">
                              {item.description || "Payment term"}
                            </p>

                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                              {item.frequency && (
                                <span>Frequency: {item.frequency}</span>
                              )}
                              {item.dueDate && <span>Due: {item.dueDate}</span>}
                              {item.clauseReference && (
                                <span>Clause: {item.clauseReference}</span>
                              )}
                              {item.pageNumber && (
                                <span>Page: {item.pageNumber}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="font-semibold">
                          {item.amount || "Not specified"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="penalties" className="mt-4">
              {!isSectionRequested("penalties") ? (
                <NotRequestedPlaceholder label="Penalties" />
              ) : penalties.length === 0 ? (
                <EmptyState text="No penalties or breach consequences were extracted from this document." />
              ) : (
                <div className="space-y-3">
                  {penalties.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
                    >
                      <div className="rounded-lg bg-destructive/10 p-2">
                        <Gavel className="h-4 w-4 text-destructive" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">
                            {item.type || "Penalty"}
                          </p>
                          {item.clauseReference && (
                            <Badge variant="outline">
                              {item.clauseReference}
                            </Badge>
                          )}
                          {item.pageNumber && (
                            <Badge variant="secondary">
                              Page {item.pageNumber}
                            </Badge>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.penalty}
                        </p>

                        {item.trigger && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Trigger: {item.trigger}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="clauses" className="mt-4">
              {!isSectionRequested("clauses") ? (
                <NotRequestedPlaceholder label="Renewal & Termination Clauses" />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-border/50 p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="rounded-lg bg-[#2563EB]/10 p-2">
                        <Scale className="h-5 w-5 text-[#2563EB]" />
                      </div>
                      <p className="font-medium">Governing Law</p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {governingLaw || "No governing law clause extracted."}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/50 p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="rounded-lg bg-yellow-500/10 p-2">
                        <RefreshCw className="h-5 w-5 text-yellow-600" />
                      </div>
                      <p className="font-medium">Renewal Terms</p>
                    </div>

                    {renewalTerms.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No renewal terms extracted.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {renewalTerms.map((term: any, i: number) => (
                          <div
                            key={i}
                            className="text-sm text-muted-foreground"
                          >
                            <p className="font-medium text-foreground">
                              {term.type || "Renewal clause"}
                            </p>
                            <p>Period: {term.period || "Not specified"}</p>
                            <p>
                              Notice:{" "}
                              {term.noticePeriod ||
                                term.notice_period ||
                                "Not specified"}
                            </p>
                            <p>
                              Auto renew:{" "}
                              {typeof term.auto_renew === "boolean"
                                ? term.auto_renew
                                  ? "Yes"
                                  : "No"
                                : "Not specified"}
                            </p>
                            {term.clauseReference && (
                              <p className="text-xs">
                                Clause: {term.clauseReference}
                              </p>
                            )}
                            {term.pageNumber && (
                              <p className="text-xs">Page: {term.pageNumber}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="dates" className="mt-4">
              {!isSectionRequested("importantDates") ? (
                <NotRequestedPlaceholder label="Important Dates" />
              ) : importantDates.length === 0 ? (
                <EmptyState text="No important dates were extracted from this document." />
              ) : (
                <div className="space-y-3">
                  {importantDates.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-border/50 p-4"
                    >
                      <div className="rounded-lg bg-[#2563EB]/10 p-2">
                        <CalendarDays className="h-4 w-4 text-[#2563EB]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">
                            {item.label || item.type || "Important date"}
                          </p>
                          {item.date && (
                            <Badge variant="secondary">{item.date}</Badge>
                          )}
                          {item.clauseReference && (
                            <Badge variant="outline">
                              {item.clauseReference}
                            </Badge>
                          )}
                          {item.pageNumber && (
                            <Badge variant="secondary">
                              Page {item.pageNumber}
                            </Badge>
                          )}
                        </div>

                        {item.description && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
export default ContractAnalysisTabs;
