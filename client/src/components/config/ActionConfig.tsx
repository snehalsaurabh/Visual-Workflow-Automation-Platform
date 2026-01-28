import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function ActionConfig({ data, onUpdate }: { data: any, onUpdate: (newData: any) => void }) {
    const actionType = data.actionType || 'buy';

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Action Type</Label>
                <Select
                    value={actionType}
                    onValueChange={(val) => onUpdate({ ...data, actionType: val })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="buy">Market Buy</SelectItem>
                        <SelectItem value="sell">Market Sell</SelectItem>
                        <SelectItem value="notify">Send Notification</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Input
                    placeholder="e.g. Buy BTC"
                    value={data.label || ''}
                    onChange={(e) => onUpdate({ ...data, label: e.target.value })}
                />
            </div>

            {actionType !== 'notify' && (
                <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                        type="number"
                        placeholder="0.01"
                        value={data.amount || ''}
                        onChange={(e) => onUpdate({ ...data, amount: e.target.value })}
                    />
                </div>
            )}
        </div>
    );
}
