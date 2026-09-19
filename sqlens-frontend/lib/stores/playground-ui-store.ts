"use client";

import { create } from "zustand";

export interface PlaygroundUiState {
  /**
   * The currently highlighted query-processing step. It is intentionally an
   * identifier only: the server remains the owner of step/domain data.
   */
  activeVisualizationStepId: number | null;
  setActiveVisualizationStepId: (stepId: number | null) => void;
}

/**
 * Ephemeral playground UI state shared by interactive client leaves.
 * Routing, editor drafts, query results, and remote data do not belong here.
 */
export const usePlaygroundUiStore = create<PlaygroundUiState>((set) => ({
  activeVisualizationStepId: null,
  setActiveVisualizationStepId: (stepId) =>
    set({ activeVisualizationStepId: stepId }),
}));
