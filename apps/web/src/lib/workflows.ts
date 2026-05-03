import type { Edge, Node } from "@xyflow/react";

export type TriggerType = "price" | "timer";
export type ActionType = "open-long" | "open-short" | "close-position" | "notify";
export type TriggerOperator = "below" | "above";

export type TriggerNodeData = {
  category: "trigger";
  label: string;
  triggerType: TriggerType;
  asset: string;
  exchange: string;
  operator: TriggerOperator;
  price: string;
  intervalMinutes: string;
  note: string;
};

export type ActionNodeData = {
  category: "action";
  label: string;
  actionType: ActionType;
  exchange: string;
  asset: string;
  quantity: string;
  leverage: string;
  orderType: "market" | "limit";
  note: string;
};

export type BuilderNodeData = TriggerNodeData | ActionNodeData;
export type BuilderNode = Node<BuilderNodeData>;
export type BuilderEdge = Edge;

export type WorkflowRecord = {
  id: string;
  name: string;
  description: string;
  status: "draft" | "armed";
  nodes: BuilderNode[];
  edges: BuilderEdge[];
  createdAt: string;
  updatedAt: string;
};

export type ExecutionRecord = {
  id: string;
  workflowId: string;
  workflowName: string;
  exchange: string;
  status: "success" | "failed" | "queued";
  triggerSummary: string;
  actionSummary: string;
  timestamp: string;
  pnl: string;
};

const WORKFLOW_STORAGE_KEY = "visual-workflow.workflows";
const USER_STORAGE_KEY = "visual-workflow.user";

export function createTriggerNodeData(triggerType: TriggerType): TriggerNodeData {
  if (triggerType === "timer") {
    return {
      category: "trigger",
      label: "Timer Trigger",
      triggerType: "timer",
      asset: "SOL",
      exchange: "Hyperliquid",
      operator: "below",
      price: "150",
      intervalMinutes: "5",
      note: "Runs every 5 minutes and kicks off the first action.",
    };
  }

  return {
    category: "trigger",
    label: "Price Trigger",
    triggerType: "price",
    asset: "SOL",
    exchange: "Backpack",
    operator: "below",
    price: "150",
    intervalMinutes: "5",
    note: "Watches the market and reacts when the threshold is hit.",
  };
}

export function createActionNodeData(actionType: ActionType): ActionNodeData {
  const base: ActionNodeData = {
    category: "action",
    label: "Open Long",
    actionType: "open-long",
    exchange: "Hyperliquid",
    asset: "SOL",
    quantity: "250",
    leverage: "3",
    orderType: "market",
    note: "Place the trade with the selected size and leverage.",
  };

  if (actionType === "open-short") {
    return {
      ...base,
      label: "Open Short",
      actionType,
      note: "Open a short position when the trigger condition is true.",
    };
  }

  if (actionType === "close-position") {
    return {
      ...base,
      label: "Close Position",
      actionType,
      quantity: "100",
      leverage: "1",
      note: "Reduce risk by closing an existing position.",
    };
  }

  if (actionType === "notify") {
    return {
      ...base,
      label: "Notify Desk",
      actionType,
      quantity: "",
      leverage: "",
      note: "Send a notification instead of placing a trade.",
    };
  }

  return base;
}

export function getWorkflows(): WorkflowRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(WORKFLOW_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as WorkflowRecord[];
  } catch {
    return [];
  }
}

export function getWorkflowById(id: string): WorkflowRecord | undefined {
  return getWorkflows().find((workflow) => workflow.id === id);
}

export function upsertWorkflow(workflow: WorkflowRecord): WorkflowRecord {
  const workflows = getWorkflows();
  const next = workflows.some((item) => item.id === workflow.id)
    ? workflows.map((item) => (item.id === workflow.id ? workflow : item))
    : [workflow, ...workflows];

  window.localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(next));
  return workflow;
}

export function deleteWorkflow(id: string) {
  const next = getWorkflows().filter((workflow) => workflow.id !== id);
  window.localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(next));
}

export function getCurrentUser(): string {
  if (typeof window === "undefined") {
    return "Trader";
  }

  return window.localStorage.getItem(USER_STORAGE_KEY) ?? "Trader";
}

export function setCurrentUser(name: string) {
  window.localStorage.setItem(USER_STORAGE_KEY, name);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function summarizeTrigger(data: TriggerNodeData) {
  if (data.triggerType === "timer") {
    return `Every ${data.intervalMinutes || "5"} min on ${data.exchange}`;
  }

  return `${data.asset || "SOL"} ${data.operator} ${data.price || "150"} on ${data.exchange}`;
}

export function summarizeAction(data: ActionNodeData) {
  if (data.actionType === "notify") {
    return `Notify desk about ${data.asset || "SOL"}`;
  }

  return `${data.label} ${data.quantity || "0"} ${data.asset || "SOL"} on ${data.exchange}`;
}

export function generateExecutions(workflows: WorkflowRecord[]): ExecutionRecord[] {
  return workflows.slice(0, 6).flatMap((workflow, workflowIndex) => {
    const triggerNode = workflow.nodes.find((node) => node.type === "trigger");
    const firstAction = workflow.nodes.find((node) => node.type === "action");

    if (!triggerNode || !firstAction) {
      return [];
    }

    const trigger = triggerNode.data as TriggerNodeData;
    const action = firstAction.data as ActionNodeData;
    const statuses: ExecutionRecord["status"][] = ["success", "queued", "failed"];

    return statuses.map((status, runIndex) => ({
      id: `${workflow.id}-${status}`,
      workflowId: workflow.id,
      workflowName: workflow.name,
      exchange: action.exchange,
      status,
      triggerSummary: summarizeTrigger(trigger),
      actionSummary: summarizeAction(action),
      timestamp: new Date(Date.now() - (workflowIndex * 3 + runIndex) * 36e5).toISOString(),
      pnl:
        status === "success"
          ? `+$${(280 + runIndex * 45).toFixed(0)}`
          : status === "failed"
            ? `-$${(90 + runIndex * 25).toFixed(0)}`
            : "Pending",
    }));
  });
}

