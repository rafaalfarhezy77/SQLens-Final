import type { QueryStep } from "./query-steps";
import type {
  QueryFlowEdge,
  QueryFlowGraph,
  QueryFlowNode,
  QueryFlowNodeType,
} from "./query-graph-types";

const NODE_WIDTH = 230;
const NODE_HEIGHT = 86;
const HORIZONTAL_GAP = 60;
const VERTICAL_GAP = 90;

function inferNodeType(clause: string, badge: string): QueryFlowNodeType {
  const upper = `${clause} ${badge}`.toUpperCase();
  if (upper.includes("JOIN")) return "JOIN";
  if (upper.includes("WHERE") || upper.includes("FILTER")) return "WHERE";
  if (upper.includes("GROUP BY") || upper.includes("GROUP")) return "GROUP_BY";
  if (upper.includes("HAVING")) return "HAVING";
  if (upper.includes("ORDER BY") || upper.includes("SORT")) return "ORDER_BY";
  if (upper.includes("DISTINCT")) return "DISTINCT";
  if (upper.includes("LIMIT")) return "LIMIT";
  if (upper.includes("UNION")) return "UNION";
  if (upper.includes("SELECT") || upper.includes("PROJECTION")) return "SELECT";
  if (upper.includes("FROM") || upper.includes("TABLE")) return "TABLE";
  return "SELECT";
}

