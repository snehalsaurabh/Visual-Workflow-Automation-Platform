import { Link } from "react-router-dom";
import { ArrowRight, CandlestickChart, Clock3, ShieldCheck, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const highlights = [
  {
    title: "Trading-first triggers",
    text: "Model timers and live price thresholds instead of generic app automations.",
    icon: CandlestickChart,
  },
  {
    title: "Visual DAG builder",
    text: "Link trigger nodes to exchange actions with an interaction flow inspired by n8n.",
    icon: Workflow,
  },
  {
    title: "Execution-aware UX",
    text: "Track queued, failed, and successful runs as if this were a live ops terminal.",
    icon: ShieldCheck,
  },
];

export default function LandingPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden rounded-[36px] border-white/70 bg-stone-950 p-8 text-stone-50 shadow-[0_30px_100px_rgba(28,25,23,0.18)] sm:p-10">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-amber-200">
            <Clock3 size={14} />
            Execution-ready frontend
          </div>
          <h1 className="max-w-3xl font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl">
            Build trading workflows visually, not with brittle scripts.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-stone-300">
            This frontend is built around a no-code DAG editor for traders. You can start from a trigger, chain exchange actions,
            save workflows locally, and inspect execution history from the same product shell.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full bg-amber-300 text-stone-950 hover:bg-amber-200">
              <Link to="/builder">
                Open Builder
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 bg-white/5 text-stone-50 hover:bg-white/10">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </Card>

        <div className="grid gap-6">
          <Card className="rounded-[32px] border-white/70 bg-[#f9f3ea] p-6 shadow-[0_24px_80px_rgba(28,25,23,0.09)]">
            <div className="grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-stone-500">What’s implemented</p>
              <div className="rounded-3xl bg-white p-5">
                <p className="font-serif text-2xl text-stone-950">A full frontend slice</p>
                <p className="mt-2 text-stone-600">
                  Landing page, auth screens, dashboard, workflow builder, and execution tracking are all wired together.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-stone-950 p-5 text-stone-50">
                  <p className="text-3xl font-semibold text-amber-300">1</p>
                  <p className="mt-2 text-sm text-stone-300">guided trigger selection flow for an empty canvas</p>
                </div>
                <div className="rounded-3xl bg-amber-300 p-5 text-stone-950">
                  <p className="text-3xl font-semibold">3</p>
                  <p className="mt-2 text-sm">action templates for trading and desk notifications</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-[32px] border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(28,25,23,0.09)]">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-stone-500">Suggested first run</p>
            <ol className="mt-4 space-y-4 text-sm text-stone-700">
              <li>1. Open the builder and choose a price or timer trigger.</li>
              <li>2. Drag from a node handle into empty space to create the next action.</li>
              <li>3. Save the workflow and confirm it appears on the dashboard and executions page.</li>
            </ol>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="rounded-[30px] border-white/70 bg-white/70 p-6 shadow-[0_20px_70px_rgba(28,25,23,0.07)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-amber-300">
                <Icon size={18} />
              </div>
              <h2 className="font-serif text-2xl text-stone-950">{item.title}</h2>
              <p className="mt-3 text-stone-600">{item.text}</p>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

