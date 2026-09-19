import { ArrowDown } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JoinVisualizer } from "./join-visualizer";
import { QueryStepCard } from "./query-step-card";
import { StepNavigator } from "./step-navigator";
import type { QueryStep } from "@/lib/playground/query-steps";

export interface QueryVisualizationProps {
  steps: QueryStep[];
}

export function QueryVisualization({ steps }: QueryVisualizationProps) {
  if (!steps || steps.length === 0) return null;

  const lastStepId = steps.at(-1)?.stepNumber;

  return (
    <Card
      variant="white"
      className="border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111]"
    >
      <CardHeader className="bg-[#FFF3A3] border-b-2 border-[#111111]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="dark">INTI FITUR SQLENS</Badge>
              <CardTitle className="text-base md:text-lg">
                Query-to-Visual Explanation
              </CardTitle>
            </div>
            <CardDescription className="text-black/80 font-medium text-xs sm:text-sm">
              Alur dekonstruksi evaluasi internal database langkah demi langkah.
            </CardDescription>
          </div>

          <StepNavigator totalSteps={steps.length} />
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {steps.map((step) => (
          <div
            key={step.stepNumber}
            id={`query-step-${step.stepNumber}`}
            className="space-y-4"
          >
            <QueryStepCard step={step} />

            {step.joinDetails ? (
              <JoinVisualizer
                details={step.joinDetails}
                stepNumber={step.stepNumber}
              />
            ) : null}

            {step.stepNumber !== lastStepId && (
              <div
                className="flex flex-col items-center my-3"
                aria-hidden="true"
              >
                <div className="h-3 w-0.5 bg-[#111111]" />
                <div className="w-8 h-8 rounded-full border-2 border-[#111111] bg-[#FFD600] flex items-center justify-center shadow-[2px_2px_0px_0px_#111111]">
                  <ArrowDown size={16} strokeWidth={2.5} />
                </div>
                <div className="h-3 w-0.5 bg-[#111111]" />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
