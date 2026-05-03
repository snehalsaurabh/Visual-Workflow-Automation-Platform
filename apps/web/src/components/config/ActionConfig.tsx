import { createActionNodeData, type ActionNodeData, type ActionType } from "@/lib/workflows";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type ActionConfigProps = {
  data: ActionNodeData;
  onUpdate: (newData: ActionNodeData) => void;
};

export default function ActionConfig({ data, onUpdate }: ActionConfigProps) {
  const setActionType = (value: ActionType) => {
    onUpdate({
      ...createActionNodeData(value),
      ...data,
      actionType: value,
      label:
        value === "open-long"
          ? "Open Long"
          : value === "open-short"
            ? "Open Short"
            : value === "close-position"
              ? "Close Position"
              : "Notify Desk",
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Action Type</Label>
        <Select value={data.actionType} onValueChange={(value: ActionType) => setActionType(value)}>
          <SelectTrigger className="border-stone-300 bg-stone-50">
            <SelectValue placeholder="Select action type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open-long">Open Long</SelectItem>
            <SelectItem value="open-short">Open Short</SelectItem>
            <SelectItem value="close-position">Close Position</SelectItem>
            <SelectItem value="notify">Notify Desk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Node Label</Label>
        <Input className="border-stone-300 bg-stone-50" value={data.label} onChange={(event) => onUpdate({ ...data, label: event.target.value })} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Exchange</Label>
          <Input
            className="border-stone-300 bg-stone-50"
            value={data.exchange}
            onChange={(event) => onUpdate({ ...data, exchange: event.target.value })}
            placeholder="Hyperliquid"
          />
        </div>
        <div className="space-y-2">
          <Label>Asset</Label>
          <Input
            className="border-stone-300 bg-stone-50"
            value={data.asset}
            onChange={(event) => onUpdate({ ...data, asset: event.target.value.toUpperCase() })}
            placeholder="SOL"
          />
        </div>
      </div>

      {data.actionType !== "notify" && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              className="border-stone-300 bg-stone-50"
              value={data.quantity}
              onChange={(event) => onUpdate({ ...data, quantity: event.target.value })}
              placeholder="250"
            />
          </div>
          <div className="space-y-2">
            <Label>Leverage</Label>
            <Input
              type="number"
              className="border-stone-300 bg-stone-50"
              value={data.leverage}
              onChange={(event) => onUpdate({ ...data, leverage: event.target.value })}
              placeholder="3"
            />
          </div>
          <div className="space-y-2">
            <Label>Order Type</Label>
            <Select value={data.orderType} onValueChange={(value: "market" | "limit") => onUpdate({ ...data, orderType: value })}>
              <SelectTrigger className="border-stone-300 bg-stone-50">
                <SelectValue placeholder="Select order type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="limit">Limit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Internal Note</Label>
        <textarea
          className="min-h-24 w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
          value={data.note}
          onChange={(event) => onUpdate({ ...data, note: event.target.value })}
          placeholder="Explain what this action should do when it runs."
        />
      </div>
    </div>
  );
}

