import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function TriggerConfig({ data, onUpdate }: { data: any, onUpdate: (newData: any) => void }) {
    const triggerType = data.triggerType || 'price';

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Trigger Type</Label>
                <Select
                    value={triggerType}
                    onValueChange={(val) => onUpdate({ ...data, triggerType: val, label: val === 'timer' ? 'Timer Trigger' : 'Price Trigger' })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="price">Price Based</SelectItem>
                        <SelectItem value="timer">Timer Based</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {triggerType === 'price' ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Symbol</Label>
                        <Input
                            placeholder="e.g. BTCUSDT"
                            value={data.symbol || ''}
                            onChange={(e) => onUpdate({ ...data, symbol: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Price Threshold</Label>
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={data.price || ''}
                            onChange={(e) => onUpdate({ ...data, price: e.target.value })}
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Interval (minutes)</Label>
                        <Input
                            type="number"
                            placeholder="60"
                            value={data.interval || ''}
                            onChange={(e) => onUpdate({ ...data, interval: e.target.value })}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
