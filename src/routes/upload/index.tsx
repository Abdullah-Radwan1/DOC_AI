import { useState, useCallback } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useUploadDocument } from '@/hooks/useDocuments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  ArrowRight,
  Shield,
  BarChart3,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'analyzing' | 'complete' | 'error';
  documentId?: string;
}

export function UploadPage() {
  const { user } = useAuth();
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
      await new Promise(resolve => setTimeout(resolve, 100));
      setFiles(prev => prev.map(f =>
        f.file === file ? { ...f, progress: i } : f
      ));
    }

    // Transition to analyzing
    setFiles(prev => prev.map(f =>
      f.file === file ? { ...f, status: 'analyzing', progress: 0 } : f
    ));

    // Simulate analysis progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setFiles(prev => prev.map(f =>
        f.file === file ? { ...f, progress: i } : f
      ));
    }

    // Create document in database
    try {
      const result = await uploadMutation.mutateAsync({
        organizationId: user?.organization_id || 'mock-org-id',
        userId: user?.id || 'mock-user-id',
        filename: file.name,
        fileSize: file.size,
      });

      setFiles(prev => prev.map(f =>
        f.file === file ? { ...f, status: 'complete', documentId: result.id } : f
      ));

      toast.success('Document uploaded successfully', {
        description: 'Your document is now being analyzed.',
        action: {
          label: 'View Analysis',
          onClick: () => navigate({ to: '/documents/$documentId', params: { documentId: result.id } }),
        },
      });
    } catch {
      setFiles(prev => prev.map(f =>
        f.file === file ? { ...f, status: 'error' } : f
      ));
      toast.error('Upload failed', {
        description: 'There was an error uploading your document.',
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
  }, [uploadMutation, user]);

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Upload Document</h1>
        <p className="text-muted-foreground">
          Upload your PDF contracts for AI-powered analysis
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: Shield, title: 'Secure Processing', description: '256-bit encryption' },
          { icon: BarChart3, title: 'AI Analysis', description: 'Advanced compliance scoring' },
          { icon: Clock, title: 'Fast Results', description: 'Results in seconds' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-muted/30">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <item.icon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Drop Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="relative overflow-hidden">
          <div
            className={`
              absolute inset-0 pointer-events-none transition-all duration-300
              ${isDragging ? 'bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg' : ''}
            `}
          />
          <CardContent className="p-0">
            <label
              className={`
                relative block min-h-[300px] cursor-pointer
                flex flex-col items-center justify-center
                border-2 border-dashed rounded-lg m-4 p-8
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
                  w-16 h-16 rounded-full flex items-center justify-center mb-4
                  ${isDragging ? 'bg-blue-500/20' : 'bg-muted'}
                `}
                >
                  <UploadCloud className={`h-8 w-8 ${isDragging ? 'text-blue-500' : 'text-muted-foreground'}`} />
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-lg font-medium">
                  {isDragging ? 'Drop files here' : 'Drag & drop your PDF files'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or <span className="text-primary font-medium">browse to select files</span>
                </p>
                <Badge variant="secondary" className="mt-2">
                  PDF files only (max 10MB per file)
                </Badge>
              </div>

              <input
                type="file"
                accept=".pdf,application/pdf"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upload Queue */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Upload Queue</CardTitle>
                    <CardDescription className="text-sm">
                      {files.length} file{files.length !== 1 ? 's' : ''} - {completedFiles.length} complete
                    </CardDescription>
                  </div>
                  {completedFiles.length > 0 && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        const firstFile = completedFiles[0];
                        if (firstFile?.documentId) {
                          navigate({ to: '/documents/$documentId', params: { documentId: firstFile.documentId } });
                        }
                      }}
                    >
                      View Analysis
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {files.map((uploadFile, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`
                      flex items-center gap-4 p-4 rounded-lg
                      border transition-colors
                      ${uploadFile.status === 'error'
                        ? 'border-red-500/50 bg-red-500/5'
                        : 'border-border/50 bg-muted/30'
                      }
                    `}
                  >
                    <div className={`p-2 rounded-lg ${
                      uploadFile.status === 'complete' ? 'bg-green-500/10' :
                      uploadFile.status === 'error' ? 'bg-red-500/10' :
                      'bg-muted'
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
                          <Progress value={uploadFile.progress} className="h-1.5" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {uploadFile.status === 'uploading' && 'Uploading...'}
                              {uploadFile.status === 'analyzing' && 'Analyzing document...'}
                              {uploadFile.status === 'complete' && 'Analysis complete'}
                            </span>
                            <span className="text-xs text-muted-foreground">{uploadFile.progress}%</span>
                          </div>
                        </div>
                      )}

                      {uploadFile.status === 'error' && (
                        <p className="text-xs text-red-500 mt-1">
                          Upload failed. Please try again.
                        </p>
                      )}
                    </div>

                    {uploadFile.status === 'complete' && uploadFile.documentId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link to="/documents/$documentId" params={{ documentId: uploadFile.documentId }}>
                          View
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    )}

                    {uploadFile.status !== 'uploading' && uploadFile.status !== 'analyzing' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
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

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-start gap-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20"
      >
        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Supported Document Types</p>
          <p className="text-xs text-muted-foreground">
            This platform supports contracts, NDAs, service agreements, privacy policies, and other legal documents.
            For best results, ensure your PDFs are text-searchable (not scanned images).
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
