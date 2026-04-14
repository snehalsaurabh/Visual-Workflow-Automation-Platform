import { Link, useNavigate } from "react-router-dom";
import { PencilLine, Plus, Radar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { deleteWorkflow, formatDate, getCurrentUser, getWorkflows } from "@/lib/workflows";

export default function DashboardPage() {
  const navigate = useNavigate();
  const workflows = getWorkflows();

  const handleDelete = (id: string) => {
    deleteWorkflow(id);
    navigate(0);
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[34px] border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Dashboard</p>
          <h1 className="mt-4 font-serif text-4xl text-stone-950">Hello, {getCurrentUser()}.</h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            This page reads saved workflows from local storage, summarizes node and edge counts, and gives quick access to edit or review executions.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="rounded-full bg-stone-950 text-amber-300 hover:bg-stone-800">
              <Link to="/builder">
                <Plus />
                New Workflow
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-stone-300 bg-stone-50">
              <Link to="/executions">
                <Radar />
                Execution Tracking
              </Link>
            </Button>
          </div>
        </Card>

        <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
          <Card className="rounded-[30px] border-white/70 bg-stone-950 p-6 text-stone-50 shadow-[0_20px_70px_rgba(28,25,23,0.15)]">
            <p className="text-sm text-stone-400">Saved workflows</p>
            <p className="mt-3 text-5xl font-semibold text-amber-300">{workflows.length}</p>
          </Card>
          <Card className="rounded-[30px] border-white/70 bg-amber-300 p-6 text-stone-950 shadow-[0_20px_70px_rgba(28,25,23,0.08)]">
            <p className="text-sm text-stone-700">Total nodes</p>
            <p className="mt-3 text-5xl font-semibold">{workflows.reduce((sum, workflow) => sum + workflow.nodes.length, 0)}</p>
          </Card>
          <Card className="rounded-[30px] border-white/70 bg-white/70 p-6 shadow-[0_20px_70px_rgba(28,25,23,0.08)]">
            <p className="text-sm text-stone-600">Total edges</p>
            <p className="mt-3 text-5xl font-semibold text-stone-950">{workflows.reduce((sum, workflow) => sum + workflow.edges.length, 0)}</p>
          </Card>
        </div>
      </section>

      {workflows.length === 0 ? (
        <Card className="rounded-[34px] border-dashed border-stone-300 bg-white/70 p-10 text-center shadow-[0_20px_70px_rgba(28,25,23,0.05)]">
          <p className="font-serif text-3xl text-stone-950">No workflows yet.</p>
          <p className="mt-3 text-stone-600">Open the builder, create a trigger, drag out an action, and save the flow.</p>
          <Button asChild className="mt-6 rounded-full bg-stone-950 text-amber-300 hover:bg-stone-800">
            <Link to="/builder">Create First Workflow</Link>
          </Button>
        </Card>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="rounded-[30px] border-white/70 bg-white/75 p-6 shadow-[0_20px_70px_rgba(28,25,23,0.07)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">{workflow.status}</p>
                  <h2 className="mt-2 font-serif text-3xl text-stone-950">{workflow.name}</h2>
                </div>
                <span className="rounded-full border border-stone-300 px-3 py-1 text-xs text-stone-600">{workflow.nodes.length} nodes</span>
              </div>
              <p className="mt-3 min-h-12 text-sm text-stone-600">{workflow.description || "No description added yet."}</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-stone-700">
                <div className="rounded-2xl bg-stone-100 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Edges</p>
                  <p className="mt-2 text-2xl font-semibold text-stone-950">{workflow.edges.length}</p>
                </div>
                <div className="rounded-2xl bg-stone-100 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Updated</p>
                  <p className="mt-2 text-sm font-medium text-stone-950">{formatDate(workflow.updatedAt)}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild className="rounded-full bg-stone-950 text-amber-300 hover:bg-stone-800">
                  <Link to={`/builder?id=${workflow.id}`}>
                    <PencilLine />
                    Edit
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-stone-300 bg-stone-50">
                  <Link to="/executions">Runs</Link>
                </Button>
                <Button variant="ghost" className="rounded-full text-stone-600 hover:bg-stone-100" onClick={() => handleDelete(workflow.id)}>
                  <Trash2 />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
