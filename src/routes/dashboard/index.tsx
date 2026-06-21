import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats, useUploadDocument } from '@/hooks/useDocuments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  Clock,
  Upload,
  ArrowRight,
  BarChart3,
  Shield,
  Activity,
  Calendar,
  Crown,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Sparkles,
  Zap,
  Lock,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const recentActivity = [
  { id: 1, action: 'Document analyzed', document: 'Contract_Acme_2024.pdf', time: '2 min ago', type: 'success' },
  { id: 2, action: 'High risk detected', document: 'NDA_TechStart.pdf', time: '15 min ago', type: 'warning' },
  { id: 3, action: 'Document uploaded', document: 'Service_Agreement.docx', time: '1 hour ago', type: 'info' },
  { id: 4, action: 'Compliance check passed', document: 'Privacy_Policy.pdf', time: '2 hours ago', type: 'success' },
  { id: 5, action: 'Report exported', document: 'Q4_Financials.pdf', time: '3 hours ago', type: 'info' },
];

const upcomingDeadlines = [
  { id: 1, title: 'Contract renewal: Acme Corp', date: '2024-02-15', daysLeft: 12, type: 'renewal' },
  { id: 2, title: 'Compliance audit due', date: '2024-02-10', daysLeft: 7, type: 'audit' },
  { id: 3, title: 'NDA expiration', date: '2024-02-20', daysLeft: 17, type: 'expiration' },
];

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'analyzing' | 'complete' | 'error';
  documentId?: string;
}

export function DashboardPage() {
  const { user } = useAuth();

  if (user) {
    return <LoggedInDashboard />;
  }

  return <PublicLandingPage />;
}

