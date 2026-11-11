import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { App } from "./App";
vi.mock("./api", () => ({ listRecords: vi.fn() }));
import { listRecords } from "./api";
describe("App", () => {
  it("renders cached records and filters them", async () => { vi.mocked(listRecords).mockResolvedValue([{ pk: "1", url: "https://archive.test/1", documentType: "Marriage", place: "Lyon", status: "parsed", parserVersion: "v1", updatedAt: "", fields: {} }]); render(<App />); await screen.findByText("Marriage"); expect(screen.getByText("Lyon")).toBeInTheDocument(); fireEvent.change(screen.getByLabelText("Filter records"), { target: { value: "Paris" } }); expect(screen.getByText("No cached record matches this filter.")).toBeInTheDocument(); });
  it("shows an error when loading fails", async () => { vi.mocked(listRecords).mockRejectedValue(new Error("Unable to load genealogy records")); render(<App />); await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Unable to load genealogy records")); });
});
