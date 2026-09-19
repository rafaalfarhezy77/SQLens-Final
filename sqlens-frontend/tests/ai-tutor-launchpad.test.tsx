import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AiTutorLaunchpad } from "@/components/ai-tutor/ai-tutor-launchpad";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("AiTutorLaunchpad", () => {
  it("renders the 3-step guide and starter scenario recommendations", () => {
    render(<AiTutorLaunchpad />);

    // Checks for 3-step workflow guide
    expect(screen.getByText("Cara Kerja Bimbingan AI Tutor")).toBeInTheDocument();
    expect(screen.getByText("LANGKAH 01")).toBeInTheDocument();
    expect(screen.getByText("LANGKAH 02")).toBeInTheDocument();
    expect(screen.getByText("LANGKAH 03")).toBeInTheDocument();

    // Checks for starter scenarios
    expect(
      screen.getByText("Urutan Logika Eksekusi Query"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Mekanisme Pasangan INNER JOIN"),
    ).toBeInTheDocument();
  });

  it("submits a custom question when typed and submitted", () => {
    mockPush.mockClear();
    render(<AiTutorLaunchpad />);

    const input = screen.getByLabelText("Ketik pertanyaan SQL ke AI Tutor");
    fireEvent.change(input, {
      target: { value: "Mengapa COUNT(*) menghasilkan 0 saat tabel kosong?" },
    });

    const submitBtn = screen.getByRole("button", { name: /TANYA SEKARANG/i });
    fireEvent.click(submitBtn);

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining(
        "prompt=Mengapa+COUNT%28*%29+menghasilkan+0+saat+tabel+kosong%3F",
      ),
    );
  });

  it("submits both custom question and attached SQL query", () => {
    mockPush.mockClear();
    render(<AiTutorLaunchpad />);

    const questionInput = screen.getByLabelText("Ketik pertanyaan SQL ke AI Tutor");
    fireEvent.change(questionInput, {
      target: { value: "Mengapa nilai Citra tidak muncul?" },
    });

    const sqlInput = screen.getByLabelText("Tempelkan query SQL yang ingin dianalisis");
    fireEvent.change(sqlInput, {
      target: { value: "SELECT * FROM students WHERE score >= 80;" },
    });

    const submitBtn = screen.getByRole("button", { name: /TANYA SEKARANG/i });
    fireEvent.click(submitBtn);

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("q=SELECT+*+FROM+students+WHERE+score+%3E%3D+80%3B"),
    );
  });
});