export function buildQueryFlowGraph(steps: QueryStep[]): QueryFlowGraph {
  if (!steps || steps.length === 0) {
    return { nodes: [], edges: [], width: 600, height: 400, minX: 0, minY: 0 };
  }

  const rawNodes: Array<{
    id: string;
    stepNumber: number;
    type: QueryFlowNodeType;
    label: string;
    subtitle?: string;
    operation: string;
    inputRowCount: number;
    outputRowCount: number;
    evaluations: QueryStep["rowEvaluations"];
    joinDetails?: QueryStep["joinDetails"];
    parentIds: string[];
    layer: number;
  }> = [];

  // Check if query has a JOIN to create branch table source nodes
  const joinStep = steps.find((s) => s.joinDetails);
  const firstStep = steps[0];
  if (!firstStep) {
    return { nodes: [], edges: [], width: 600, height: 400, minX: 0, minY: 0 };
  }

  let currentParentIds: string[] = [];
  let currentLayer = 0;

  if (joinStep?.joinDetails && firstStep.clause.toUpperCase().includes("FROM")) {
    const leftTable = joinStep.joinDetails.leftTable;
    const rightTable = joinStep.joinDetails.rightTable;

    const leftNodeId = `node-table-${leftTable.toLowerCase()}`;
    const rightNodeId = `node-table-${rightTable.toLowerCase()}`;

    // Source 1 (Left Table)
    rawNodes.push({
      id: leftNodeId,
      stepNumber: 1,
      type: "TABLE",
      label: `TABLE: ${leftTable}`,
      subtitle: "Relasi Sumber Primer",
      operation: `FROM ${leftTable}`,
      inputRowCount: 0,
      outputRowCount: firstStep.rowsAfterCount > 0 ? Math.ceil(firstStep.rowsAfterCount / 2) : 4,
      evaluations: firstStep.rowEvaluations,
      parentIds: [],
      layer: 0,
    });

    // Source 2 (Right Table)
    rawNodes.push({
      id: rightNodeId,
      stepNumber: 1,
      type: "TABLE",
      label: `TABLE: ${rightTable}`,
      subtitle: "Relasi Sumber Sekunder",
      operation: `JOIN ${rightTable}`,
      inputRowCount: 0,
      outputRowCount: firstStep.rowsAfterCount > 0 ? Math.floor(firstStep.rowsAfterCount / 2) : 4,
      evaluations: firstStep.rowEvaluations,
      parentIds: [],
      layer: 0,
    });

    currentParentIds = [leftNodeId, rightNodeId];
    currentLayer = 1;

    // Process remaining steps starting from JOIN
    steps.slice(1).forEach((step) => {
      const type = inferNodeType(step.clause, step.badge);
      const nodeId = step.nodeId || `node-step-${step.stepNumber}`;

      rawNodes.push({
        id: nodeId,
        stepNumber: step.stepNumber,
        type,
        label: `${type}: ${step.title}`,
        subtitle: step.clause,
        operation: step.clause,
        inputRowCount: step.rowsBeforeCount,
        outputRowCount: step.rowsAfterCount,
        evaluations: step.rowEvaluations,
        joinDetails: step.joinDetails,
        parentIds: currentParentIds,
        layer: currentLayer,
      });

      currentParentIds = [nodeId];
      currentLayer++;
    });
  } else {
    // Linear or single-table flow
    steps.forEach((step) => {
      const type = inferNodeType(step.clause, step.badge);
      const nodeId = step.nodeId || `node-step-${step.stepNumber}`;

      rawNodes.push({
        id: nodeId,
        stepNumber: step.stepNumber,
        type,
        label: `${type}: ${step.title}`,
        subtitle: step.clause,
        operation: step.clause,
        inputRowCount: step.rowsBeforeCount,
        outputRowCount: step.rowsAfterCount,
        evaluations: step.rowEvaluations,
        joinDetails: step.joinDetails,
        parentIds: currentParentIds,
        layer: currentLayer,
      });

      currentParentIds = [nodeId];
      currentLayer++;
    });
  }

  // Always append terminal RESULT node
  const lastStep = steps.at(-1);
  const finalRowCount = lastStep ? lastStep.rowsAfterCount : 0;
  const resultNodeId = "node-terminal-result";

  rawNodes.push({
    id: resultNodeId,
    stepNumber: steps.length + 1,
    type: "RESULT",
    label: "RESULT: Hasil Akhir",
    subtitle: `${finalRowCount} baris data dihasilkan`,
    operation: "RESULT SET",
    inputRowCount: finalRowCount,
    outputRowCount: finalRowCount,
    evaluations: lastStep ? lastStep.rowEvaluations : [],
    parentIds: currentParentIds,
    layer: currentLayer,
  });

  // Calculate layout coordinates by grouping nodes into layers
  const layerMap = new Map<number, typeof rawNodes>();
  for (const n of rawNodes) {
    const list = layerMap.get(n.layer) || [];
    list.push(n);
    layerMap.set(n.layer, list);
  }

  const maxNodesInAnyLayer = Math.max(
    ...Array.from(layerMap.values()).map((l) => l.length),
    1,
  );
  const totalLayers = layerMap.size;

  const canvasWidth = Math.max(
    800,
    maxNodesInAnyLayer * (NODE_WIDTH + HORIZONTAL_GAP) + 200,
  );
  const canvasHeight = Math.max(
    500,
    totalLayers * (NODE_HEIGHT + VERTICAL_GAP) + 160,
  );
  const centerX = canvasWidth / 2;

  const nodes: QueryFlowNode[] = [];
  const nodeMap = new Map<string, QueryFlowNode>();

  Array.from(layerMap.entries()).forEach(([layerIndex, layerNodes]) => {
    const layerCount = layerNodes.length;
    const layerTotalWidth =
      layerCount * NODE_WIDTH + (layerCount - 1) * HORIZONTAL_GAP;
    const startX = centerX - layerTotalWidth / 2;
    const y = 60 + layerIndex * (NODE_HEIGHT + VERTICAL_GAP);

    layerNodes.forEach((rn, idxInLayer) => {
      const x = startX + idxInLayer * (NODE_WIDTH + HORIZONTAL_GAP);
      const rowDiff = rn.outputRowCount - rn.inputRowCount;

      const node: QueryFlowNode = {
        id: rn.id,
        stepNumber: rn.stepNumber,
        type: rn.type,
        label: rn.label,
        subtitle: rn.subtitle,
        operation: rn.operation,
        inputRowCount: rn.inputRowCount,
        outputRowCount: rn.outputRowCount,
        rowDiff,
        evaluations: rn.evaluations,
        joinDetails: rn.joinDetails,
        parentIds: rn.parentIds,
        x,
        y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        layer: rn.layer,
      };

      nodes.push(node);
      nodeMap.set(node.id, node);
    });
  });

  // Build edges
  const edges: QueryFlowEdge[] = [];
  for (const node of nodes) {
    for (const parentId of node.parentIds) {
      const parent = nodeMap.get(parentId);
      if (!parent) continue;

      const sourcePoint = {
        x: parent.x + parent.width / 2,
        y: parent.y + parent.height,
      };
      const targetPoint = {
        x: node.x + node.width / 2,
        y: node.y,
      };

      // Smooth vertical cubic bezier curve
      const dy = (targetPoint.y - sourcePoint.y) * 0.55;
      const pathData = `M ${sourcePoint.x} ${sourcePoint.y} C ${sourcePoint.x} ${
        sourcePoint.y + dy
      }, ${targetPoint.x} ${targetPoint.y - dy}, ${targetPoint.x} ${targetPoint.y}`;

      edges.push({
        id: `edge-${parent.id}->${node.id}`,
        source: parent.id,
        target: node.id,
        rowCount: parent.outputRowCount,
        label: `${parent.outputRowCount} rows`,
        pathData,
        sourcePoint,
        targetPoint,
      });
    }
  }

  return {
    nodes,
    edges,
    width: canvasWidth,
    height: canvasHeight,
    minX: 0,
    minY: 0,
  };
}
