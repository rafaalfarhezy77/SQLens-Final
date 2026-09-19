import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { QueryHistorySkeleton } from "@/components/playground/query-history-skeleton";

describe("QueryHistorySkeleton", () => {
  it("announces the loading state to assistive technology", () => {
    render(<QueryHistorySkeleton />);

    expect(screen.getByRole("status")).toHaveTextContent("Memuat riwayat query");
  });
});
