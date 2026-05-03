type Edge = { source: string; target: string };
type Node = { id: string; type?: string; data?: any };

export function topoSort(nodes: Node[], edges: Edge[]) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const indeg = new Map<string, number>();
  const out = new Map<string, string[]>();

  for (const n of nodes) {
    indeg.set(n.id, 0);
    out.set(n.id, []);
  }

  for (const e of edges) {
    if (!byId.has(e.source) || !byId.has(e.target)) continue;
    out.get(e.source)?.push(e.target);
    indeg.set(e.target, (indeg.get(e.target) ?? 0) + 1);
  }

  const q: string[] = [];
  for (const [id, d] of indeg.entries()) {
    if (d === 0) q.push(id);
  }

  const ordered: Node[] = [];
  while (q.length) {
    const id = q.shift()!;
    const n = byId.get(id);
    if (n) ordered.push(n);
    for (const nxt of out.get(id) ?? []) {
      indeg.set(nxt, (indeg.get(nxt) ?? 0) - 1);
      if ((indeg.get(nxt) ?? 0) === 0) q.push(nxt);
    }
  }

  if (ordered.length !== nodes.length) {
    throw new Error("Graph has a cycle (not a DAG)");
  }

  return ordered;
}

