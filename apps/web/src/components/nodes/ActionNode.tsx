import { Handle, Position, type NodeProps } from "@xyflow/react";
import { ArrowRightLeft, Bell, ShieldClose, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { summarizeAction, type ActionNodeData } from "@/lib/workflows";

function getIcon(actionType: ActionNodeData["actionType"]) {
  if (actionType === "open-long") {
    return <TrendingUp size={18} />;
  }

  if (actionType === "open-short") {
    return <TrendingDown size={18} />;
  }

  if (actionType === "close-position") {
    return <ShieldClose size={18} />;
  }

  return <Bell size={18} />;
}

export default function ActionNode({ data, selected }: NodeProps) {
  const nodeData = data as ActionNodeData;

  return (
    <Card
      className={`min-w-[280px] rounded-3xl border bg-stone-950 px-4 py-4 text-stone-50 shadow-[0_20px_60px_rgba(15,23,42,0.25)] transition-all ${
        selected ? "border-amber-300 ring-2 ring-amber-200" : "border-stone-700"
      }`}
    >
      <Handle type="target" position={Position.Left} className="h-4 w-4 border-2 border-stone-100 bg-stone-950" />
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-amber-300 p-3 text-stone-950">{getIcon(nodeData.actionType)}</div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400">Action</p>
            <p className="font-medium text-white">{nodeData.label}</p>
          </div>
        </div>
        <ArrowRightLeft size={16} className="text-stone-500" />
      </div>

      <div className="space-y-2 rounded-2xl border border-stone-800 bg-stone-900 p-3 text-sm text-stone-300">
        <p>{summarizeAction(nodeData)}</p>
        <p className="line-clamp-2 text-xs text-stone-500">{nodeData.note}</p>
      </div>

      <Handle type="source" position={Position.Right} className="h-4 w-4 border-2 border-stone-100 bg-amber-300" />
    </Card>
  );
}

