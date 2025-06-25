import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Copy, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeploymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonPayload: any;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeploymentConfirmationModal({
  isOpen,
  onClose,
  jsonPayload,
  onConfirm,
  isLoading = false
}: DeploymentConfirmationModalProps) {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonPayload, null, 2));
    toast({
      title: "Copied to clipboard",
      description: "JSON payload has been copied to your clipboard.",
    });
  };

  const handleDeploy = async () => {
    try {
      // Create the agent configuration
      const agentConfig = {
        name: jsonPayload?.agent?.name || "New Agent",
        description: jsonPayload?.agent?.description || "AI Agent",
        category: jsonPayload?.agent?.category || "productivity",
        price: "0.00",
        features: jsonPayload?.agent?.tools || [],
        tools: jsonPayload?.agent?.tools || [],
        aiModel: jsonPayload?.agent?.aiModel || "gpt-4o",
        systemPrompt: jsonPayload?.agent?.systemPrompt || "",
        responseTime: jsonPayload?.agent?.responseTime || "standard",
        usageVolume: jsonPayload?.agent?.usageVolume || "medium",
        errorHandling: jsonPayload?.agent?.errorHandling || "graceful",
        availability: jsonPayload?.agent?.availability || "business"
      };

      const response = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify(agentConfig),
      });

      if (!response.ok) {
        throw new Error("Failed to create agent");
      }

      const createdAgent = await response.json();
      
      // Generate n8n workflow
      const workflowResponse = await fetch(`/api/agents/${createdAgent.id}/generate-workflow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('authToken') || ''}`
        },
      });

      if (workflowResponse.ok) {
        const workflow = await workflowResponse.json();
        console.log("Generated n8n workflow:", workflow);
        
        // Download the workflow
        const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${createdAgent.name.replace(/\s+/g, '-')}-workflow.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "N8n Workflow Generated",
          description: "Your workflow has been downloaded automatically.",
        });
      }

      console.log("Agent created successfully:", createdAgent);
      onConfirm();
    } catch (error) {
      console.error("Error creating agent:", error);
      toast({
        title: "Error",
        description: "Failed to create agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gray-900/95 border-gray-700/50 backdrop-blur-sm">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              <div>
                <DialogTitle className="text-white text-xl">
                  Agent Submitted for Testing & Approval
                </DialogTitle>
                <DialogDescription className="text-gray-400 mt-1">
                  Your agent configuration has been generated and is ready for deployment
                </DialogDescription>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Agent Summary */}
          <Card className="bg-black/40 border-gray-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center space-x-2">
                <span>Agent Summary</span>
                <Badge className="bg-emerald-500/20 text-emerald-300">
                  {jsonPayload?.agent?.category || 'Custom'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="text-emerald-400 font-medium">{jsonPayload?.agent?.name}</h4>
                <p className="text-gray-300 text-sm mt-1">{jsonPayload?.agent?.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {jsonPayload?.agent?.tools?.map((tool: string, index: number) => (
                  <Badge key={index} className="bg-gray-700/50 text-gray-300 text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">AI Model:</span>
                  <span className="text-white ml-2">{jsonPayload?.agent?.aiModel}</span>
                </div>
                <div>
                  <span className="text-gray-400">Pricing:</span>
                  <span className="text-white ml-2">${jsonPayload?.agent?.pricing}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* JSON Payload */}
          <Card className="bg-black/40 border-gray-700/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">Generated JSON Payload</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-950/50 rounded-lg p-4 max-h-60 overflow-y-auto border border-gray-700/30">
                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                  {JSON.stringify(jsonPayload, null, 2)}
                </pre>
              </div>
              
              <div className="bg-blue-800/20 border border-blue-600/50 rounded-lg p-4 mt-4">
                <h4 className="text-blue-400 font-medium mb-2">N8n Workflow Generation</h4>
                <p className="text-sm text-gray-300">
                  After deployment, an n8n workflow will be automatically generated and downloaded. 
                  This workflow includes:
                </p>
                <ul className="text-sm text-gray-300 mt-2 ml-4 list-disc">
                  <li>Chat trigger for user interactions</li>
                  <li>AI language model configuration</li>
                  <li>Memory management for context</li>
                  <li>Tool integrations based on your selections</li>
                  <li>Structured output formatting</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Edit Configuration
            </Button>
            <Button
              onClick={handleDeploy}
              disabled={isLoading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isLoading ? "Deploying..." : "Deploy Agent & Generate Workflow"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}