import { afterEach, describe, expect, it, vi } from "vitest";
import { listRecords } from "./api";
describe("cache API", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("returns records from a successful response", async () => { const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ records: [{ pk: "1" }] }) }); vi.stubGlobal("fetch", fetch); await expect(listRecords("user")).resolves.toEqual([{ pk: "1" }]); expect(fetch).toHaveBeenCalledWith("/records?limit=100", { headers: { "x-owner-id": "user" } }); });
  it("throws when the service rejects a request", async () => { vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false })); await expect(listRecords("user")).rejects.toThrow("Unable to load genealogy records"); });
});
