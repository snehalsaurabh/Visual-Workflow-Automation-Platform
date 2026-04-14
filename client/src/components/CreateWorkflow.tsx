import { useEffect, useMemo, useRef, useState } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  Panel,
  ReactFlow,
  type Connection,
  type OnConnectEnd,
  type ReactFlowInstance,
} from "@xyflow/react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Save, Sparkles, Trash2, Workflow } from "lucide-react";
import TriggerNode from "./nodes/TriggerNode";
import ActionNode from "./nodes/ActionNode";
import TriggerConfig from "./config/TriggerConfig";
import ActionConfig from "./config/ActionConfig";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createActionNodeData,
  createTriggerNodeData,
  getWorkflowById,
  summarizeAction,
  summarizeTrigger,
  type ActionNodeData,
  type ActionType,
  type BuilderEdge,
  type BuilderNode,
  type BuilderNodeData,
  type TriggerNodeData,
  type TriggerType,
  type WorkflowRecord,
  upsertWorkflow,
} from "@/lib/workflows";

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

type PendingAction = {
  sourceId: string;
  position: { x: number; y: number };
};

type SaveState = {
  tone: "idle" | "success" | "warning";
  message: string;
};

function createTriggerNode(triggerType: TriggerType): BuilderNode {
  return {
    id: `trigger-${crypto.randomUUID()}`,
    type: "trigger",
    position: { x: 120, y: 140 },
    data: createTriggerNodeData(triggerType),
  };
}

function getClientPosition(event: MouseEvent | TouchEvent) {
  if ("changedTouches" in event && event.changedTouches.length > 0) {
    return {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    };
  }

  return {
    x: (event as MouseEvent).clientX,
    y: (event as MouseEvent).clientY,
  };
}