// ==========================================
// Logged In Dashboard
// ==========================================
function LoggedInDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useDashboardStats(user?.organization_id || 'mock-org-id');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const totalDocs = stats?.totalDocuments || 12;
  const analyzedDocs = stats?.analyzedDocuments || 10;
  const avgScore = stats?.averageComplianceScore || 78;
  const highRisk = stats?.highRiskDocuments || 3;
  const docsLimit = stats?.documentsLimit || 3;
  const docsUsed = 1;

  const scoreData = [{ name: 'Score', value: avgScore, fill: avgScore >= 80 ? '#22c55e' : avgScore >= 60 ? '#f59e0b' : '#ef4444' }];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your documents today.
          </p>
        </div>
        <Button asChild>
          <Link to="/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Link>
        </Button>
      </motion.div>

      {/* Upgrade Banner */}
      {docsUsed >= docsLimit && (
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10 border-blue-500/20">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Crown className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Free Plan: {docsUsed}/{docsLimit} documents used</h3>
                  <p className="text-sm text-muted-foreground">Upgrade to Pro for unlimited documents and advanced features.</p>
                </div>
              </div>
              <Button asChild className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Link to="/settings">
                  Upgrade Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div variants={containerVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalDocs}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+12%</span> from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Analyzed</CardTitle>
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <BarChart3 className="h-4 w-4 text-cyan-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analyzedDocs}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((analyzedDocs / totalDocs) * 100)}% completion rate
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Compliance</CardTitle>
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Shield className="h-4 w-4 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgScore}%</div>
              <Progress value={avgScore} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden border-red-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Risk</CardTitle>
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{highRisk}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Documents need attention
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Document Ingestion Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Document Ingestion</CardTitle>
              <CardDescription>Monthly document uploads and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.monthlyIngestion || []}>
                    <defs>
                      <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="documents"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorDocs)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Compliance Score Radial Chart */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Compliance Score</CardTitle>
              <CardDescription>Overall compliance health</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="100%"
                    barSize={12}
                    data={scoreData}
                    startAngle={180}
                    endAngle={-180}
                  >
                    <RadialBar
                      background={{ fill: 'hsl(var(--muted))' }}
                      dataKey="value"
                      cornerRadius={10}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{avgScore}%</span>
                  <span className="text-xs text-muted-foreground">Average</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Badge variant={avgScore >= 80 ? 'default' : avgScore >= 60 ? 'secondary' : 'destructive'}>
                  {avgScore >= 80 ? 'Good Standing' : avgScore >= 60 ? 'Needs Attention' : 'Critical'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Feed */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest document actions</CardDescription>
                </div>
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === 'success' ? 'bg-green-500' :
                      item.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.document}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>Next 30 days</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border/50"
                  >
                    <div className={`mt-0.5 p-1.5 rounded-lg ${
                      deadline.daysLeft <= 7 ? 'bg-red-500/10' :
                      deadline.daysLeft <= 14 ? 'bg-amber-500/10' : 'bg-blue-500/10'
                    }`}>
                      <Clock className={`h-4 w-4 ${
                        deadline.daysLeft <= 7 ? 'text-red-500' :
                        deadline.daysLeft <= 14 ? 'text-amber-500' : 'text-blue-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{deadline.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {deadline.daysLeft} days left
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ==========================================
// Public Welcoming Landing Page
// ==========================================
function PublicLandingPage() {
  const navigate = useNavigate();
  const uploadMutation = useUploadDocument();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const simulateUpload = async (uploadFile: UploadFile) => {
    const { file } = uploadFile;

    // Start upload
    setFiles(prev => prev.map(f =>
      f.file === file ? { ...f, status: 'uploading' } : f
    ));

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 80));
      setFiles(prev => prev.map(f =>
        f.file === file ? { ...f, progress: i } : f
      ));
    }

    // Transition to analyzing
    setFiles(prev => prev.map(f =>
      f.file === file ? { ...f, status: 'analyzing', progress: 0 } : f
    ));

    // Simulate analysis progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setFiles(prev => prev.map(f =>
        f.file === file ? { ...f, progress: i } : f
      ));
    }

    // Create document in database (using fallback IDs for public users)
    try {
      const result = await uploadMutation.mutateAsync({
        organizationId: 'mock-org-id',
        userId: 'mock-user-id',
        filename: file.name,
        fileSize: file.size,
      });

      setFiles(prev => prev.map(f =>
        f.file === file ? { ...f, status: 'complete', documentId: result.id } : f
      ));

      toast.success('Document analyzed successfully!', {
        description: 'You can now view the detailed compliance score and risk summary.',
        action: {
          label: 'View Analysis',
          onClick: () => navigate({ to: '/documents/$documentId', params: { documentId: result.id } }),
        },
      });
    } catch {
      setFiles(prev => prev.map(f =>
        f.file === file ? { ...f, status: 'error' } : f
      ));
      toast.error('Analysis failed', {
        description: 'There was an error analyzing your document.',
      });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );

    if (droppedFiles.length === 0) {
      toast.error('Invalid file type', {
        description: 'Only PDF files are supported.',
      });
      return;
    }

    const newFiles = droppedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }));

    setFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach(f => simulateUpload(f));
  }, [uploadMutation]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(
      file => file.type === 'application/pdf'
    );

    if (selectedFiles.length === 0) {
      toast.error('Invalid file type', {
        description: 'Only PDF files are supported.',
      });
      return;
    }

    const newFiles = selectedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }));

    setFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach(f => simulateUpload(f));
  };

  const removeFile = (file: File) => {
    setFiles(prev => prev.filter(f => f.file !== file));
  };

  const completedFiles = files.filter(f => f.status === 'complete');

  return (
    <div className="max-w-6xl mx-auto space-y-20 py-8 px-4 sm:px-6">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-sm font-medium"
        >
          <Sparkles className="h-4 w-4" />
          Next-Gen Contract Intelligence
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-blue-500 dark:to-cyan-400"
        >
          AI-Powered Contract Analysis & Compliance
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
        >
          Upload your contracts, NDAs, or agreements to get instant compliance scoring, automated summaries, risk analysis, and audit trails—no credit card or login required.
        </motion.p>
      </section>

      {/* Upload & Dropzone Area */}
      <section className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Left Column: Dropzone */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-3 space-y-6"
        >
          <Card className="border border-border/50 shadow-soft overflow-hidden bg-card/40 backdrop-blur-md relative">
            <div
              className={`
                absolute inset-0 pointer-events-none transition-all duration-300
                ${isDragging ? 'bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg' : ''}
              `}
            />
            <CardContent className="p-0">
              <label
                className={`
                  relative block min-h-[320px] cursor-pointer
                  flex flex-col items-center justify-center
                  border-2 border-dashed rounded-xl m-4 p-8
                  transition-all duration-300
                  ${isDragging
                    ? 'border-blue-500 bg-blue-500/5'
                    : 'border-border/50 hover:border-blue-500/50 hover:bg-muted/30'
                  }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className={`transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm
                    ${isDragging ? 'bg-blue-500/20' : 'bg-muted/50'}
                  `}>
                    <UploadCloud className={`h-8 w-8 ${isDragging ? 'text-blue-500' : 'text-muted-foreground'}`} />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-lg font-medium">
                    {isDragging ? 'Drop your PDF here' : 'Drag & drop contract PDF'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or <span className="text-primary font-medium hover:underline">browse files from your device</span>
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-3 rounded-md bg-muted/60 text-xs text-muted-foreground font-medium">
                    <Shield className="h-3.5 w-3.5 text-blue-500" />
                    PDF contracts up to 10MB
                  </div>
                </div>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </CardContent>
          </Card>

          {/* Upload Queue for Landing Page */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <Card className="border-border/50 bg-card/40 backdrop-blur-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Analysis Queue</CardTitle>
                        <CardDescription className="text-sm">
                          {files.length} file{files.length !== 1 ? 's' : ''} - {completedFiles.length} complete
                        </CardDescription>
                      </div>
                      {completedFiles.length > 0 && (
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                          onClick={() => {
                            const firstFile = completedFiles[0];
                            if (firstFile?.documentId) {
                              navigate({ to: '/documents/$documentId', params: { documentId: firstFile.documentId } });
                            }
                          }}
                        >
                          View Results
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {files.map((uploadFile, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`
                          flex items-center gap-4 p-4 rounded-lg border transition-colors
                          ${uploadFile.status === 'error'
                            ? 'border-red-500/30 bg-red-500/5'
                            : 'border-border/50 bg-muted/20'
                          }
                        `}
                      >
                        <div className={`p-2 rounded-lg ${
                          uploadFile.status === 'complete' ? 'bg-green-500/10' :
                          uploadFile.status === 'error' ? 'bg-red-500/10' :
                          'bg-muted/50'
                        }`}>
                          {uploadFile.status === 'complete' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : uploadFile.status === 'error' ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <FileText className="h-5 w-5 text-blue-500" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium truncate pr-4">{uploadFile.file.name}</p>
                            <span className="text-xs text-muted-foreground">
                              {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>

                          {uploadFile.status !== 'pending' && uploadFile.status !== 'error' && (
                            <div className="space-y-1">
                              <Progress value={uploadFile.progress} className="h-1.5 bg-muted/80" />
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {uploadFile.status === 'uploading' && 'Uploading contract...'}
                                  {uploadFile.status === 'analyzing' && 'Analyzing compliance rules...'}
                                  {uploadFile.status === 'complete' && 'AI compliance score complete!'}
                                </span>
                                <span className="text-xs text-muted-foreground">{uploadFile.progress}%</span>
                              </div>
                            </div>
                          )}

                          {uploadFile.status === 'error' && (
                            <p className="text-xs text-red-500 mt-1">
                              Failed to process. Check your network or file compatibility.
                            </p>
                          )}
                        </div>

                        {uploadFile.status === 'complete' && uploadFile.documentId && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link to="/documents/$documentId" params={{ documentId: uploadFile.documentId }}>
                              View
                              <ArrowRight className="ml-1 h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        )}

                        {uploadFile.status !== 'uploading' && uploadFile.status !== 'analyzing' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-muted"
                            onClick={() => removeFile(uploadFile.file)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}

                        {(uploadFile.status === 'uploading' || uploadFile.status === 'analyzing') && (
                          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                        )}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Column: Platform Features */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight">Standard Platform Features</h3>
            <p className="text-sm text-muted-foreground">
              Evaluate agreements with our lightweight tool or unlock the full dashboard by creating a free account.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: Shield,
                title: 'Compliance Verification',
                desc: 'Audits contracts against standard industry regulations (GDPR, SOC 2, HIPAA, etc.) instantly.',
              },
              {
                icon: Zap,
                title: 'Automated Summary',
                desc: 'Distills complex, multi-page agreements into high-level executive briefs highlighting key terms.',
              },
              {
                icon: AlertTriangle,
                title: 'Risk Identification',
                desc: 'Flags unusual obligations, missing signatures, liability exposures, and renewal traps.',
              },
              {
                icon: Lock,
                title: 'Secure & Confidential',
                desc: 'All documents are processed securely with enterprise-level encryption and private data controls.',
              },
            ].map((feat, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border border-border/40 bg-card/25 hover:bg-muted/10 transition-colors">
                <div className="p-2.5 h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <feat.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">{feat.title}</h4>
                  <p className="text-xs text-muted-foreground leading-normal">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Dynamic Visual Mockup / CTA */}
      <section className="bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 border border-blue-500/15 rounded-3xl p-8 sm:p-12 text-center max-w-5xl mx-auto space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Unlock Full Organization & Audit Logging
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            By creating a free demo profile, you can manage team members, customize organization-wide compliance targets, track renewal deadlines, and review previous contract logs in a central dashboard.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" asChild>
            <Link to="/register">Create Free Account</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/login">Sign In Instead</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
