"use client";

import { create } from "zustand";

export interface PlaygroundUiState {
  /**
   * The currently highlighted query-processing step. It is intentionally an
   * identifier only: the server remains the owner of step/domain data.
   */
  activeVisualizationStepId: number | null;
  setActiveVisualizationStepId: (stepId: number | null) => void;
  selectedNodeId: string | null;
  setSelectedNodeId: (nodeId: string | null) => void;
  playbackState: { isPlaying: boolean; speedMs: number };
  setPlaybackState: (
    state: Partial<{ isPlaying: boolean; speedMs: number }>,
  ) => void;
  visualizationViewMode: "graph" | "cards";
  setVisualizationViewMode: (mode: "graph" | "cards") => void;
}

/**
 * Ephemeral playground UI state shared by interactive client leaves.
 * Routing, editor drafts, query results, and remote data do not belong here.
 */
export const usePlaygroundUiStore = create<PlaygroundUiState>((set) => ({
  activeVisualizationStepId: null,
  setActiveVisualizationStepId: (stepId) =>
    set({ activeVisualizationStepId: stepId }),
  selectedNodeId: null,
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
  playbackState: { isPlaying: false, speedMs: 1600 },
  setPlaybackState: (patch) =>
    set((state) => ({ playbackState: { ...state.playbackState, ...patch } })),
  visualizationViewMode: "graph",
  setVisualizationViewMode: (mode) => set({ visualizationViewMode: mode }),
}));
