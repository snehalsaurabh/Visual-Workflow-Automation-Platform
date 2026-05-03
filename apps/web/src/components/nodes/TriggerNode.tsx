import { Handle, Position, type NodeProps } from "@xyflow/react";
import { BellRing, Clock3, Dot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { summarizeTrigger, type TriggerNodeData } from "@/lib/workflows";

export default function TriggerNode({ data, selected }: NodeProps) {
  const nodeData = data as TriggerNodeData;
  const isTimer = nodeData.triggerType === "timer";

  return (
    <Card
      className={`min-w-[260px] rounded-3xl border px-4 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)] transition-all ${
        selected ? "border-stone-900 ring-2 ring-stone-300" : "border-stone-300"
      } ${isTimer ? "bg-amber-50" : "bg-sky-50"}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`rounded-2xl p-3 ${isTimer ? "bg-amber-200 text-amber-900" : "bg-sky-200 text-sky-900"}`}>
            {isTimer ? <Clock3 size={18} /> : <BellRing size={18} />}
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">Trigger</p>
            <p className="font-medium text-stone-900">{nodeData.label}</p>
          </div>
        </div>
        <span className="rounded-full border border-stone-300 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-600">
          Start
        </span>
      </div>

      <div className="space-y-2 rounded-2xl bg-white/80 p-3 text-sm text-stone-700">
        <div className="flex items-center gap-2">
          <Dot className="text-orange-500" />
          <span>{summarizeTrigger(nodeData)}</span>
        </div>
        <p className="line-clamp-2 text-xs text-stone-500">{nodeData.note}</p>
      </div>

      <Handle type="source" position={Position.Right} className="h-4 w-4 border-2 border-stone-950 bg-amber-400" />
    </Card>
  );
}

