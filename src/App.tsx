import { useEffect, useState } from "react";
import { listRecords } from "./api";
import type { CacheRecord } from "./types";

export function App() {
  const [records, setRecords] = useState<CacheRecord[]>([]); const [query, setQuery] = useState(""); const [error, setError] = useState("");
  useEffect(() => { listRecords("demo-user").then(setRecords).catch(e => setError(e.message)); }, []);
  const shown = records.filter(r => `${r.documentType} ${r.place} ${r.url}`.toLowerCase().includes(query.toLowerCase()));
  return <main><header><p className="eyebrow">GENEALOGY CACHE</p><h1>Document extraction history</h1><p>Reuse verified archival parsing instead of reading the same record twice.</p></header><section className="toolbar"><input aria-label="Filter records" placeholder="Filter by type, place, or URL" value={query} onChange={e => setQuery(e.target.value)} /><span>{shown.length} record{shown.length === 1 ? "" : "s"}</span></section>{error ? <p role="alert">{error}</p> : <section className="cards">{shown.map(r => <article key={r.pk}><div><span className="pill">{r.status}</span><h2>{r.documentType ?? "Unclassified act"}</h2></div><dl><dt>Date</dt><dd>{r.actDate ?? "—"}</dd><dt>Place</dt><dd>{r.place ?? "—"}</dd><dt>Parser</dt><dd>{r.parserVersion}</dd></dl><a href={r.url} target="_blank" rel="noreferrer">Open archival source</a></article>)}</section>} {!error && shown.length === 0 && <p className="empty">No cached record matches this filter.</p>}</main>;
}
