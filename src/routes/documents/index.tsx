import { useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { useAuth } from '@/hooks/useAuth';
import { useDocuments, useDeleteDocument } from '@/hooks/useDocuments';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Download,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Loader2,
  Upload,
} from 'lucide-react';

const mockDocuments = [
  { id: '1', filename: 'Contract_Acme_2024.pdf', status: 'analyzed', risk_level: 'high', compliance_score: 62, created_at: '2024-01-15T10:30:00Z', file_size: 2450000 },
  { id: '2', filename: 'NDA_TechStart.pdf', status: 'analyzed', risk_level: 'medium', compliance_score: 75, created_at: '2024-01-14T14:20:00Z', file_size: 1800000 },
  { id: '3', filename: 'Service_Agreement_Global.docx.pdf', status: 'pending', risk_level: null, compliance_score: null, created_at: '2024-01-14T09:15:00Z', file_size: 3200000 },
  { id: '4', filename: 'Privacy_Policy_v2.pdf', status: 'analyzed', risk_level: 'low', compliance_score: 92, created_at: '2024-01-13T16:45:00Z', file_size: 1500000 },
  { id: '5', filename: 'Employment_Contract_JD.pdf', status: 'analyzing', risk_level: null, compliance_score: null, created_at: '2024-01-13T11:00:00Z', file_size: 2100000 },
  { id: '6', filename: 'Vendor_Agreement_SupplyCo.pdf', status: 'analyzed', risk_level: 'high', compliance_score: 45, created_at: '2024-01-12T08:30:00Z', file_size: 2800000 },
  { id: '7', filename: 'Partnership_Deed_NextGen.pdf', status: 'failed', risk_level: null, compliance_score: null, created_at: '2024-01-11T15:00:00Z', file_size: 3500000 },
  { id: '8', filename: 'Licensing_Deal_MediaInc.pdf', status: 'analyzed', risk_level: 'medium', compliance_score: 78, created_at: '2024-01-10T12:45:00Z', file_size: 1900000 },
];

const statusConfig: Record<string, { badge: 'outline' | 'secondary' | 'default' | 'destructive'; icon: typeof Clock; label: string; animate?: boolean }> = {
  pending: { badge: 'outline', icon: Clock, label: 'Pending' },
  analyzing: { badge: 'secondary', icon: Loader2, label: 'Analyzing', animate: true },
  analyzed: { badge: 'default', icon: CheckCircle2, label: 'Analyzed' },
  failed: { badge: 'destructive', icon: AlertTriangle, label: 'Failed' },
};

const riskConfig = {
  high: { badge: 'destructive', label: 'High Risk' },
  medium: { badge: 'secondary', label: 'Medium' },
  low: { badge: 'outline', label: 'Low' },
};

export function DocumentsPage() {
  const { user } = useAuth();
  const { data: documents, isLoading } = useDocuments(user?.organization_id || 'mock-org-id');
  const deleteMutation = useDeleteDocument();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const data = useMemo(() => {
    const docs = documents?.length ? documents : mockDocuments;
    return docs.filter(doc => {
      if (riskFilter !== 'all' && doc.risk_level !== riskFilter) return false;
      if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
      return true;
    });
  }, [documents, riskFilter, statusFilter]);

  const columns = useMemo(() => [
    {
      accessorKey: 'filename',
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
        >
          Document
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <FileText className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <p className="font-medium truncate max-w-[200px]">{row.original.filename}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.file_size ? `${(row.original.file_size / 1024 / 1024).toFixed(2)} MB` : '--'}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const config = statusConfig[row.original.status as keyof typeof statusConfig];
        const Icon = config?.icon || Clock;
        return (
          <Badge variant={config?.badge as any} className="gap-1">
            <Icon className={`h-3 w-3 ${config?.animate ? 'animate-spin' : ''}`} />
            {config?.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'risk_level',
      header: 'Risk Level',
      cell: ({ row }: any) => {
        const risk = row.original.risk_level;
        if (!risk) return <span className="text-muted-foreground">--</span>;
        const config = riskConfig[risk as keyof typeof riskConfig];
        return (
          <Badge variant={config?.badge as any}>
            {config?.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'compliance_score',
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
        >
          Compliance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: any) => {
        const score = row.original.compliance_score;
        if (score === null || score === undefined) return <span className="text-muted-foreground">--</span>;
        return (
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              score >= 80 ? 'bg-green-500/10 text-green-500' :
              score >= 60 ? 'bg-amber-500/10 text-amber-500' :
              'bg-red-500/10 text-red-500'
            }`}>
              {score}
            </div>
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }: any) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
        >
          Uploaded
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: any) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.original.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border/50">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/documents/$documentId" params={{ documentId: row.original.id }}>
                <Eye className="mr-2 h-4 w-4" />
                View Analysis
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onClick={() => deleteMutation.mutate({
                documentId: row.original.id,
                organizationId: user?.organization_id || 'mock-org-id'
              })}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [deleteMutation, user?.organization_id]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
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
          <Link to="/upload">
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
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 max-w-sm"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="analyzing">Analyzing</SelectItem>
                  <SelectItem value="analyzed">Analyzed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
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
                                header.getContext()
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
                        data-state={row.getIsSelected() && 'selected'}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <FileText className="h-8 w-8" />
                          <p>No documents found.</p>
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/upload">Upload your first document</Link>
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
      {data.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              data.length
            )}{' '}
            of {data.length} documents
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
