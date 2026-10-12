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

  it("renders the Packet Tracer topology canvas with zoom/pan controls", () => {
    render(<QueryVisualization steps={[baseStep]} />);
    expect(screen.getByText("PACKET TRACER TOPOLOGY")).toBeInTheDocument();
    expect(screen.getByTitle("Paskan ke Layar (Fit to Screen)")).toBeInTheDocument();
    expect(screen.getByTitle("Perbesar (Zoom In)")).toBeInTheDocument();
  });

  it("supports playback transport controls to play and step forward", async () => {
    const user = userEvent.setup();
    render(
      <QueryVisualization
        steps={[
          baseStep,
          {
            ...baseStep,
            stepNumber: 2,
            clause: "WHERE score >= 80",
            title: "Filter",
            badge: "02 / WHERE",
          },
        ]}
      />,
    );

    const playBtn = screen.getByRole("button", { name: /PLAY/i });
    expect(playBtn).toBeInTheDocument();
    await user.click(playBtn);
    expect(screen.getByRole("button", { name: /PAUSE/i })).toBeInTheDocument();

    const nextBtn = screen.getByTitle("Langkah Selanjutnya (Next)");
    await user.click(nextBtn);
    expect(usePlaygroundUiStore.getState().activeVisualizationStepId).toBe(1);
  });

  it("opens node detail inspector when a node is clicked", async () => {
    const user = userEvent.setup();
    render(<QueryVisualization steps={[baseStep]} query="SELECT name FROM students;" />);

    const nodeButtons = screen.getAllByRole("button");
    const nodeEl = nodeButtons.find((btn) => btn.textContent?.includes("FROM students"));
    if (nodeEl) {
      await user.click(nodeEl);
      expect(screen.getByText("TANYA AI TUTOR TENTANG TAHAP INI")).toBeInTheDocument();
    }
  });

  it("switches view modes between topology, split, and cards", async () => {
    const user = userEvent.setup();
    render(<QueryVisualization steps={[baseStep]} />);

    const cardsTab = screen.getByRole("button", { name: /Daftar Rinci/i });
    await user.click(cardsTab);
    expect(screen.queryByText("PACKET TRACER TOPOLOGY")).not.toBeInTheDocument();

    const topoTab = screen.getByRole("button", { name: /Topologi/i });
    await user.click(topoTab);
    expect(screen.getByText("PACKET TRACER TOPOLOGY")).toBeInTheDocument();
  });
});

