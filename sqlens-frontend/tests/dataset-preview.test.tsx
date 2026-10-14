import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { DatasetPreview } from "@/components/playground/dataset-preview";
import type { EducationalDataset } from "@/lib/api/contracts/datasets";
import type { CustomDatasetInfo } from "@/lib/api/contracts/custom-dataset";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

const mockEducationalDataset: EducationalDataset = {
  tables: [
    {
      name: "students",
      columns: ["id", "name", "major"],
      rows: [{ id: 1, name: "Andi Pratama", major: "Informatika" }],
      relationship: "students.id adalah primary key.",
    },
  ],
};

const mockCustomDataset: CustomDatasetInfo = {
  has_custom_dataset: true,
  tables: [
    {
      name: "produk",
      columns: ["id", "nama_produk", "harga"],
      rows: [{ id: 10, nama_produk: "Laptop", harga: 12000000 }],
      relationship: "Tabel kustom produk dari database pengguna.",
    },
  ],
};

describe("DatasetPreview Component", () => {
  it("renders educational dataset by default when no custom dataset exists", () => {
    render(
      <DatasetPreview
        educationalDataset={mockEducationalDataset}
        initialCustomDataset={{ has_custom_dataset: false, tables: [] }}
      />,
    );

    expect(screen.getByText("DATASET SANDBOX")).toBeDefined();
    expect(screen.getByText(/TABEL:\s+students/i)).toBeDefined();
    expect(screen.getByText("Andi Pratama")).toBeDefined();
  });

  it("switches between educational and custom dataset tabs", () => {
    render(
      <DatasetPreview
        educationalDataset={mockEducationalDataset}
        initialCustomDataset={mockCustomDataset}
      />,
    );

    // Initial view should be custom because has_custom_dataset is true
    expect(screen.getByText(/TABEL:\s+produk/i)).toBeDefined();
    expect(screen.getByText("Laptop")).toBeDefined();

    // Click Bawaan (Edukasi) tab
    const eduTab = screen.getByRole("button", { name: /Bawaan \(Edukasi\)/i });
    fireEvent.click(eduTab);

    // Now educational tables are shown
    expect(screen.getByText(/TABEL:\s+students/i)).toBeDefined();
    expect(screen.getByText("Andi Pratama")).toBeDefined();
  });

  it("renders empty state when custom dataset tab is selected without data", () => {
    render(
      <DatasetPreview
        educationalDataset={mockEducationalDataset}
        initialCustomDataset={{ has_custom_dataset: false, tables: [] }}
      />,
    );

    // Click Dataset Saya tab
    const customTab = screen.getByRole("button", { name: /Dataset Saya/i });
    fireEvent.click(customTab);

    expect(screen.getByText("Belum Ada Database Kustom")).toBeDefined();
    expect(screen.getByText("Unggah Database Sekarang")).toBeDefined();
  });
});
