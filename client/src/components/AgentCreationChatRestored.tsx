import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Bot, X, Zap, Loader2, Mail, MessageSquare, FileText, Code, Calendar, Users, Cloud, Video, BarChart3, DollarSign } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AgentData {
  name?: string;
  description?: string;
  category?: string;
  tools?: string[];
  systemPrompt?: string;
  behavior?: string;
  useCase?: string;
  targetAudience?: string;
  responseStyle?: string;
}

export default function AgentCreationChatRestored() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentData, setAgentData] = useState<AgentData | null>(null);
  const [tools, setTools] = useState<string[]>([]);
  const [suggestedTools, setSuggestedTools] = useState<string[]>([]);
  const [showCreateButton, setShowCreateButton] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message and tool suggestions
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: "Hi! I'm here to help you create a custom AI agent. Tell me what kind of agent you want to build and what tasks it should handle.",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
      // Show initial tool suggestions
      setSuggestedTools([
        "Gmail", "Slack", "Notion", "GitHub", "Trello", "Discord", 
        "Google Drive", "Calendly", "HubSpot", "Salesforce"
      ]);
    }
  }, []);

  const allTools = [
    "Gmail", "Slack", "Discord", "Telegram", "WhatsApp", "Microsoft Teams",
    "Notion", "Airtable", "Google Sheets", "Excel", "Trello", "Asana",
    "GitHub", "GitLab", "Jira", "Linear", "Figma", "Adobe Creative Suite",
    "Shopify", "WooCommerce", "Stripe", "PayPal", "QuickBooks", "Xero",
    "HubSpot", "Salesforce", "Mailchimp", "ConvertKit", "Zapier", "Make",
    "Google Drive", "Dropbox", "OneDrive", "AWS S3", "Google Calendar",
    "Calendly", "Zoom", "Google Meet", "Microsoft Teams", "Loom",
    "Twitter", "LinkedIn", "Facebook", "Instagram", "TikTok", "YouTube",
    "OpenAI", "Anthropic", "Google AI", "AWS Bedrock", "Hugging Face"
  ];

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/chat/openai", {
        message: inputMessage,
        tools: tools,
        conversationHistory: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update agent data if provided
      if (response.agentData) {
        setAgentData(response.agentData);
      }

      // Handle suggested tools
      if (response.suggestedTools && response.suggestedTools.length > 0) {
        setSuggestedTools(response.suggestedTools.filter((tool: string) => !tools.includes(tool)));
      }

      // Check if agent is ready to create
      if (response.agentData?.name && response.agentData?.description && tools.length > 0) {
        setShowCreateButton(true);
      }

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTool = (tool: string) => {
    if (!tools.includes(tool)) {
      setTools(prev => [...prev, tool]);
      setSuggestedTools(prev => prev.filter(t => t !== tool));
      
      // Check if we should show create button
      if (agentData?.name && agentData?.description) {
        setShowCreateButton(true);
      }
    }
  };

  const removeTool = (tool: string) => {
    setTools(prev => prev.filter(t => t !== tool));
  };

  const getToolIcon = (tool: string) => {
    const iconMap = {
      'Google Sheets': FileText,
      'Gmail': Mail,
      'Slack': MessageSquare,
      'Discord': Users,
      'OpenAI': Zap,
      'Stripe': DollarSign,
      'PayPal': DollarSign,
      'Notion': FileText,
      'Airtable': BarChart3,
      'Zapier': Zap
    };
    const IconComponent = iconMap[tool as keyof typeof iconMap] || Zap;
    return <IconComponent className="w-4 h-4" />;
  };

  const createAgent = async () => {
    if (!agentData || !agentData.name || !agentData.description) {
      toast({
        title: "Missing Information",
        description: "Please provide agent name and description first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/chat/create-agent", {
        ...agentData,
        tools: tools,
        conversationHistory: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      });

      setWebhookResponse(response);
      setShowSuccessPopup(true);
      
      toast({
        title: "Success!",
        description: `Agent "${agentData.name}" created successfully!`,
      });

    } catch (error) {
      console.error("Error creating agent:", error);
      toast({
        title: "Error",
        description: "Failed to create agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setAgentData(null);
    setTools([]);
    setSuggestedTools([]);
    setShowCreateButton(false);
    setWebhookResponse(null);
    
    // Add welcome message back
    const welcomeMessage: Message = {
      id: "welcome-reset",
      role: "assistant",
      content: "Hi! I'm here to help you create a custom AI agent. Tell me what kind of agent you want to build and what tasks it should handle.",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-black/40 border-2 border-gray-700/60 backdrop-blur-xl shadow-2xl">
        <CardHeader className="border-b border-gray-700/50">
          <CardTitle className="text-white flex items-center space-x-2 font-bold">
            <Bot className="h-6 w-6 text-emerald-400 drop-shadow-lg" />
            <span>AI Agent Creation Chat</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {/* Messages */}
          <div className="h-96 overflow-y-auto bg-black/30 border border-gray-700/50 rounded-lg p-4 space-y-4 backdrop-blur-sm">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg border backdrop-blur-sm ${
                    message.role === 'user'
                      ? 'bg-emerald-600/80 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/20'
                      : 'bg-gray-800/70 text-gray-100 border-gray-600/50 shadow-lg'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Current Agent Info */}
          {agentData && (
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
              <h3 className="text-emerald-400 font-medium mb-2">Current Agent</h3>
              <div className="space-y-1 text-sm text-gray-300">
                {agentData.name && <p><span className="text-gray-400">Name:</span> {agentData.name}</p>}
                {agentData.description && <p><span className="text-gray-400">Description:</span> {agentData.description}</p>}
                {agentData.category && <p><span className="text-gray-400">Category:</span> {agentData.category}</p>}
              </div>
            </div>
          )}

          {/* Selected Tools */}
          {tools.length > 0 && (
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
              <h3 className="text-emerald-400 font-medium mb-2">Selected Tools ({tools.length})</h3>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 bg-emerald-900/30 text-emerald-300 text-sm rounded border border-emerald-800/50 flex items-center space-x-2"
                  >
                    <span>{tool}</span>
                    <button
                      onClick={() => removeTool(tool)}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tools & Integrations */}
          <div className="border-t border-gray-700/50 pt-4">
            <h3 className="text-white text-sm font-bold mb-4 tracking-wide">Tools & Integrations</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              {["Google Sheets", "Gmail", "Slack", "Discord", "OpenAI", "Stripe", "PayPal", "Notion", "Airtable", "Zapier"].map((tool) => (
                <button
                  key={tool}
                  onClick={() => addTool(tool)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border-2 transition-all duration-300 backdrop-blur-sm font-medium ${
                    tools.includes(tool)
                      ? 'bg-emerald-900/30 text-emerald-300 border-emerald-400/60 shadow-lg shadow-emerald-500/20 hover:bg-emerald-800/40'
                      : 'bg-black/20 text-gray-300 border-gray-600/60 hover:border-gray-400/80 hover:bg-gray-800/30 hover:text-white'
                  }`}
                >
                  {getToolIcon(tool)}
                  {tool}
                  {tools.includes(tool) ? ' ✓' : ' +'}
                </button>
              ))}
            </div>
          </div>

          {/* Create Agent Button */}
          {showCreateButton && (
            <div className="border-t border-gray-700/50 pt-4">
              <Button
                onClick={createAgent}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600/80 to-emerald-700/80 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl border-2 border-emerald-400/60 hover:border-emerald-300/80 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Creating Agent...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Create Agent {tools.length > 0 && `(${tools.length} tools)`}
                  </>
                )}
              </Button>
              
              {tools.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-2">Selected tools:</p>
                  <div className="flex flex-wrap gap-1">
                    {tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-1 bg-emerald-900/30 text-emerald-300 text-xs rounded border border-emerald-800/50"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Message Input */}
          <div className="border-t border-gray-700/50 pt-4">
            <div className="flex space-x-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe what you want your agent to do..."
                className="flex-1 bg-black/20 border-2 border-gray-600/60 text-white placeholder-gray-400 focus:border-emerald-400/80 hover:border-gray-500/80 backdrop-blur-sm rounded-xl px-4 py-3 font-medium"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-emerald-600/80 hover:bg-emerald-600 text-white px-6 py-3 border-2 border-emerald-400/60 hover:border-emerald-300/80 backdrop-blur-sm rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/20"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">Agent Created Successfully!</h2>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-4">
                <h3 className="text-emerald-300 font-medium mb-2">Agent Details</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  {agentData && (
                    <>
                      <p><span className="text-gray-400">Name:</span> {agentData.name}</p>
                      <p><span className="text-gray-400">Description:</span> {agentData.description}</p>
                      <p><span className="text-gray-400">Category:</span> {agentData.category}</p>
                      {tools && tools.length > 0 && (
                        <p><span className="text-gray-400">Tools:</span> {tools.join(', ')}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                <h3 className="text-blue-300 font-medium mb-2">Deployment Status</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p><span className="text-gray-400">Status:</span> <span className="text-emerald-400">Successfully Created</span></p>
                  <p><span className="text-gray-400">Webhook:</span> Sent to n8n</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  onClick={() => {
                    resetChat();
                    setShowSuccessPopup(false);
                  }}
                  variant="outline"
                  className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10"
                >
                  Create Another Agent
                </Button>
                <Button
                  onClick={() => setShowSuccessPopup(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}