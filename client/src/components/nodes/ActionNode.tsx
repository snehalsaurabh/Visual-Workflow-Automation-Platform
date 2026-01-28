import { Handle, Position } from '@xyflow/react';
import { Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function ActionNode({ data }: { data: any }) {
    const label = data.label || 'Direct Action';

    return (
        <Card className="p-4 min-w-[150px] shadow-md border-2 border-green-500">
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-primary" />
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <Zap size={20} />
                </div>
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Action</p>
                    <p className="text-sm font-medium">{label}</p>
                </div>
            </div>
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary" />
        </Card>
    );
}
