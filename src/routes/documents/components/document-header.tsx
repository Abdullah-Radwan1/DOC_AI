// components/document/document-header.tsx
import { Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface DocumentHeaderProps {
  filename?: string;
  createdAt?: string;
  uploadedBy?: string | null;
  itemVariants: any;
}

export function DocumentHeader({
  filename,
  createdAt,
  uploadedBy,
  itemVariants,
}: DocumentHeaderProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"
    >
      <div className="space-y-2">
        <Link
          to="/dashboard/documents"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand to-accent">
            <FileText className="h-6 w-6 " />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {filename || "Contract_Acme_2024.pdf"}
            </h1>
            <p className="text-muted-foreground text-sm">
              Uploaded on{" "}
              {new Date(createdAt || Date.now()).toLocaleDateString()} by{" "}
              {uploadedBy || "Pending review"}
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
  );
}
