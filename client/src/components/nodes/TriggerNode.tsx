import { Handle, Position } from '@xyflow/react';
import { Bell, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function TriggerNode({ data }: { data: any }) {
    const isTimer = data.triggerType === 'timer';
    const label = data.label || (isTimer ? 'Timer Trigger' : 'Price Trigger');

    return (
        <Card className={`p-4 min-w-[150px] shadow-md border-2 ${isTimer ? 'border-orange-500' : 'border-blue-500'}`}>
            <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${isTimer ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    {isTimer ? <Clock size={20} /> : <Bell size={20} />}
                </div>
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Trigger</p>
                    <p className="text-sm font-medium">{label}</p>
                </div>
            </div>
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary" />
        </Card>
    );
}
