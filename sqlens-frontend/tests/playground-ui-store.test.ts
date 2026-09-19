import { beforeEach, describe, expect, it } from "vitest";

import { usePlaygroundUiStore } from "@/lib/stores/playground-ui-store";

describe("playground UI store", () => {
  beforeEach(() => {
    usePlaygroundUiStore.setState({ activeVisualizationStepId: null });
  });

  it("stores only the selected visualization identifier", () => {
    usePlaygroundUiStore.getState().setActiveVisualizationStepId(3);
    expect(usePlaygroundUiStore.getState().activeVisualizationStepId).toBe(3);

    usePlaygroundUiStore.getState().setActiveVisualizationStepId(null);
    expect(usePlaygroundUiStore.getState().activeVisualizationStepId).toBeNull();
  });
});
