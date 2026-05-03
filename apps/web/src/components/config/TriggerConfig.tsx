import { createTriggerNodeData, type TriggerNodeData, type TriggerOperator, type TriggerType } from "@/lib/workflows";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type TriggerConfigProps = {
  data: TriggerNodeData;
  onUpdate: (newData: TriggerNodeData) => void;
};

export default function TriggerConfig({ data, onUpdate }: TriggerConfigProps) {
  const setTriggerType = (value: TriggerType) => {
    onUpdate({
      ...createTriggerNodeData(value),
      ...data,
      triggerType: value,
      label: value === "timer" ? "Timer Trigger" : "Price Trigger",
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Trigger Type</Label>
        <Select value={data.triggerType} onValueChange={(value: TriggerType) => setTriggerType(value)}>
          <SelectTrigger className="border-stone-300 bg-stone-50">
            <SelectValue placeholder="Select trigger type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price Trigger</SelectItem>
            <SelectItem value="timer">Timer Trigger</SelectItem>
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
            placeholder="Backpack, Hyperliquid, Lighter"
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

      {data.triggerType === "price" ? (
        <>
          <div className="space-y-2">
            <Label>Price Condition</Label>
            <Select value={data.operator} onValueChange={(value: TriggerOperator) => onUpdate({ ...data, operator: value })}>
              <SelectTrigger className="border-stone-300 bg-stone-50">
                <SelectValue placeholder="Select comparison" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="below">Drops Below</SelectItem>
                <SelectItem value="above">Moves Above</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Target Price</Label>
            <Input
              type="number"
              className="border-stone-300 bg-stone-50"
              value={data.price}
              onChange={(event) => onUpdate({ ...data, price: event.target.value })}
              placeholder="150"
            />
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <Label>Interval In Minutes</Label>
          <Input
            type="number"
            className="border-stone-300 bg-stone-50"
            value={data.intervalMinutes}
            onChange={(event) => onUpdate({ ...data, intervalMinutes: event.target.value })}
            placeholder="5"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Internal Note</Label>
        <textarea
          className="min-h-24 w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
          value={data.note}
          onChange={(event) => onUpdate({ ...data, note: event.target.value })}
          placeholder="Explain what this trigger is expected to do."
        />
      </div>
    </div>
  );
}

