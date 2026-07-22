import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { AnalysisOptionsForm } from "./analysis-options-form";
import { AnalysisOptions } from "@/lib/types/analysis-options";

interface AnalysisConfigSectionProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  show: boolean;
  disabled: boolean;
  analysisOptions: AnalysisOptions;
  onAnalysisOptionsChange: (next: AnalysisOptions) => void;
}

export function AnalysisConfigSection({
  prompt,
  onPromptChange,
  show,
  disabled,
  analysisOptions,
  onAnalysisOptionsChange,
}: AnalysisConfigSectionProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="gap-6 items-start space-y-5"
        >
          {/* Compliance Prompt & Quick Examples */}
          <div className="space-y-4 flex flex-col h-full">
            <div className="flex items-center gap-3">
              <div className="flex h-8 border w-8 items-center justify-center rounded-full bg-brand font-bold shadow-sm shrink-0">
                1
              </div>
              <h3 className="text-lg font-semibold">Analysis Prompt</h3>
            </div>
            <div className="space-y-3 flex flex-col flex-1 justify-between">
              <div className="space-y-2">
                <Textarea
                  placeholder='Example: "Review this vendor agreement against GDPR..."'
                  className="resize-none min-h-[140px] text-sm leading-relaxed"
                  value={prompt}
                  onChange={(e) => onPromptChange(e.target.value)}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>

          {/*  Analysis Options Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex border h-8 w-8 items-center justify-center rounded-full bg-brand font-bold shadow-sm shrink-0">
                2
              </div>
              <h3 className="text-lg font-semibold">Option Analysis</h3>
            </div>
            <div>
              <AnalysisOptionsForm
                value={analysisOptions}
                onChange={onAnalysisOptionsChange}
                disabled={disabled}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
