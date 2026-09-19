import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MaterialManager } from "@/components/lecturer/material-manager";

describe("MaterialManager", () => {
  it("shows a validation error and labels local drafts honestly", async () => {
    const user = userEvent.setup();
    render(<MaterialManager initialMaterials={[]} />);
    await user.click(screen.getByRole("button", { name: /simpan draft/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/minimal tiga/i);
    await user.type(screen.getByLabelText(/judul/i), "JOIN");
    await user.click(screen.getByRole("button", { name: /simpan draft/i }));
    expect(screen.getByRole("status")).toHaveTextContent(/belum dipersist/i);
    expect(screen.getByText("JOIN")).toBeInTheDocument();
  });
});
