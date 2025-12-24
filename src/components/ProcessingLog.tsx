import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogStep {
  id: number;
  text: string;
  status: "pending" | "processing" | "complete";
}

const initialSteps: LogStep[] = [
  { id: 1, text: "Initializing U-Net Architecture...", status: "pending" },
  { id: 2, text: "Loading pre-trained weights...", status: "pending" },
  { id: 3, text: "Analyzing damage patterns...", status: "pending" },
  { id: 4, text: "Inpainting missing pixels...", status: "pending" },
  { id: 5, text: "Enhancing color depth...", status: "pending" },
  { id: 6, text: "Generating restoration metadata...", status: "pending" },
  { id: 7, text: "Computing authenticity hash...", status: "pending" },
  { id: 8, text: "Minting Token on Polygon...", status: "pending" },
];

interface ProcessingLogProps {
  isRunning: boolean;
  onComplete?: () => void;
}

export function ProcessingLog({ isRunning, onComplete }: ProcessingLogProps) {
  const [steps, setSteps] = useState<LogStep[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Handle completion callback separately to avoid setState during render
  useEffect(() => {
    if (isCompleted && onComplete) {
      onComplete();
    }
  }, [isCompleted, onComplete]);

  useEffect(() => {
    if (!isRunning) {
      setSteps(initialSteps);
      setCurrentStep(0);
      setIsCompleted(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length) {
          clearInterval(interval);
          setIsCompleted(true);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    setSteps((prevSteps) =>
      prevSteps.map((step, index) => ({
        ...step,
        status:
          index < currentStep
            ? "complete"
            : index === currentStep
            ? "processing"
            : "pending",
      }))
    );
  }, [currentStep, isRunning]);

  return (
    <div className="glass-card rounded-xl p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
        <h3 className="font-mono text-sm font-semibold text-gold">
          PROCESSING LOG
        </h3>
      </div>

      <div className="space-y-2 font-mono text-xs">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg transition-all duration-300",
              step.status === "complete" && "bg-terracotta/10",
              step.status === "processing" && "bg-gold/10"
            )}
          >
            {step.status === "pending" && (
              <Circle className="w-4 h-4 text-muted-foreground" />
            )}
            {step.status === "processing" && (
              <Loader2 className="w-4 h-4 text-gold animate-spin" />
            )}
            {step.status === "complete" && (
              <CheckCircle2 className="w-4 h-4 text-terracotta-light" />
            )}
            <span
              className={cn(
                "transition-colors duration-300",
                step.status === "pending" && "text-muted-foreground",
                step.status === "processing" && "text-gold",
                step.status === "complete" && "text-foreground"
              )}
            >
              {step.text}
            </span>
          </div>
        ))}
      </div>

      {currentStep >= steps.length && isRunning && (
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-terracotta/20 to-gold/20 border border-gold/30">
          <p className="text-xs text-gold font-medium">
            ✓ Restoration complete. NFT minted successfully.
          </p>
        </div>
      )}
    </div>
  );
}
