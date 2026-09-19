export interface StepRowItem {
  id: string;
  data: Record<string, string | number | boolean | null>;
  status: "keep" | "filtered" | "source" | "joined";
  statusText: string;
  reason: string;
}

/**
 * Presentation metadata for a JOIN already identified by the query-step
 * simulation. This keeps the visual layer from adding a second parser.
 */
export interface JoinVisualizationDetails {
  leftTable: string;
  rightTable: string;
  leftKey: string;
  rightKey: string;
  joinType: string;
}

export interface QueryStep {
  stepNumber: number;
  clause: string;
  title: string;
  badge: string;
  description: string;
  explanation: string;
  rowsBeforeCount: number;
  rowsAfterCount: number;
  rowEvaluations: StepRowItem[];
  joinDetails?: JoinVisualizationDetails;
}

export interface PipelineSimulationResult {
  query: string;
  executionTimeMs: number;
  columns: string[];
  finalRows: Record<string, string | number>[];
  totalRows: number;
  steps: QueryStep[];
}
