import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { CaseStudySelector } from "@/components/playground/case-study-selector";
import type { StudyCaseSummary } from "@/lib/api/contracts/study-cases";
import type { SharedDataset } from "@/lib/api/contracts/shared-datasets";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

const mockStudyCases: StudyCaseSummary[] = [
  {
    id: "academic",
    title: "Sistem Akademik Kampus",
    category: "Pendidikan",
    difficulty: "Dasar",
    description: "Database akademik",
    tableNames: ["students", "scores"],
    sampleQueries: [],
    challengesCount: 2,
  },
  {
    id: "ecommerce",
    title: "E-Commerce & Retail",
    category: "Bisnis",
    difficulty: "Menengah",
    description: "Database transaksi",
    tableNames: ["customers", "orders"],
    sampleQueries: [],
    challengesCount: 3,
  },
];

const mockSharedDatasets: SharedDataset[] = [
  {
    id: "sh-1",
    title: "Tugas Praktikum 3",
    description: "Dataset dosen",
    schemaName: "shared_123",
    tableNames: ["tiket"],
    createdBy: "dos-1",
    createdByName: "Dosen Pengampu",
    isActive: true,
    createdAt: "2026-02-01T10:00:00Z",
  },
];

describe("CaseStudySelector Component", () => {
  it("renders study case buttons and shared dataset button", () => {
    render(
      <CaseStudySelector
        studyCases={mockStudyCases}
        sharedDatasets={mockSharedDatasets}
        activeCaseId="academic"
      />,
    );

    expect(screen.getByText("Sistem Akademik Kampus")).toBeDefined();
    expect(screen.getByText("E-Commerce & Retail")).toBeDefined();
    expect(screen.getByText("Tugas Praktikum 3")).toBeDefined();
  });

  it("navigates with case parameter when clicking a study case", () => {
    render(
      <CaseStudySelector
        studyCases={mockStudyCases}
        sharedDatasets={mockSharedDatasets}
        activeCaseId="academic"
      />,
    );

    const ecommerceBtn = screen.getByText("E-Commerce & Retail");
    fireEvent.click(ecommerceBtn);

    expect(pushMock).toHaveBeenCalledWith("/dashboard/playground?case=ecommerce");
  });

  it("navigates with shared parameter when clicking a lecturer dataset", () => {
    render(
      <CaseStudySelector
        studyCases={mockStudyCases}
        sharedDatasets={mockSharedDatasets}
        activeCaseId="academic"
      />,
    );

    const sharedBtn = screen.getByText("Tugas Praktikum 3");
    fireEvent.click(sharedBtn);

    expect(pushMock).toHaveBeenCalledWith("/dashboard/playground?shared=sh-1");
  });
});
