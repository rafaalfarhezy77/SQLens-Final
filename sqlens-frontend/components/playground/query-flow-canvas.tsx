"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type MouseEvent,
  type WheelEvent,
} from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Database,
  Layers,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Table,
  Cpu,
} from "lucide-react";
import type {
  QueryFlowGraph,
  QueryFlowNode,
} from "@/lib/playground/query-graph-types";

interface QueryFlowCanvasProps {
  graph: QueryFlowGraph;
  activeStepNumber: number | null;
  selectedNodeId: string | null;
  onSelectNode: (node: QueryFlowNode) => void;
}

export function QueryFlowCanvas({
  graph,
  activeStepNumber,
  selectedNodeId,
  onSelectNode,
}: QueryFlowCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan & Zoom transform state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Calculate Fit-to-Screen
  const fitToScreen = useCallback(() => {
    if (!containerRef.current || graph.nodes.length === 0) return;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const scaleX = (containerWidth - 60) / graph.width;
    const scaleY = (containerHeight - 60) / graph.height;
    const newZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.5), 1.1);

    const scaledWidth = graph.width * newZoom;
    const scaledHeight = graph.height * newZoom;

    setZoom(newZoom);
    setPan({
      x: (containerWidth - scaledWidth) / 2,
      y: (containerHeight - scaledHeight) / 2,
    });
  }, [graph.width, graph.height, graph.nodes.length]);

  // Initial fit-to-screen on mount or graph change
  useEffect(() => {
    fitToScreen();
  }, [fitToScreen]);

  // Mouse pan handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    // Only drag on canvas background
    if ((e.target as HTMLElement).closest(".query-node-element")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.4), 1.6));
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 1.6));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.4));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getNodeColor = (type: QueryFlowNode["type"]) => {
    switch (type) {
      case "TABLE":
        return {
          bg: "#E0F2FE",
          border: "#0284C7",
          badgeBg: "#0284C7",
          text: "#0369A1",
        };
      case "JOIN":
        return {
          bg: "#EDE9FE",
          border: "#7C3AED",
          badgeBg: "#7C3AED",
          text: "#6D28D9",
        };
      case "WHERE":
      case "HAVING":
        return {
          bg: "#FEF3C7",
          border: "#D97706",
          badgeBg: "#D97706",
          text: "#B45309",
        };
      case "GROUP_BY":
        return {
          bg: "#DCFCE7",
          border: "#16A34A",
          badgeBg: "#16A34A",
          text: "#15803D",
        };
      case "ORDER_BY":
      case "LIMIT":
        return {
          bg: "#F1F5F9",
          border: "#475569",
          badgeBg: "#475569",
          text: "#334155",
        };
      case "RESULT":
        return {
          bg: "#ECFDF5",
          border: "#059669",
          badgeBg: "#059669",
          text: "#047857",
        };
      default:
        return {
          bg: "#FFF3A3",
          border: "#CA8A04",
          badgeBg: "#CA8A04",
          text: "#A16207",
        };
    }
  };

  const getNodeIcon = (type: QueryFlowNode["type"]) => {
    switch (type) {
      case "TABLE":
        return <Database size={13} />;
      case "JOIN":
        return <Layers size={13} />;
      case "WHERE":
      case "HAVING":
        return <Filter size={13} />;
      case "GROUP_BY":
        return <Cpu size={13} />;
      case "ORDER_BY":
        return <ArrowUpDown size={13} />;
      case "RESULT":
        return <CheckCircle2 size={13} />;
      default:
        return <Table size={13} />;
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      role="application"
      aria-label="Kanvas Topologi Graf Pemrosesan Kueri SQL"
      className="relative w-full h-[520px] bg-[#F7F7F2] border-2 border-[#111111] overflow-hidden select-none cursor-grab active:cursor-grabbing shadow-[inset_0_0_12px_rgba(0,0,0,0.06)]"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(17, 17, 17, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(17, 17, 17, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: "28px 28px",
      }}
    >
      {/* Topology Header Badge Overlay */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
        <span className="neo-badge neo-badge-dark text-[11px] py-1 px-2.5 shadow-[2px_2px_0px_0px_#FFD600]">
          PACKET TRACER TOPOLOGY
        </span>
        <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 border border-[#111111] text-[#111111]">
          Logical Relational Flow
        </span>
      </div>

      {/* Floating Canvas Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white border-2 border-[#111111] p-1 shadow-[3px_3px_0px_0px_#111111]">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Perbesar (Zoom In)"
          className="w-7 h-7 flex items-center justify-center hover:bg-[#FFF3A3] border border-transparent hover:border-[#111111] transition-all cursor-pointer"
        >
          <ZoomIn size={15} />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Perkecil (Zoom Out)"
          className="w-7 h-7 flex items-center justify-center hover:bg-[#FFF3A3] border border-transparent hover:border-[#111111] transition-all cursor-pointer"
        >
          <ZoomOut size={15} />
        </button>
        <button
          type="button"
          onClick={fitToScreen}
          title="Paskan ke Layar (Fit to Screen)"
          className="w-7 h-7 flex items-center justify-center hover:bg-[#FFD600] border border-transparent hover:border-[#111111] transition-all cursor-pointer"
        >
          <Maximize2 size={15} />
        </button>
        <button
          type="button"
          onClick={handleResetZoom}
          title="Atur Ulang Tampilan (100%)"
          className="w-7 h-7 flex items-center justify-center hover:bg-[#F7F7F2] border border-transparent hover:border-[#111111] transition-all cursor-pointer font-mono text-[10px] font-bold"
        >
          <RotateCcw size={13} />
        </button>
        <span className="px-1.5 font-mono text-[10px] font-bold text-black/60 border-l border-black/20">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Interactive Transform Viewport */}
      <div
        className="w-full h-full transform-gpu transition-transform duration-75 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* SVG Connectors & Flow Pulse Animations */}
        <svg
          width={graph.width}
          height={graph.height}
          className="absolute top-0 left-0 pointer-events-none overflow-visible"
        >
          <title>Koneksi Alur Data Relasional</title>
          <defs>
            {/* Arrow Marker */}
            <marker
              id="graph-arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#111111" />
            </marker>

            <marker
              id="graph-arrowhead-active"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 8 3, 0 6"
                fill="#FFD600"
                stroke="#111111"
                strokeWidth="1"
              />
            </marker>
          </defs>

          {/* Render All Edges */}
          {graph.edges.map((edge) => {
            const isTargetActive =
              activeStepNumber !== null &&
              graph.nodes.find((n) => n.id === edge.target)?.stepNumber ===
                activeStepNumber;

            const isConnectedToSelected =
              selectedNodeId !== null &&
              (edge.source === selectedNodeId ||
                edge.target === selectedNodeId);

            return (
              <g key={edge.id} className="query-edge-group">
                {/* Background Shadow Line */}
                <path
                  d={edge.pathData}
                  fill="none"
                  stroke="#111111"
                  strokeWidth={isConnectedToSelected ? 4 : 2.5}
                  strokeLinecap="round"
                  markerEnd={
                    isTargetActive
                      ? "url(#graph-arrowhead-active)"
                      : "url(#graph-arrowhead)"
                  }
                />

                {/* Animated Flow Pulse (Cisco Packet Tracer Inspired) */}
                <path
                  d={edge.pathData}
                  fill="none"
                  stroke={isTargetActive ? "#FFD600" : "#00D084"}
                  strokeWidth="2.5"
                  strokeDasharray="8, 12"
                  className="animate-[dash_1.5s_linear_infinite]"
                  opacity={isTargetActive || isConnectedToSelected ? 0.95 : 0.4}
                />

                {/* Cardinality Badge on Edge Center */}
                {edge.rowCount > 0 && (
                  <g
                    transform={`translate(${
                      (edge.sourcePoint.x + edge.targetPoint.x) / 2
                    }, ${(edge.sourcePoint.y + edge.targetPoint.y) / 2})`}
                  >
                    <rect
                      x="-34"
                      y="-10"
                      width="68"
                      height="20"
                      rx="3"
                      fill="#FFFFFF"
                      stroke="#111111"
                      strokeWidth="1.5"
                      className="shadow-[1px_1px_0px_0px_#111111]"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fontFamily="monospace"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#111111"
                    >
                      {edge.rowCount} rows
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Render HTML Node Cards */}
        {graph.nodes.map((node) => {
          const isActive =
            activeStepNumber !== null && node.stepNumber === activeStepNumber;
          const isSelected = selectedNodeId === node.id;
          const color = getNodeColor(node.type);

          return (
            <button
              type="button"
              key={node.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(node);
              }}
              aria-pressed={isSelected}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: `${node.width}px`,
                height: `${node.height}px`,
              }}
              className={`query-node-element absolute text-left border-2 border-[#111111] bg-white cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                isActive
                  ? "ring-3 ring-[#111111] ring-offset-2 bg-yellow-50 shadow-[6px_6px_0px_0px_#111111] -translate-x-1 -translate-y-1"
                  : isSelected
                    ? "ring-2 ring-[#0284C7] shadow-[5px_5px_0px_0px_#0284C7] -translate-x-0.5 -translate-y-0.5"
                    : "shadow-[3px_3px_0px_0px_#111111] hover:shadow-[5px_5px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5"
              }`}
            >
              {/* Node Card Header */}
              <div
                style={{ backgroundColor: color.bg }}
                className="px-2.5 py-1.5 border-b border-[#111111] flex items-center justify-between gap-1 select-none"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    style={{ backgroundColor: color.badgeBg }}
                    className="w-5 h-5 flex items-center justify-center text-white border border-[#111111] shrink-0"
                  >
                    {getNodeIcon(node.type)}
                  </span>
                  <span className="font-mono text-[10px] font-black uppercase text-[#111111] truncate tracking-wider">
                    {node.type}
                  </span>
                </div>

                {/* Status LED / Step Pill */}
                <div className="flex items-center gap-1">
                  {isActive && (
                    <span
                      title="Node Sedang Memproses"
                      className="w-2.5 h-2.5 rounded-full bg-[#00D084] border border-[#111111] animate-ping"
                    />
                  )}
                  <span className="font-mono text-[9px] font-bold bg-white text-[#111111] px-1 py-0.2 border border-[#111111]">
                    0{node.stepNumber}
                  </span>
                </div>
              </div>

              {/* Node Operation Body */}
              <div className="px-2.5 py-1.5 flex flex-col justify-center min-w-0 font-mono">
                <span className="text-[11px] font-black text-[#111111] truncate">
                  {node.operation}
                </span>
                <span className="text-[9px] text-black/60 truncate font-medium">
                  {node.subtitle || node.label}
                </span>
              </div>

              {/* Node Cardinality Bar */}
              <div className="px-2 py-1 bg-[#F7F7F2] border-t border-[#111111] flex items-center justify-between font-mono text-[10px] select-none">
                <span className="text-black/60 font-bold">
                  {node.type === "TABLE"
                    ? "SUMBER"
                    : `${node.inputRowCount} in`}
                </span>
                <span className="font-black bg-[#FFD600] px-1.5 py-0.2 border border-[#111111] shadow-[1px_1px_0px_0px_#111111]">
                  {node.outputRowCount} rows
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
