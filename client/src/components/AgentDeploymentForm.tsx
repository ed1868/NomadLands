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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AgentCreationChat from "./AgentCreationChatNew";
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
  tags: z.array(z.string()).default([]),
  // Additional fields for comprehensive agent configuration
  responseTime: z.string().optional(),
  usageVolume: z.string().optional(),
  errorHandling: z.string().optional(),
  targetAudience: z.string().optional(),
  dataUpdateFrequency: z.string().optional(),
  availability: z.string().optional()
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
      description: "AI agent created through AI Nomads platform",
      category: "",
      aiModel: "gpt-4o",
      systemPrompt: "",
      pricing: 0.05,
      accessType: "public",
      tags: [],
      responseTime: undefined,
      usageVolume: undefined,
      errorHandling: undefined,
      targetAudience: undefined,
      dataUpdateFrequency: undefined,
      availability: undefined
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
        tools: data.tags,
        responseTime: data.responseTime,
        usageVolume: data.usageVolume,
        errorHandling: data.errorHandling,
        availability: data.availability
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
              <AgentCreationChat />
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
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <Bot className="w-5 h-5 text-emerald-500" />
                        <span>Basic Information</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-300">Agent Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="My Awesome Agent" className="bg-gray-800/50 border-gray-600" />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-300">Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-gray-800/50 border-gray-600">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                  <SelectItem value="business">Business Automation</SelectItem>
                                  <SelectItem value="customer-service">Customer Service</SelectItem>
                                  <SelectItem value="data-analysis">Data Analysis</SelectItem>
                                  <SelectItem value="content">Content Creation</SelectItem>
                                  <SelectItem value="productivity">Productivity</SelectItem>
                                  <SelectItem value="communication">Communication</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Hidden description field - still part of form but not visible */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
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

                    {/* Advanced Configuration */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <Settings className="w-5 h-5 text-emerald-500" />
                        <span>Advanced Configuration</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="responseTime" className="text-sm font-medium text-gray-300">
                            Expected Response Time
                          </Label>
                          <Select onValueChange={(value) => form.setValue("responseTime", value)}>
                            <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                              <SelectValue placeholder="Select response time" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="instant">Instant (&lt; 1 second)</SelectItem>
                              <SelectItem value="fast">Fast (1-5 seconds)</SelectItem>
                              <SelectItem value="standard">Standard (5-30 seconds)</SelectItem>
                              <SelectItem value="batch">Batch processing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="usageVolume" className="text-sm font-medium text-gray-300">
                            Expected Usage Volume
                          </Label>
                          <Select onValueChange={(value) => form.setValue("usageVolume", value)}>
                            <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                              <SelectValue placeholder="Select usage volume" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="low">Low (&lt; 100 calls/day)</SelectItem>
                              <SelectItem value="medium">Medium (100-1000 calls/day)</SelectItem>
                              <SelectItem value="high">High (1000-10000 calls/day)</SelectItem>
                              <SelectItem value="enterprise">Enterprise (&gt; 10000 calls/day)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="errorHandling" className="text-sm font-medium text-gray-300">
                            Error Handling Strategy
                          </Label>
                          <Select onValueChange={(value) => form.setValue("errorHandling", value)}>
                            <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                              <SelectValue placeholder="Select error handling" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="retry">Auto-retry with backoff</SelectItem>
                              <SelectItem value="fallback">Graceful fallback</SelectItem>
                              <SelectItem value="human">Human handoff</SelectItem>
                              <SelectItem value="queue">Queue for later processing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="availability" className="text-sm font-medium text-gray-300">
                            Availability Requirements
                          </Label>
                          <Select onValueChange={(value) => form.setValue("availability", value)}>
                            <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                              <SelectValue placeholder="Select availability" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="24x7">24/7 availability</SelectItem>
                              <SelectItem value="business">Business hours only</SelectItem>
                              <SelectItem value="scheduled">Scheduled operations</SelectItem>
                              <SelectItem value="on-demand">On-demand activation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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
                  </Form>
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