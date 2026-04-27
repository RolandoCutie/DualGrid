'use client';

import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export default function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0 w-full">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            {/* Circle */}
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold border-2 transition-all duration-300',
                isCompleted && 'border-primary bg-primary text-primary-foreground',
                isCurrent && 'border-primary bg-background text-primary',
                !isCompleted && !isCurrent && 'border-border bg-background text-muted-foreground',
              )}
            >
              {isCompleted ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                step
              )}
            </div>

            {/* Label */}
            {labels?.[i] && (
              <span
                className={cn(
                  'ml-2 text-xs font-medium hidden sm:block',
                  isCompleted || isCurrent ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {labels[i]}
              </span>
            )}

            {/* Connector */}
            {step < totalSteps && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 rounded-full transition-all duration-300',
                  isCompleted ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
