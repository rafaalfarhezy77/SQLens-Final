import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { CustomDatasetModal } from "@/components/playground/custom-dataset-modal";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

describe("CustomDatasetModal Component", () => {
  it("does not render when isOpen is false", () => {
    const { container } = render(
      <CustomDatasetModal isOpen={false} onClose={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders modal and switches between CSV and SQL tabs", () => {
    render(<CustomDatasetModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText("UNGGAH DATABASE PENGGUNA")).toBeDefined();
    expect(screen.getByText("Multi-File CSV (Rekomendasi)")).toBeDefined();
    expect(screen.getByText("Skrip SQL (.sql)")).toBeDefined();

    // Click SQL tab
    const sqlTab = screen.getByRole("button", { name: /Skrip SQL/i });
    fireEvent.click(sqlTab);

    expect(
      screen.getByPlaceholderText(/CREATE TABLE produk/i),
    ).toBeDefined();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(<CustomDatasetModal isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByRole("button", { name: /Tutup modal/i });
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledOnce();
  });
});
