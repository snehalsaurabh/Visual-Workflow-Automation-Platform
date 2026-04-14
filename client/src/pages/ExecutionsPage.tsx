import { Activity, AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDate, generateExecutions, getWorkflows } from "@/lib/workflows";

export default function ExecutionsPage() {
  const executions = generateExecutions(getWorkflows());

  const statusMeta = {
    success: { label: "Success", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-800" },
    failed: { label: "Failed", icon: AlertTriangle, className: "bg-rose-100 text-rose-800" },
    queued: { label: "Queued", icon: Clock3, className: "bg-amber-100 text-amber-800" },
  } as const;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[34px] border-white/70 bg-stone-950 p-8 text-stone-50 shadow-[0_24px_80px_rgba(28,25,23,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Execution tracking</p>
          <h1 className="mt-4 font-serif text-4xl">Monitor workflow runs over time.</h1>
          <p className="mt-4 max-w-2xl text-stone-300">
            This frontend page simulates execution records from saved workflows so the product has an end-to-end monitoring story before backend workers are connected.
          </p>
        </Card>
        <Card className="rounded-[34px] border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-amber-300">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-sm text-stone-500">Visible runs</p>
              <p className="font-serif text-4xl text-stone-950">{executions.length}</p>
            </div>
          </div>
        </Card>
      </section>

      {executions.length === 0 ? (
        <Card className="rounded-[34px] border-dashed border-stone-300 bg-white/70 p-10 text-center shadow-[0_20px_70px_rgba(28,25,23,0.05)]">
          <p className="font-serif text-3xl text-stone-950">No execution history yet.</p>
          <p className="mt-3 text-stone-600">Save at least one workflow first so this page has data to show.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {executions.map((execution) => {
            const meta = statusMeta[execution.status];
            const StatusIcon = meta.icon;

            return (
              <Card key={execution.id} className="rounded-[28px] border-white/70 bg-white/75 p-6 shadow-[0_20px_60px_rgba(28,25,23,0.06)]">
                <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-center">
                  <div>
                    <p className="font-serif text-2xl text-stone-950">{execution.workflowName}</p>
                    <p className="mt-1 text-sm text-stone-600">{execution.triggerSummary}</p>
                    <p className="mt-1 text-sm text-stone-600">{execution.actionSummary}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Exchange</p>
                    <p className="mt-2 font-medium text-stone-900">{execution.exchange}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Timestamp</p>
                    <p className="mt-2 font-medium text-stone-900">{formatDate(execution.timestamp)}</p>
                  </div>
                  <div className="flex flex-col items-start gap-2 lg:items-end">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${meta.className}`}>
                      <StatusIcon size={14} />
                      {meta.label}
                    </span>
                    <p className="text-lg font-semibold text-stone-950">{execution.pnl}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