export default function CreateWorkflow() {
  const [searchParams] = useSearchParams();
  const [workflowId, setWorkflowId] = useState("");
  const [workflowName, setWorkflowName] = useState("Solana Momentum Bot");
  const [workflowDescription, setWorkflowDescription] = useState("Buy or manage a position when the configured trigger conditions are met.");
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowRecord["status"]>("draft");
  const [nodes, setNodes] = useState<BuilderNode[]>([]);
  const [edges, setEdges] = useState<BuilderEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [triggerSheetOpen, setTriggerSheetOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>({ tone: "idle", message: "Your canvas is unsaved." });
  const flowRef = useRef<ReactFlowInstance<BuilderNode, BuilderEdge> | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");

    if (!id) {
      setWorkflowId("");
      setNodes([]);
      setEdges([]);
      setSelectedNodeId(null);
      setTriggerSheetOpen(true);
      setWorkflowName("Solana Momentum Bot");
      setWorkflowDescription("Buy or manage a position when the configured trigger conditions are met.");
      setWorkflowStatus("draft");
      setSaveState({ tone: "idle", message: "Start by choosing the first trigger." });
      return;
    }

    const existing = getWorkflowById(id);

    if (!existing) {
      setTriggerSheetOpen(true);
      return;
    }

    setWorkflowId(existing.id);
    setWorkflowName(existing.name);
    setWorkflowDescription(existing.description);
    setWorkflowStatus(existing.status);
    setNodes(existing.nodes);
    setEdges(existing.edges);
    setTriggerSheetOpen(existing.nodes.length === 0);
    setSaveState({ tone: "idle", message: `Loaded ${existing.name}.` });
  }, [searchParams]);

  useEffect(() => {
    if (nodes.length === 0) {
      setSelectedNodeId(null);
      setTriggerSheetOpen(true);
    }
  }, [nodes.length]);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  const addFirstTrigger = (triggerType: TriggerType) => {
    setNodes([createTriggerNode(triggerType)]);
    setEdges([]);
    setSelectedNodeId(null);
    setTriggerSheetOpen(false);
    setSaveState({ tone: "idle", message: "Trigger added. Drag out from the right handle to create the next action." });
  };

  const createActionFromPending = (actionType: ActionType) => {
    if (!pendingAction) {
      return;
    }

    const actionNode: BuilderNode = {
      id: `action-${crypto.randomUUID()}`,
      type: "action",
      position: { x: pendingAction.position.x + 40, y: pendingAction.position.y - 20 },
      data: createActionNodeData(actionType),
    };

    const nextEdge: BuilderEdge = {
      id: `edge-${pendingAction.sourceId}-${actionNode.id}`,
      source: pendingAction.sourceId,
      target: actionNode.id,
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#1c1917" },
      style: { stroke: "#1c1917", strokeWidth: 2 },
    };

    setNodes((current) => [...current, actionNode]);
    setEdges((current) => [...current, nextEdge]);
    setSelectedNodeId(actionNode.id);
    setActionSheetOpen(false);
    setPendingAction(null);
    setSaveState({ tone: "idle", message: "Action added. Click any node to edit its settings." });
  };

  const updateNodeData = (nodeId: string, newData: BuilderNodeData) => {
    setNodes((current) =>
      current.map((node) => {
        if (node.id !== nodeId) {
          return node;
        }

        return {
          ...node,
          data: newData,
        };
      }),
    );
  };

  const handleSave = async () => {
    const now = new Date().toISOString();
    const nextWorkflow: WorkflowRecord = {
      id: workflowId || `workflow-${crypto.randomUUID()}`,
      name: workflowName,
      description: workflowDescription,
      status: workflowStatus,
      nodes,
      edges,
      createdAt: workflowId ? getWorkflowById(workflowId)?.createdAt ?? now : now,
      updatedAt: now,
    };

    upsertWorkflow(nextWorkflow);
    setWorkflowId(nextWorkflow.id);

    try {
      const response = await fetch("http://localhost:5000/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextWorkflow),
      });

      if (!response.ok) {
        throw new Error("Backend save failed");
      }

      setSaveState({ tone: "success", message: "Saved locally and posted to the backend API." });
    } catch {
      setSaveState({ tone: "warning", message: "Saved locally. Backend API was not reachable, which is fine for the frontend-only scope." });
    }
  };

  const handleReset = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setPendingAction(null);
    setActionSheetOpen(false);
    setTriggerSheetOpen(true);
    setSaveState({ tone: "idle", message: "Canvas cleared. Choose a new starting trigger." });
  };

  const onConnect = (connection: Connection) => {
    setEdges((current) =>
      addEdge(
        {
          ...connection,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed, color: "#1c1917" },
          style: { stroke: "#1c1917", strokeWidth: 2 },
        },
        current,
      ),
    );
  };

  const onConnectEnd: OnConnectEnd = (event, connectionState) => {
    const target = event.target as HTMLElement | null;
    const droppedOnPane = Boolean(target?.classList.contains("react-flow__pane"));

    if (!droppedOnPane || !connectionState.fromNode || !flowRef.current) {
      return;
    }

    const point = getClientPosition(event);
    const position = flowRef.current.screenToFlowPosition({ x: point.x, y: point.y });

    setPendingAction({ sourceId: connectionState.fromNode.id, position });
    setActionSheetOpen(true);
  };

  const triggerSummary = (() => {
    const trigger = nodes.find((node) => node.type === "trigger");
    return trigger ? summarizeTrigger(trigger.data as TriggerNodeData) : "No trigger configured yet.";
  })();

  const actionCount = nodes.filter((node) => node.type === "action").length;

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <Card className="rounded-[34px] border-white/70 bg-stone-950 p-8 text-stone-50 shadow-[0_24px_80px_rgba(28,25,23,0.16)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300 text-stone-950">
              <Workflow size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Workflow builder</p>
              <h1 className="font-serif text-4xl leading-none">Compose a trading DAG.</h1>
            </div>
          </div>

          <div className="mt-6 grid gap-5">
            <div className="space-y-2">
              <Label className="text-stone-300">Workflow Name</Label>
              <Input className="border-white/15 bg-white/5 text-white placeholder:text-stone-500" value={workflowName} onChange={(event) => setWorkflowName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-stone-300">Description</Label>
              <textarea
                className="min-h-28 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-offset-background placeholder:text-stone-500 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2"
                value={workflowDescription}
                onChange={(event) => setWorkflowDescription(event.target.value)}
              />
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-[30px] border-white/70 bg-white/75 p-6 shadow-[0_20px_70px_rgba(28,25,23,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Trigger</p>
            <p className="mt-3 font-serif text-2xl text-stone-950">{triggerSummary}</p>
          </Card>
          <Card className="rounded-[30px] border-white/70 bg-amber-300 p-6 text-stone-950 shadow-[0_20px_70px_rgba(28,25,23,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">Actions</p>
            <p className="mt-3 text-5xl font-semibold">{actionCount}</p>
          </Card>
          <Card className="rounded-[30px] border-white/70 bg-white/75 p-6 shadow-[0_20px_70px_rgba(28,25,23,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Save State</p>
            <div className="mt-3 flex items-start gap-3">
              <div className={`mt-1 h-3 w-3 rounded-full ${saveState.tone === "success" ? "bg-emerald-500" : saveState.tone === "warning" ? "bg-amber-500" : "bg-stone-400"}`} />
              <p className="text-sm text-stone-700">{saveState.message}</p>
            </div>
          </Card>
        </div>
      </section>

      <Card className="overflow-hidden rounded-[36px] border-white/70 bg-white/65 shadow-[0_28px_90px_rgba(28,25,23,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 border-b border-stone-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Canvas</p>
            <p className="mt-1 text-sm text-stone-600">Drop a connection into empty space to create the next action, then click nodes to configure them.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-full border-stone-300 bg-stone-50" onClick={() => setTriggerSheetOpen(true)}>
              <Sparkles />
              Choose Trigger
            </Button>
            <Button variant="outline" className="rounded-full border-stone-300 bg-stone-50" onClick={handleReset}>
              <Trash2 />
              Reset Canvas
            </Button>
            <Button className="rounded-full bg-stone-950 text-amber-300 hover:bg-stone-800" onClick={handleSave}>
              <Save />
              Save Workflow
            </Button>
          </div>
        </div>

        <div className="h-[720px] w-full bg-[linear-gradient(180deg,_rgba(255,255,255,0.82),_rgba(248,244,237,0.95))]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onInit={(instance) => {
              flowRef.current = instance;
            }}
            onNodesChange={(changes) => setNodes((current) => applyNodeChanges(changes, current) as BuilderNode[])}
            onEdgesChange={(changes) => setEdges((current) => applyEdgeChanges(changes, current))}
            onConnect={onConnect}
            onConnectEnd={onConnectEnd}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            fitView
            defaultEdgeOptions={{
              type: "smoothstep",
              markerEnd: { type: MarkerType.ArrowClosed, color: "#1c1917" },
              style: { stroke: "#1c1917", strokeWidth: 2 },
            }}
            className="tradeflow-canvas"
          >
            <Background variant={BackgroundVariant.Cross} gap={32} size={1} color="#d6d3d1" />
            <Controls className="rounded-2xl border border-stone-200 bg-white shadow-sm" />
            <Panel position="top-left">
              <div className="rounded-2xl border border-stone-200 bg-white/90 px-4 py-3 text-sm text-stone-700 shadow-sm">
                {nodes.length === 0 ? "Choose the first trigger to begin." : "Click a node to edit. Drag from a handle to continue the flow."}
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </Card>

      <Sheet open={triggerSheetOpen} onOpenChange={setTriggerSheetOpen}>
        <SheetContent side="left" className="w-full border-r border-stone-200 bg-[#f7efe4] p-0 sm:max-w-xl">
          <div className="h-full overflow-y-auto p-6">
            <SheetHeader>
              <SheetTitle className="font-serif text-3xl">Choose the starting trigger</SheetTitle>
              <SheetDescription>
                When the canvas is empty, the builder starts here. Pick the event that should start the workflow.
              </SheetDescription>
            </SheetHeader>

            <div className="mt-8 grid gap-4">
              <button
                type="button"
                className="rounded-[28px] border border-stone-300 bg-white p-6 text-left transition hover:-translate-y-1 hover:shadow-lg"
                onClick={() => addFirstTrigger("price")}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Price Trigger</p>
                <p className="mt-3 font-serif text-3xl text-stone-950">React when SOL drops below a threshold.</p>
                <p className="mt-3 text-sm text-stone-600">Use this for market-reactive automation like “if SOL goes below 150, open a long on Backpack or Hyperliquid.”</p>
              </button>

              <button
                type="button"
                className="rounded-[28px] border border-stone-300 bg-stone-950 p-6 text-left text-stone-50 transition hover:-translate-y-1 hover:shadow-lg"
                onClick={() => addFirstTrigger("timer")}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Timer Trigger</p>
                <p className="mt-3 font-serif text-3xl">Execute the graph on a repeated schedule.</p>
                <p className="mt-3 text-sm text-stone-300">Use this for polling and periodic trade logic like “every 5 minutes rebalance or check a hedge rule.”</p>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet
        open={actionSheetOpen}
        onOpenChange={(open) => {
          setActionSheetOpen(open);
          if (!open) {
            setPendingAction(null);
          }
        }}
      >
        <SheetContent side="right" className="w-full border-l border-stone-200 bg-white p-0 sm:max-w-xl">
          <div className="h-full overflow-y-auto p-6">
            <SheetHeader>
              <SheetTitle className="font-serif text-3xl">Add the next action</SheetTitle>
              <SheetDescription>
                You dropped the connection on empty canvas, so this menu creates a new action node at that position and links it automatically.
              </SheetDescription>
            </SheetHeader>

            <div className="mt-8 grid gap-4">
              {(["open-long", "open-short", "close-position", "notify"] as ActionType[]).map((actionType) => {
                const preview = createActionNodeData(actionType);

                return (
                  <button
                    key={actionType}
                    type="button"
                    className="rounded-[28px] border border-stone-300 bg-stone-50 p-5 text-left transition hover:-translate-y-1 hover:bg-stone-100"
                    onClick={() => createActionFromPending(actionType)}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">{preview.label}</p>
                    <p className="mt-3 text-lg font-semibold text-stone-950">{summarizeAction(preview)}</p>
                    <p className="mt-2 text-sm text-stone-600">{preview.note}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={Boolean(selectedNode)} onOpenChange={(open) => !open && setSelectedNodeId(null)}>
        <SheetContent side="right" className="w-full border-l border-stone-200 bg-[#fcfaf6] sm:max-w-xl">
          <SheetHeader>
            <SheetTitle className="font-serif text-3xl">
              {selectedNode?.type === "trigger" ? "Edit trigger" : "Edit action"}
            </SheetTitle>
            <SheetDescription>
              Update node settings from this side sheet. Changes are applied directly to the canvas.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-8">
            {selectedNode?.type === "trigger" && (
              <TriggerConfig
                data={selectedNode.data as TriggerNodeData}
                onUpdate={(newData) => updateNodeData(selectedNode.id, newData)}
              />
            )}
            {selectedNode?.type === "action" && (
              <ActionConfig
                data={selectedNode.data as ActionNodeData}
                onUpdate={(newData) => updateNodeData(selectedNode.id, newData)}
              />
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-600">
            <div className="flex items-center gap-2 font-medium text-stone-900">
              <CheckCircle2 size={16} />
              Current node summary
            </div>
            <p className="mt-2">
              {selectedNode?.type === "trigger"
                ? summarizeTrigger(selectedNode.data as TriggerNodeData)
                : selectedNode
                  ? summarizeAction(selectedNode.data as ActionNodeData)
                  : ""}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
