import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats } from '@/hooks/useDocuments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

export function DashboardPage() {
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
                    <Tooltip
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
