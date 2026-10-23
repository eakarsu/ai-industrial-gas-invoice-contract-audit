// Feature pack: search/filter, export, deterministic record insights (no provider call).
export function filterRecords(rows, { q = "", status = "", risk = "", state = "" } = {}) {
  const needle = String(q).trim().toLowerCase();
  return (rows || []).filter((r) => {
    if (status && String(r.status ?? "") !== status) return false;
    if (state && String(r.state ?? r.status ?? "") !== state) return false;
    if (risk && String(r.risk ?? "") !== risk) return false;
    if (!needle) return true;
    return JSON.stringify(r).toLowerCase().includes(needle);
  });
}
export function toCsv(rows) {
  const cols = [...new Set((rows || []).flatMap((r) => Object.keys(r || {})))];
  const esc = (v) => { const s = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v); return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s; };
  return [cols.join(","), ...(rows || []).map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}
export function buildInsights(rows, labels) {
  const list = rows || [];
  const total = list.length;
  const amount = list.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const attention = list.filter((r) => ["High", "Critical"].includes(String(r.risk)) || !["Approved", "Closed", "closed", "approved"].includes(String(r.status ?? r.state ?? ""))).length;
  const zeroAmount = list.filter((r) => !Number(r.amount)).length;
  return { aiGenerated: false, source: "deterministic-fallback", label: "Deterministic fallback (no AI provider call)", total, sections: [
    { label: labels[0], value: amount, detail: `${total} record(s) totalling ${amount}; ${zeroAmount} record(s) with 0/empty amount preserved.` },
    { label: labels[1], value: attention, detail: `${attention} record(s) need evidence or review (false/0 values preserved, not hidden).` },
    { label: labels[2], value: total - attention, detail: `${total - attention} record(s) not flagged for priority action.` },
  ]};
}
