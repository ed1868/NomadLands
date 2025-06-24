import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AgentCreationChat from "./AgentCreationChat";
import AgentUploadMethods from "./AgentUploadMethods";
import DeploymentConfirmationModal from "./DeploymentConfirmationModal";
import { 
  Rocket, 
  Zap, 
  Globe, 
  Lock, 
  Building2,
  DollarSign,
  Bot,
  Settings,
  Code,
  Upload,
  MessageCircle
} from "lucide-react";

const deploymentSchema = z.object({
  name: z.string().min(1, "Agent name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  aiModel: z.string().min(1, "AI Model is required"),
  systemPrompt: z.string().min(1, "System prompt is required"),
  pricing: z.number().min(0.01, "Pricing must be at least $0.01"),
  accessType: z.enum(["public", "private", "enterprise"]),
  tags: z.array(z.string()).default([])
});

export default function AgentDeploymentForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeCreationMethod, setActiveCreationMethod] = useState('chat');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [generatedPayload, setGeneratedPayload] = useState<any>(null);

  const form = useForm<z.infer<typeof deploymentSchema>>({
    resolver: zodResolver(deploymentSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      aiModel: "gpt-4o",
      systemPrompt: "",
      pricing: 0.05,
      accessType: "public",
      tags: []
    },
  });

  const handleChatAgentGenerated = (config: any) => {
    form.setValue('name', config.name);
    form.setValue('description', config.description);
    form.setValue('category', config.category);
    form.setValue('aiModel', config.aiModel);
    form.setValue('pricing', config.pricing);
    form.setValue('accessType', config.accessType);
    
    if (config.tools && config.tools.length > 0) {
      form.setValue('systemPrompt', `This agent uses the following tools: ${config.tools.join(', ')}\n\nAgent behavior and capabilities will be configured based on the chat conversation.`);
      form.setValue('tags', config.tools.slice(0, 5));
    }
    
    setActiveCreationMethod('form');
    
    toast({
      title: "Agent Configuration Generated",
      description: "Review and customize the settings below, then deploy your agent.",
    });
  };

  const handleUploadAgentGenerated = (config: any) => {
    form.setValue('name', config.name);
    form.setValue('description', config.description);
    form.setValue('category', config.category);
    form.setValue('aiModel', config.aiModel);
    form.setValue('pricing', config.pricing);
    form.setValue('accessType', config.accessType);
    
    if (config.sourceType === 'python') {
      form.setValue('systemPrompt', `This agent is based on Python code: ${config.sourceFiles?.map((f: any) => f.name).join(', ')}\n\nThe agent will execute the provided Python functionality through API calls.`);
    } else if (config.sourceType === 'n8n') {
      form.setValue('systemPrompt', `This agent is based on an n8n workflow: ${config.n8nUrl}\n\nThe agent will trigger and manage the n8n workflow execution.`);
    } else if (config.sourceType === 'json') {
      form.setValue('systemPrompt', config.jsonConfig.systemPrompt || 'Agent configured from JSON specification.');
    }
    
    if (config.tools) {
      form.setValue('tags', config.tools.slice(0, 5));
    }
    
    setActiveCreationMethod('form');
    
    toast({
      title: "Agent Imported Successfully",
      description: "Review the configuration and deploy your agent.",
    });
  };

  const deploymentMutation = useMutation({
    mutationFn: async (optimizedPayload: any) => {
      const response = await apiRequest("POST", "/api/deployments", optimizedPayload);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Agent Submitted Successfully",
        description: "Your agent has been submitted for testing and approval.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/deployments"] });
      setShowConfirmationModal(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit agent. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof deploymentSchema>) => {
    // Create optimized payload for LLM n8n workflow generation
    const optimizedPayload = {
      agent: {
        name: data.name,
        description: data.description,
        category: data.category,
        systemPrompt: data.systemPrompt,
        aiModel: data.aiModel,
        pricing: data.pricing,
        accessType: data.accessType,
        tools: data.tags
      },
      n8nWorkflow: {
        nodes: data.tags.map((tool, index) => ({
          id: `node_${index}`,
          type: tool.toLowerCase().replace(/\s+/g, '_'),
          name: tool,
          parameters: {},
          position: { x: index * 200, y: 100 }
        })),
        connections: {},
        metadata: {
          generatedFor: data.name,
          timestamp: new Date().toISOString(),
          description: `Workflow for ${data.name}: ${data.description}`
        }
      },
      llmInstructions: {
        objective: `Create an n8n workflow for "${data.name}" agent`,
        description: data.description,
        systemPrompt: data.systemPrompt,
        requiredIntegrations: data.tags,
        expectedBehavior: "The workflow should handle incoming requests, process them through the specified tools, and return appropriate responses",
        outputFormat: "n8n JSON workflow format with proper node connections and error handling"
      }
    };

    setGeneratedPayload(optimizedPayload);
    setShowConfirmationModal(true);
  };

  const handleConfirmDeployment = () => {
    if (generatedPayload) {
      deploymentMutation.mutate(generatedPayload);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <Tabs value={activeCreationMethod} onValueChange={setActiveCreationMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
              <TabsTrigger value="chat" className="data-[state=active]:bg-emerald-600/20">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat Assistant
              </TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:bg-emerald-600/20">
                <Upload className="w-4 h-4 mr-2" />
                Import Code
              </TabsTrigger>
              <TabsTrigger value="form" className="data-[state=active]:bg-emerald-600/20">
                <Settings className="w-4 h-4 mr-2" />
                Manual Setup
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-6">
              <AgentCreationChat onAgentGenerated={handleChatAgentGenerated} />
            </TabsContent>

            <TabsContent value="upload" className="mt-6">
              <AgentUploadMethods onAgentConfigGenerated={handleUploadAgentGenerated} />
            </TabsContent>

            <TabsContent value="form" className="mt-6">
              <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Rocket className="w-5 h-5 text-emerald-500" />
                    <span>Manual Agent Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <Bot className="w-5 h-5 text-emerald-500" />
                        <span>Basic Information</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                            Agent Name
                          </Label>
                          <Input
                            id="name"
                            {...form.register("name")}
                            placeholder="e.g., Customer Support Agent"
                            className="bg-gray-800/50 border-gray-600 text-white"
                          />
                          {form.formState.errors.name && (
                            <p className="text-sm text-red-400">{form.formState.errors.name.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-sm font-medium text-gray-300">
                            Category
                          </Label>
                          <Select onValueChange={(value) => form.setValue("category", value)}>
                            <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="productivity">Productivity</SelectItem>
                              <SelectItem value="customer-service">Customer Service</SelectItem>
                              <SelectItem value="development">Development</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="analytics">Analytics</SelectItem>
                              <SelectItem value="automation">Automation</SelectItem>
                            </SelectContent>
                          </Select>
                          {form.formState.errors.category && (
                            <p className="text-sm text-red-400">{form.formState.errors.category.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-300">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          {...form.register("description")}
                          placeholder="Describe what your agent does and how it helps users..."
                          className="bg-gray-800/50 border-gray-600 text-white min-h-[100px]"
                        />
                        {form.formState.errors.description && (
                          <p className="text-sm text-red-400">{form.formState.errors.description.message}</p>
                        )}
                      </div>
                    </div>

                    {/* AI Configuration */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-emerald-500" />
                        <span>AI Configuration</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="aiModel" className="text-sm font-medium text-gray-300">
                            AI Model
                          </Label>
                          <Select onValueChange={(value) => form.setValue("aiModel", value)} defaultValue="gpt-4o">
                            <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                              <SelectItem value="gpt-4">GPT-4</SelectItem>
                              <SelectItem value="claude-3">Claude 3</SelectItem>
                              <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="accessType" className="text-sm font-medium text-gray-300">
                            Access Type
                          </Label>
                          <Select onValueChange={(value) => form.setValue("accessType", value as "public" | "private" | "enterprise")} defaultValue="public">
                            <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="public">
                                <div className="flex items-center space-x-2">
                                  <Globe className="w-4 h-4" />
                                  <span>Public</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="private">
                                <div className="flex items-center space-x-2">
                                  <Lock className="w-4 h-4" />
                                  <span>Private</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="enterprise">
                                <div className="flex items-center space-x-2">
                                  <Building2 className="w-4 h-4" />
                                  <span>Enterprise</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="systemPrompt" className="text-sm font-medium text-gray-300">
                          System Prompt
                        </Label>
                        <Textarea
                          id="systemPrompt"
                          {...form.register("systemPrompt")}
                          placeholder="Define your agent's personality, behavior, and capabilities..."
                          className="bg-gray-800/50 border-gray-600 text-white min-h-[120px]"
                        />
                        {form.formState.errors.systemPrompt && (
                          <p className="text-sm text-red-400">{form.formState.errors.systemPrompt.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-emerald-500" />
                        <span>Pricing</span>
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="pricing" className="text-sm font-medium text-gray-300">
                          Price per API Call (USD)
                        </Label>
                        <Input
                          id="pricing"
                          type="number"
                          step="0.01"
                          min="0.01"
                          {...form.register("pricing", { valueAsNumber: true })}
                          className="bg-gray-800/50 border-gray-600 text-white"
                        />
                        {form.formState.errors.pricing && (
                          <p className="text-sm text-red-400">{form.formState.errors.pricing.message}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          Minimum $0.01 per call. Consider usage complexity when setting price.
                        </p>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={deploymentMutation.isPending}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Preview & Deploy Agent
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <DeploymentConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        jsonPayload={generatedPayload}
        onConfirm={handleConfirmDeployment}
        isLoading={deploymentMutation.isPending}
      />
    </div>
  );
}