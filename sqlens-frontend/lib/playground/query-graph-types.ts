import type { JoinVisualizationDetails, StepRowItem } from "./query-steps";

export type QueryFlowNodeType =
  | "TABLE"
  | "JOIN"
  | "WHERE"
  | "GROUP_BY"
  | "HAVING"
  | "SELECT"
  | "ORDER_BY"
  | "DISTINCT"
  | "LIMIT"
  | "UNION"
  | "RESULT";

export interface QueryFlowNode {
  id: string;
  stepNumber: number;
  type: QueryFlowNodeType;
  label: string;
  subtitle?: string;
  operation: string;
  inputRowCount: number;
  outputRowCount: number;
  rowDiff: number;
  evaluations: StepRowItem[];
  joinDetails?: JoinVisualizationDetails | null;
  parentIds: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  layer: number;
}

export interface QueryFlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  rowCount: number;
  pathData: string;
  sourcePoint: { x: number; y: number };
  targetPoint: { x: number; y: number };
}

export interface QueryFlowGraph {
  nodes: QueryFlowNode[];
  edges: QueryFlowEdge[];
  width: number;
  height: number;
  minX: number;
  minY: number;
}
