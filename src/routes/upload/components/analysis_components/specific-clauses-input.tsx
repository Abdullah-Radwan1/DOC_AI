import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ListChecks, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useCallback } from "react";

interface SpecificClausesInputProps {
  show: boolean;
  value: string[];
  disabled?: boolean;
  onChange: (clauses: string[]) => void;
}

export function SpecificClausesInput({
  show,
  value,
  disabled = false,
  onChange,
}: SpecificClausesInputProps) {
  const [inputText, setInputText] = useState("");

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();

        const trimmed = inputText.trim();
        if (!trimmed) return;

        if (value.length >= 5) return;

        const isDuplicate = value.some(
          (clause) => clause.toLowerCase() === trimmed.toLowerCase()
        );
        if (isDuplicate) {
          setInputText("");
          return;
        }

        onChange([...value, trimmed]);
        setInputText("");
      }
    },
    [inputText, value, onChange]
  );

  const handleRemove = useCallback(
    (indexToRemove: number) => {
      onChange(value.filter((_, idx) => idx !== indexToRemove));
    },
    [value, onChange]
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="specific-clauses-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="ml-8 mt-2 space-y-2 pb-1 border-l-2 border-brand/20 pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ListChecks className="h-3 w-3 text-brand/70 flex-shrink-0" />
                <Label
                  htmlFor="specific-missing-clauses"
                  className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  Specific Clauses to Check{" "}
                  <span className="normal-case font-normal opacity-70">
                    (optional)
                  </span>
                </Label>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium select-none">
                {value.length} / 5 clauses
              </span>
            </div>
            <Input
              id="specific-missing-clauses"
              type="text"
              placeholder={
                value.length >= 5
                  ? "Maximum 5 clauses reached"
                  : "Type clause name and press Enter..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled || value.length >= 5}
              className="h-8 text-[11px] bg-muted/30 border-border/60 placeholder:text-muted-foreground/60 focus-visible:ring-brand/40"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
              Press Enter to add up to 5 clauses. When specified, the AI scans{" "}
              <span className="text-brand font-semibold">only</span> for these
              clauses and identifies which are missing. Leave blank for a full
              generic scan.
            </p>
            <div className="flex flex-wrap gap-1 pt-0.5">
              <AnimatePresence>
                {value.length > 0 &&
                  value.map((clause, idx) => (
                    <motion.span
                      key={clause}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-medium"
                    >
                      {clause}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(idx);
                        }}
                        disabled={disabled}
                        className="p-0.5 rounded-full hover:bg-brand/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand flex-shrink-0"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </motion.span>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
