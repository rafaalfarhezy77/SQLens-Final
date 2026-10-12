"use client";

import { useMemo, useState } from "react";
import { ArrowDown, Network, ListTree, Eye } from "lucide-react";
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
import { QueryFlowCanvas } from "./query-flow-canvas";
import { QueryFlowPlaybackBar } from "./query-flow-playback-bar";
import { QueryNodeDetailPanel } from "./query-node-detail-panel";
import { buildQueryFlowGraph } from "@/lib/playground/query-graph-builder";
import { usePlaygroundUiStore } from "@/lib/stores/playground-ui-store";
import type { QueryStep } from "@/lib/playground/query-steps";
import type { QueryFlowNode } from "@/lib/playground/query-graph-types";

export interface QueryVisualizationProps {
  steps: QueryStep[];
  query?: string;
}

export function QueryVisualization({ steps, query = "" }: QueryVisualizationProps) {
  const [viewMode, setViewMode] = useState<"graph" | "split" | "cards">("split");

  const activeStepId = usePlaygroundUiStore(
    (state) => state.activeVisualizationStepId,
  );
  const setActiveStepId = usePlaygroundUiStore(
    (state) => state.setActiveVisualizationStepId,
  );
  const selectedNodeId = usePlaygroundUiStore((state) => state.selectedNodeId);
  const setSelectedNodeId = usePlaygroundUiStore(
    (state) => state.setSelectedNodeId,
  );

  // Build DAG Graph model from steps
  const graph = useMemo(() => buildQueryFlowGraph(steps), [steps]);

  // Selected node for detail drawer
  const selectedNode: QueryFlowNode | null = useMemo(() => {
    if (!selectedNodeId) {
      if (activeStepId !== null) {
        return (
          graph.nodes.find((n) => n.stepNumber === activeStepId) || null
        );
      }
      return null;
    }
    return graph.nodes.find((n) => n.id === selectedNodeId) || null;
  }, [graph.nodes, selectedNodeId, activeStepId]);

  if (!steps || steps.length === 0) return null;

  const lastStepId = steps.at(-1)?.stepNumber;

  const handleSelectNode = (node: QueryFlowNode) => {
    setSelectedNodeId(node.id);
    setActiveStepId(node.stepNumber);
  };

  return (
    <Card
      variant="white"
      className="border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111]"
    >
      <CardHeader className="bg-[#FFF3A3] border-b-2 border-[#111111]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="dark">INTI FITUR SQLENS</Badge>
              <span className="font-mono text-xs font-bold bg-[#FFD600] px-2 py-0.5 border border-[#111111] text-[#111111]">
                SQL DATA FLOW GRAPH
              </span>
              <CardTitle className="text-base md:text-lg">
                Query-to-Visual Explanation
              </CardTitle>
            </div>
            <CardDescription className="text-black/80 font-medium text-xs sm:text-sm">
              Alur pemrosesan query relasional dari tabel sumber hingga hasil akhir.
            </CardDescription>
          </div>

          {/* View Mode Toggle Bar & Step Navigator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center bg-white border-2 border-[#111111] p-0.5 shadow-[2px_2px_0px_0px_#111111]">
              <button
                type="button"
                onClick={() => setViewMode("graph")}
                className={`px-2.5 py-1 text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "graph"
                    ? "bg-[#FFD600] text-[#111111]"
                    : "text-black/70 hover:bg-[#F7F7F2]"
                }`}
              >
                <Network size={13} />
                <span>Topologi</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`px-2.5 py-1 text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "split"
                    ? "bg-[#FFD600] text-[#111111]"
                    : "text-black/70 hover:bg-[#F7F7F2]"
                }`}
              >
                <Eye size={13} />
                <span>Keduanya</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`px-2.5 py-1 text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "cards"
                    ? "bg-[#FFD600] text-[#111111]"
                    : "text-black/70 hover:bg-[#F7F7F2]"
                }`}
              >
                <ListTree size={13} />
                <span>Daftar Rinci</span>
              </button>
            </div>

            <StepNavigator totalSteps={steps.length} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* GRAPH VIEW SECTION (Packet Tracer Topology Canvas) */}
        {(viewMode === "graph" || viewMode === "split") && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Canvas Area (full width or left col) */}
              <div
                className={
                  selectedNode
                    ? "lg:col-span-8 space-y-3"
                    : "lg:col-span-12 space-y-3"
                }
              >
                <QueryFlowCanvas
                  graph={graph}
                  activeStepNumber={activeStepId}
                  selectedNodeId={selectedNode?.id || null}
                  onSelectNode={handleSelectNode}
                />
                <QueryFlowPlaybackBar nodes={graph.nodes} />
              </div>

              {/* Side Detail Inspector Panel */}
              {selectedNode && (
                <div className="lg:col-span-4">
                  <QueryNodeDetailPanel
                    node={selectedNode}
                    onClose={() => setSelectedNodeId(null)}
                    rawQuery={query}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* DETAILED STEP CARDS SECTION */}
        {(viewMode === "cards" || viewMode === "split") && (
          <div className="space-y-6 pt-4 border-t-2 border-[#111111]/20">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs font-black uppercase tracking-wider text-black/70 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#FFD600] border border-[#111111] inline-block" />
                Rincian Evaluasi Setiap Langkah Internal Database
              </h3>
              <span className="text-[11px] font-mono text-black/50">
                {steps.length} Tahapan Dideteksi
              </span>
            </div>

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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
