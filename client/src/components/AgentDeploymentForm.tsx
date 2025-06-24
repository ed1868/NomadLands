import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Zap, Settings, DollarSign, Globe, Lock, Building } from "lucide-react";

interface AgentDeploymentFormProps {
  onSuccess?: () => void;
}

export default function AgentDeploymentForm({ onSuccess }: AgentDeploymentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    configuration: {
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: "",
    },
    pricePerCall: "0.01",
    currency: "USD",
    accessType: "public",
    environment: "production",
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState("");

  const deploymentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/deployments", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Agent Deployed Successfully",
        description: `Your agent "${data.name}" is now live at ${data.apiEndpoint}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/deployments"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Deployment Failed",
        description: error.message || "Failed to deploy agent",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    deploymentMutation.mutate(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  return (
    <Card className="bg-black/40 border-green-500/20">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Deploy New AI Agent
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure and deploy your AI agent to the AI Nomads marketplace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-green-400">Agent Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Email Classification Agent"
                className="bg-black/30 border-green-500/30 text-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-green-400">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Automatically classifies and organizes emails based on content and priority"
                className="bg-black/30 border-green-500/30 text-white min-h-[80px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-green-400">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-black/30 border-green-500/30 text-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-black border-green-500/30">
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="bg-green-500/20" />

          {/* AI Configuration */}
          <div className="space-y-4">
            <h3 className="text-green-400 font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4" />
              AI Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="model" className="text-green-400">AI Model</Label>
                <Select
                  value={formData.configuration.model}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    configuration: { ...formData.configuration, model: value }
                  })}
                >
                  <SelectTrigger className="bg-black/30 border-green-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-green-500/30">
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="temperature" className="text-green-400">Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.configuration.temperature}
                  onChange={(e) => setFormData({
                    ...formData,
                    configuration: { ...formData.configuration, temperature: parseFloat(e.target.value) }
                  })}
                  className="bg-black/30 border-green-500/30 text-white"
                />
              </div>

              <div>
                <Label htmlFor="maxTokens" className="text-green-400">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  min="1"
                  max="4000"
                  value={formData.configuration.maxTokens}
                  onChange={(e) => setFormData({
                    ...formData,
                    configuration: { ...formData.configuration, maxTokens: parseInt(e.target.value) }
                  })}
                  className="bg-black/30 border-green-500/30 text-white"
                />
              </div>

              <div>
                <Label htmlFor="environment" className="text-green-400">Environment</Label>
                <Select
                  value={formData.environment}
                  onValueChange={(value) => setFormData({ ...formData, environment: value })}
                >
                  <SelectTrigger className="bg-black/30 border-green-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-green-500/30">
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="systemPrompt" className="text-green-400">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                value={formData.configuration.systemPrompt}
                onChange={(e) => setFormData({
                  ...formData,
                  configuration: { ...formData.configuration, systemPrompt: e.target.value }
                })}
                placeholder="You are an AI assistant specialized in email classification..."
                className="bg-black/30 border-green-500/30 text-white min-h-[100px]"
              />
            </div>
          </div>

          <Separator className="bg-green-500/20" />

          {/* Pricing & Access */}
          <div className="space-y-4">
            <h3 className="text-green-400 font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Pricing & Access
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="pricePerCall" className="text-green-400">Price per Call</Label>
                <Input
                  id="pricePerCall"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pricePerCall}
                  onChange={(e) => setFormData({ ...formData, pricePerCall: e.target.value })}
                  className="bg-black/30 border-green-500/30 text-white"
                />
              </div>

              <div>
                <Label htmlFor="currency" className="text-green-400">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger className="bg-black/30 border-green-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-green-500/30">
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accessType" className="text-green-400">Access Type</Label>
                <Select
                  value={formData.accessType}
                  onValueChange={(value) => setFormData({ ...formData, accessType: value })}
                >
                  <SelectTrigger className="bg-black/30 border-green-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-green-500/30">
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Public
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Private
                      </div>
                    </SelectItem>
                    <SelectItem value="enterprise">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Enterprise
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator className="bg-green-500/20" />

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-green-400 font-semibold">Tags</h3>
            
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                className="bg-black/30 border-green-500/30 text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} variant="outline" className="border-green-500/30 text-green-400">
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-green-500/20 text-green-400">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-green-400 hover:text-red-400"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={deploymentMutation.isPending}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {deploymentMutation.isPending ? "Deploying..." : "Deploy Agent"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}