import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(),
}));

import { SqlEditor } from "@/components/playground/sql-editor";

describe("SqlEditor", () => {
  beforeEach(() => {
    push.mockReset();
  });

  it("announces validation errors and associates them with the editor", async () => {
    const user = userEvent.setup();
    render(<SqlEditor initialQuery="SELECT * FROM students;" />);

    const editor = screen.getByLabelText("Editor Kode SQL");
    await user.clear(editor);
    await user.click(screen.getByRole("button", { name: "Jalankan Query" }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(editor).toHaveAttribute("aria-invalid", "true");
    expect(editor).toHaveAttribute("aria-describedby", "sql-query-error");
    expect(push).not.toHaveBeenCalled();
  });

  it("uses a preset and sends a valid query through Next navigation", async () => {
    const user = userEvent.setup();
    render(<SqlEditor initialQuery="SELECT * FROM students;" />);

    await user.click(screen.getByRole("button", { name: "Nilai di Atas 80" }));
    await user.click(screen.getByRole("button", { name: "Jalankan Query" }));

    expect(push).toHaveBeenCalledWith(
      "/dashboard/playground?q=SELECT+*+FROM+scores+WHERE+score+%3E%3D+80%3B",
    );
  });

  it("resets the editor through the canonical playground route", async () => {
    const user = userEvent.setup();
    render(<SqlEditor initialQuery="SELECT * FROM students;" />);

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(push).toHaveBeenCalledWith("/dashboard/playground");
  });
});
