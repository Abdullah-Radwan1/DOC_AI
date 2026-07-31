import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { useDocuments, useDeleteDocument, useAnalyzeDocument } from "@/hooks/useDocuments";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Search,
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Loader2,
  Upload,
  BrainCircuit,
} from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<
  string,
  {
    badge: "outline" | "secondary" | "default" | "destructive";
    icon: typeof Clock;
    label: string;
    animate?: boolean;
  }
> = {
  uploaded: { badge: "outline", icon: Clock, label: "Uploaded" },
  extracting: {
    badge: "secondary",
    icon: Loader2,
    label: "Extracting",
    animate: true,
  },
  chunking: {
    badge: "secondary",
    icon: Loader2,
    label: "Chunking",
    animate: true,
  },
  ready: { badge: "default", icon: CheckCircle2, label: "Ready" },
  failed: { badge: "destructive", icon: AlertTriangle, label: "Failed" },
};

const riskConfig = {
  high: { badge: "destructive", label: "High Risk" },
  medium: { badge: "secondary", label: "Medium" },
  low: { badge: "outline", label: "Low" },
};

export function DocumentsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Extract sorting parameters
  const sortBy = sorting[0]?.id || "created_at";
  const sortOrder = sorting[0]?.desc ? "desc" : "asc";

  const { data: response, isLoading } = useDocuments({
    page,
    limit: pageSize,
    search: globalFilter || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    riskLevel: riskFilter === "all" ? undefined : riskFilter,
    sortBy,
    sortOrder,
  });

  const deleteMutation = useDeleteDocument();
  const analyzeMutation = useAnalyzeDocument();
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(
      { documentId: deleteTarget.id },
      {
        onSuccess: () => {
          toast.success("Document deleted", {
            description: `"${deleteTarget.name}" has been permanently removed.`,
          });
          setDeleteTarget(null);
        },
        onError: (err: any) => {
          toast.error("Delete failed", {
            description: err?.response?.data?.message ?? err?.message ?? "Could not delete document.",
          });
          setDeleteTarget(null);
        },
      },
    );
  };

  const handleAnalyze = async (documentId: string) => {
    setAnalyzingIds((prev) => new Set(prev).add(documentId));
    try {
      await analyzeMutation.mutateAsync({ documentId });
      toast.success("Analysis started", {
        description: "Your document is being analyzed. Visit the document page to track progress.",
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "Analysis failed";
      toast.error("Analysis failed", { description: msg });
    } finally {
      setAnalyzingIds((prev) => {
        const next = new Set(prev);
        next.delete(documentId);
        return next;
      });
    }
  };

  const documents = response?.data ?? [];
  const meta = response?.meta ?? {
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: pageSize,
    totalPages: 1,
    currentPage: 1,
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "filename",
        header: ({ column }: any) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Document
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: any) => (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand/10">
              <FileText className="h-4 w-4 text-brand" />
            </div>
            <div>
              <p className="font-medium truncate max-w-[200px]">
                {row.original.filename}
              </p>
              <p className="text-xs text-muted-foreground">
                {row.original.file_size
                  ? `${(row.original.file_size / 1024 / 1024).toFixed(2)} MB`
                  : "--"}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: any) => {
          const status = row.original.status;
          const config = statusConfig[status as keyof typeof statusConfig] || {
            badge: "outline",
            icon: Clock,
            label: status || "Unknown",
          };
          const Icon = config.icon;
          return (
            <Badge variant={config.badge} className="gap-1">
              <Icon
                className={`h-3 w-3 ${config.animate ? "animate-spin" : ""}`}
              />
              {config.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: "risk_level",
        header: "Risk Level",
        cell: ({ row }: any) => {
          const risk = row.original.risk_level;
          if (!risk) return <span className="text-muted-foreground">--</span>;
          const config = riskConfig[risk as keyof typeof riskConfig];
          return (
            <Badge variant={config?.badge as any}>
              {config?.label || risk}
            </Badge>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: ({ column }: any) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Uploaded
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: any) => (
          <span className="text-sm text-muted-foreground">
            {row.original.created_at
              ? new Date(row.original.created_at).toLocaleDateString()
              : "--"}
          </span>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }: any) => {
          const docId = row.original.id;
          const isReady = row.original.status === "ready";
          const hasAnalysis = !!row.original.risk_level;
          const isAnalyzingThis = analyzingIds.has(docId);
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-card/95 backdrop-blur-xl border-border/50"
              >
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link
                    to="/dashboard/documents/$documentId"
                    params={{ documentId: docId }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Analysis
                  </Link>
                </DropdownMenuItem>

                {/* Analyze — only shown for ready documents without prior analysis */}
                {isReady && !hasAnalysis && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleAnalyze(docId)}
                      disabled={isAnalyzingThis}
                    >
                      {isAnalyzingThis ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <BrainCircuit className="mr-2 h-4 w-4 text-brand" />
                      )}
                      {isAnalyzingThis ? "Analyzing…" : "Analyze"}
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() =>
                    setDeleteTarget({ id: docId, name: row.original.filename ?? row.original.original_file_name ?? "Document" })
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [analyzingIds, setDeleteTarget],
  );

  const table = useReactTable({
    data: documents,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-1">
            Manage and analyze your uploaded documents
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={globalFilter}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  setPage(1); // Reset page to 1 on search
                }}
                className="pl-9 max-w-sm"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setPage(1); // Reset page to 1 on filter
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="uploaded">Uploaded</SelectItem>
                  <SelectItem value="extracting">Extracting</SelectItem>
                  <SelectItem value="chunking">Chunking</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={riskFilter}
                onValueChange={(val) => {
                  setRiskFilter(val);
                  setPage(1); // Reset page to 1 on filter
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <FileText className="h-8 w-8" />
                          <p>No documents found.</p>
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/dashboard/upload">
                              Upload your first document
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && meta.totalItems > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, meta.totalItems)} of {meta.totalItems}{" "}
            documents
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {meta.totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setPage((prev) => Math.min(meta.totalPages, prev + 1))
              }
              disabled={page === meta.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage(meta.totalPages)}
              disabled={page === meta.totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[80px] h-8 ml-2">
                <SelectValue placeholder={String(pageSize)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* ── Delete confirmation dialog ───────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete document?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                You are about to permanently delete{" "}
                <span className="font-semibold text-foreground">
                  "{deleteTarget?.name}"
                </span>
                .
              </p>
              <p>
                This will remove the document, all extracted content, analysis
                results, and findings. <span className="font-medium text-destructive">This action cannot be undone.</span>
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {deleteMutation.isPending ? "Deleting…" : "Delete permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
