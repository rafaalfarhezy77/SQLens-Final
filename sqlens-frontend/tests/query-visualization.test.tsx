import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { QueryVisualization } from "@/components/playground/query-visualization";
import type { QueryStep } from "@/lib/playground/query-steps";
import { usePlaygroundUiStore } from "@/lib/stores/playground-ui-store";

const baseStep: QueryStep = {
  stepNumber: 1,
  clause: "FROM students",
  title: "Source",
  badge: "01 / FROM",
  description: "Load rows",
  explanation: "Rows are loaded.",
  rowsBeforeCount: 1,
  rowsAfterCount: 1,
  rowEvaluations: [
    {
      id: "row-1",
      data: { name: "Andi" },
      status: "source",
      statusText: "LOADED",
      reason: "Source row",
    },
    {
      id: "row-2",
      data: { name: "Budi" },
      status: "keep",
      statusText: "KEEP",
      reason: "Kept row",
    },
    {
      id: "row-3",
      data: { name: "Citra" },
      status: "filtered",
      statusText: "FILTERED",
      reason: "Filtered row",
    },
    {
      id: "row-4",
      data: { name: "Dian" },
      status: "joined",
      statusText: "MATCHED",
      reason: "Joined row",
    },
  ],
};

describe("QueryVisualization", () => {
  beforeEach(() => {
    usePlaygroundUiStore.setState({ activeVisualizationStepId: null });
  });

  it("renders JOIN details only for a step with JOIN metadata", () => {
    render(
      <QueryVisualization
        steps={[
          baseStep,
          {
            ...baseStep,
            stepNumber: 2,
            title: "Join",
            joinDetails: {
              leftTable: "students",
              rightTable: "scores",
              leftKey: "id",
              rightKey: "student_id",
              joinType: "INNER JOIN",
            },
          },
        ]}
      />,
    );

    expect(screen.getByText("INNER JOIN")).toBeInTheDocument();
    expect(screen.getByText("students.id")).toBeInTheDocument();
  });

  it("updates the selected visualization step through the UI control", async () => {
    const user = userEvent.setup();
    render(<QueryVisualization steps={[baseStep]} />);

    await user.click(screen.getByRole("button", { name: "01 FROM" }));
    expect(usePlaygroundUiStore.getState().activeVisualizationStepId).toBe(1);
  });
});
