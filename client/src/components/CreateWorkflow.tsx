import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  Panel,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import TriggerConfig from './config/TriggerConfig';
import ActionConfig from './config/ActionConfig';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

const initialNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 250, y: 100 },
    data: { label: 'Price Trigger', triggerType: 'price' }
  },
];

const initialEdges: Edge[] = [];

export default function CreateWorkflow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId]
  );

  const updateNodeData = (nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: newData };
        }
        return node;
      })
    );
  };

  const addTriggerNode = () => {
    const id = `trigger-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'trigger',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: 'Price Trigger', triggerType: 'price' },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const addActionNode = () => {
    const id = `action-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'action',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: 'Market Buy', actionType: 'buy' },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'My Workflow', // We could add a name input later
          nodes,
          edges,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save workflow');
      }

      const result = await response.json();
      console.log('Workflow saved:', result);
      alert('Workflow saved successfully!');
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Error saving workflow. Is the backend running?');
    }
  };

  return (
    <div className="w-screen h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-right" className="flex gap-2 bg-white/80 p-2 rounded-lg border shadow-sm backdrop-blur-sm">
          <Button variant="outline" size="sm" onClick={addTriggerNode} className="flex gap-2">
            <Plus size={16} /> Trigger
          </Button>
          <Button variant="outline" size="sm" onClick={addActionNode} className="flex gap-2">
            <Plus size={16} /> Action
          </Button>
          <Button size="sm" onClick={handleSave} className="flex gap-2">
            <Save size={16} /> Save
          </Button>
        </Panel>
      </ReactFlow>

      <Sheet open={!!selectedNodeId} onOpenChange={(open) => !open && setSelectedNodeId(null)}>
        <SheetContent side="right" className="w-[400px]">
          <SheetHeader>
            <SheetTitle>Configure {selectedNode?.type === 'trigger' ? 'Trigger' : 'Action'}</SheetTitle>
            <SheetDescription>
              Set up the parameters for this {selectedNode?.type}.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-8">
            {selectedNode?.type === 'trigger' && (
              <TriggerConfig
                data={selectedNode.data}
                onUpdate={(newData) => updateNodeData(selectedNode.id, newData)}
              />
            )}
            {selectedNode?.type === 'action' && (
              <ActionConfig
                data={selectedNode.data}
                onUpdate={(newData) => updateNodeData(selectedNode.id, newData)}
              />
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={() => setSelectedNodeId(null)}>Close</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}