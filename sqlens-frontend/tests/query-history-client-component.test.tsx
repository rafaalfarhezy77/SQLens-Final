import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  query: vi.fn(),
  remove: vi.fn(),
  clear: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));
vi.mock("@/lib/api/hooks/use-query-history-query", () => ({
  useQueryHistoryQuery: mocks.query,
}));
vi.mock("@/lib/api/hooks/use-query-history-mutations", () => ({
  useDeleteQueryHistoryMutation: mocks.remove,
  useClearQueryHistoryMutation: mocks.clear,
}));

import { QueryHistoryClient } from "@/components/playground/query-history-client";

const idleMutation = { error: null, isPending: false, mutate: vi.fn(), variables: undefined };

describe("QueryHistoryClient", () => {
  beforeEach(() => {
    mocks.push.mockReset();
    mocks.remove.mockReturnValue({ ...idleMutation, mutate: vi.fn() });
    mocks.clear.mockReturnValue({ ...idleMutation, mutate: vi.fn() });
  });

  it("renders the accessible loading state", () => {
    mocks.query.mockReturnValue({ isPending: true, isError: false, data: undefined });
    render(<QueryHistoryClient />);
    expect(screen.getByRole("status")).toHaveTextContent("Memuat riwayat query");
  });

  it("renders an empty state without fabricating history", () => {
    mocks.query.mockReturnValue({
      isPending: false,
      isError: false,
      data: { items: [] },
    });
    render(<QueryHistoryClient />);
    expect(screen.getByText("Belum ada query yang tercatat untuk sesi Anda.")).toBeVisible();
  });

  it("replays a populated item through the URL and invokes delete/clear mutations", async () => {
    const user = userEvent.setup();
    const remove = vi.fn();
    const clear = vi.fn();
    mocks.remove.mockReturnValue({ ...idleMutation, mutate: remove });
    mocks.clear.mockReturnValue({ ...idleMutation, mutate: clear });
    mocks.query.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        items: [
          {
            id: "history-1",
            query: "SELECT * FROM students;",
            status: "success",
            executedAt: "2026-09-18T09:30:00+07:00",
            rowCount: 4,
          },
        ],
      },
    });

    render(<QueryHistoryClient />);
    await user.click(screen.getByRole("button", { name: "Ulangi" }));
    await user.click(screen.getByRole("button", { name: "Hapus" }));
    await user.click(screen.getByRole("button", { name: "Hapus Semua" }));

    expect(mocks.push).toHaveBeenCalledWith(
      "/dashboard/playground?q=SELECT%20*%20FROM%20students%3B",
    );
    expect(remove).toHaveBeenCalledWith("history-1");
    expect(clear).toHaveBeenCalledWith();
  });

  it("presents a safe retryable error", async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    mocks.query.mockReturnValue({
      isPending: false,
      isError: true,
      error: new Error("private stack trace"),
      refetch,
    });
    render(<QueryHistoryClient />);

    expect(screen.getByRole("alert")).toHaveTextContent("Riwayat query tidak tersedia");
    await user.click(screen.getByRole("button", { name: "Coba Lagi" }));
    expect(refetch).toHaveBeenCalledWith();
  });
});
