import type { CacheRecord } from "./types";
const baseUrl = import.meta.env.VITE_CACHE_API_URL ?? "";
export async function listRecords(ownerId: string): Promise<CacheRecord[]> {
  const response = await fetch(`${baseUrl}/records?limit=100`, { headers: { "x-owner-id": ownerId } });
  if (!response.ok) throw new Error("Unable to load genealogy records");
  return (await response.json() as { records: CacheRecord[] }).records;
}
