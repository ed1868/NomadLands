import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Bot, 
  User, 
  MessageCircle,
  Plus,
  X
} from "lucide-react";

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  agentConfig?: any;
  showCreateButton?: boolean;
  agentData?: any;
}

interface AgentCreationChatProps {
  onAgentGenerated: (config: any) => void;
}

export default function AgentCreationChat({ onAgentGenerated }: AgentCreationChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm here to help you create your AI agent. What would you like your agent to do?",
      timestamp: new Date(),
      suggestions: [
        "Create a customer support agent",
        "Build a data analysis agent", 
        "Make a content creation agent",
        "Design a scheduling assistant"
      ]
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tools, setTools] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const commonTools = [
    { 
      name: "Google Sheets", 
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlesheets.svg",
      borderColor: "border-green-400",
      textColor: "text-green-300"
    },
    { 
      name: "Gmail", 
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg",
      borderColor: "border-red-400",
      textColor: "text-red-300"
    },
    { 
      name: "Slack", 
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/slack.svg",
      borderColor: "border-purple-400",
      textColor: "text-purple-300"
    },
    { 
      name: "Discord", 
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/discord.svg",
      borderColor: "border-indigo-400",
      textColor: "text-indigo-300"
    },
    { 
      name: "OpenAI", 
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/openai.svg",
      borderColor: "border-emerald-400",
      textColor: "text-emerald-300"
    },
    { 
      name: "Stripe", 
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/stripe.svg",
      borderColor: "border-blue-400",
      textColor: "text-blue-300"
    },
    { 
      name: "PayPal", 
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/paypal.svg",
      borderColor: "border-yellow-400",
      textColor: "text-yellow-300"
    },
    { 
      name: "Notion", 
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/notion.svg",
      borderColor: "border-gray-400",
      textColor: "text-gray-300"
    },
    { 
      name: "Airtable", 
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/airtable.svg",
      borderColor: "border-orange-400",
      textColor: "text-orange-300"
    },
    { 
      name: "Zapier", 
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/zapier.svg",
      borderColor: "border-orange-400",
      textColor: "text-orange-300"
    }
  ];

  const addTool = (toolName: string) => {
    if (!tools.includes(toolName)) {
      setTools([...tools, toolName]);
    }
  };

  const removeTool = (toolName: string) => {
    setTools(tools.filter(t => t !== toolName));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion);
    handleSendMessage(suggestion);
  };

  const handleCreateAgent = async (message: ChatMessage) => {
    try {
      setIsLoading(true);
      
      const workflowResponse = await fetch('/api/chat/generate-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          agentData: message.agentData,
          tools: tools,
          conversationHistory: messages.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content }))
        })
      });

      if (!workflowResponse.ok) {
        throw new Error('Failed to generate workflow');
      }

      const workflowData = await workflowResponse.json();
      
      const webhookUrl = 'https://ainomads.app.n8n.cloud/webhook/d832bc01-555e-4a24-a8cc-31db8fc1c816/chat';
      
      const n8nWorkflowData = {
        action: 'create_agent_workflow',
        timestamp: new Date().toISOString(),
        user: 'ai-nomads-user',
        agent: workflowData.agent,
        n8nWorkflow: workflowData.n8nWorkflow
      };

      const webhookResult = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(n8nWorkflowData)
      });

      if (webhookResult.ok) {
        // Show success popup with approval
        showAgentApprovalPopup(n8nWorkflowData);
      }
    } catch (error) {
      console.error('Error creating agent workflow:', error);
      toast({
        title: "Error",
        description: "Failed to create agent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showAgentApprovalPopup = (workflowData: any) => {
    // Create and show a modal with agent details and JSON
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h2 class="text-xl font-bold text-white mb-4">Agent Created Successfully!</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold text-emerald-400">Agent Details:</h3>
            <div class="bg-black/30 rounded p-4 mt-2">
              <p class="text-gray-300"><strong>Name:</strong> ${workflowData.agent.name}</p>
              <p class="text-gray-300"><strong>Description:</strong> ${workflowData.agent.description}</p>
              <p class="text-gray-300"><strong>Tools:</strong> ${workflowData.agent.tools?.join(', ') || 'None'}</p>
              <p class="text-gray-300"><strong>Status:</strong> <span class="text-yellow-400">Pending Review</span></p>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-emerald-400">Webhook Data Sent:</h3>
            <pre class="bg-black/30 rounded p-4 mt-2 text-xs text-gray-300 overflow-x-auto">${JSON.stringify(workflowData, null, 2)}</pre>
          </div>
          <div class="flex gap-3">
            <button onclick="window.location.href='/agents'" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded transition-colors">
              View My Agents
            </button>
            <button onclick="this.closest('.fixed').remove()" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Auto-redirect after 10 seconds
    setTimeout(() => {
      window.location.href = '/agents';
    }, 5000);
  };

  const generateAgentResponse = async (userMessage: string): Promise<ChatMessage> => {
    try {
      const openaiResponse = await fetch('/api/chat/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: userMessage,
          tools: tools,
          conversationHistory: messages.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content }))
        })
      });

      if (openaiResponse.ok) {
        const result = await openaiResponse.json();
        
        return {
          id: Date.now().toString(),
          type: 'bot',
          content: result.response,
          timestamp: new Date(),
          suggestions: result.suggestions,
          showCreateButton: result.readyToCreate || false,
          agentData: result.agentData || {
            name: "Discord GPT Agent",
            description: "AI agent that connects Discord to GPT for intelligent responses",
            tools: userMessage.toLowerCase().includes('discord') ? [...tools, "Discord", "OpenAI"] : tools,
            systemPrompt: "You are a helpful AI assistant."
          }
        };
      } else {
        throw new Error('OpenAI API failed');
      }
    } catch (error) {
      console.error('Error with OpenAI response:', error);
      return generateFallbackResponse(userMessage);
    }
  };

  const generateFallbackResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('customer support') || lowerMessage.includes('help desk')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I can help you design a Customer Support Agent! To create the best agent, I need to know more. What specific customer support tasks should it handle?",
        timestamp: new Date(),
        suggestions: [
          "Handle ticket routing and responses",
          "Integrate with Slack and email",
          "Escalate complex issues to humans",
          "Provide 24/7 basic support"
        ],
        showCreateButton: true,
        agentData: {
          name: "Customer Support Agent",
          description: "Handles customer inquiries and support requests",
          tools: tools,
          systemPrompt: "You are a helpful customer support agent."
        }
      };
    }

    if (lowerMessage.includes('discord') && lowerMessage.includes('gpt')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Perfect! I understand you want to create an agent that connects Discord to GPT. Let me gather some details:\n\n• What specific tasks should this agent perform in Discord?\n• Should it respond to all messages or only when mentioned?\n• Any specific channels or permissions needed?",
        timestamp: new Date(),
        suggestions: [
          "Answer questions in Discord channels",
          "Moderate conversations",
          "Create automated responses",
          "Generate content for Discord"
        ],
        showCreateButton: true,
        agentData: {
          name: "Discord GPT Bot",
          description: "AI-powered Discord bot that connects to GPT for intelligent responses",
          tools: [...tools, "Discord", "OpenAI"],
          systemPrompt: "You are a helpful Discord bot that uses GPT to provide intelligent responses to users."
        }
      };
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: "I'm here to help you create an AI agent. Please tell me what kind of agent you'd like to build and what it should do.",
      timestamp: new Date(),
      suggestions: [
        "Create a customer support agent",
        "Build a data analysis agent", 
        "Make a content creation agent",
        "Design a scheduling assistant"
      ]
    };
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || currentMessage.trim();
    if (!text) return;

    // Auto-detect and add tools mentioned in the message
    const lowerText = text.toLowerCase();
    const detectedTools: string[] = [];
    
    commonTools.forEach(tool => {
      if (lowerText.includes(tool.name.toLowerCase()) && !tools.includes(tool.name)) {
        detectedTools.push(tool.name);
      }
    });
    
    if (detectedTools.length > 0) {
      setTools(prev => [...prev, ...detectedTools]);
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const botResponse = await generateAgentResponse(text);
      setMessages(prev => [...prev, botResponse]);
      
      if (botResponse.agentConfig) {
        onAgentGenerated(botResponse.agentConfig);
      }
    } catch (error) {
      toast({
        title: "Chat Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <MessageCircle className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-white">AI Agent Creation Assistant</h3>
          <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">BETA</Badge>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto mb-4 space-y-4 bg-black/20 rounded-lg p-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-emerald-600/20 text-emerald-100' : 'bg-gray-700/50 text-gray-200'} rounded-lg p-3`}>
                <div className="flex items-center space-x-2 mb-2">
                  {message.type === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="text-xs text-gray-400">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
                
                {(message.agentConfig || message.agentData) && (
                  <div className="mt-3">
                    <button
                      onClick={() => message.agentConfig ? onAgentGenerated(message.agentConfig) : handleCreateAgent(message)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <span>Create Agent Now</span>
                    </button>
                  </div>
                )}

                {message.showCreateButton && !message.agentConfig && !message.agentData && (
                  <div className="mt-3">
                    <button
                      onClick={() => handleCreateAgent(message)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <span>Create Agent Now</span>
                    </button>
                  </div>
                )}
                
                {message.suggestions && (
                  <div className="mt-3 space-y-1">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left text-xs bg-gray-600/30 hover:bg-gray-600/50 rounded px-2 py-1 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Tools Selection */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            Tools & Integrations
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {tools.map((tool) => {
              const toolData = commonTools.find(t => t.name === tool);
              return (
                <div key={tool} className={`bg-black/40 backdrop-blur-sm border ${toolData?.borderColor || 'border-gray-400'} hover:bg-black/60 rounded-lg px-3 py-2 transition-all flex items-center space-x-2`}>
                  <img 
                    src={toolData?.logo} 
                    alt={tool} 
                    className="w-4 h-4 object-contain filter invert"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className={`text-sm font-medium ${toolData?.textColor || 'text-gray-300'}`}>{tool}</span>
                  <button onClick={() => removeTool(tool)} className="ml-1 hover:bg-red-500/20 rounded p-0.5">
                    <X className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {commonTools.filter(tool => !tools.includes(tool.name)).map((tool) => (
              <button
                key={tool.name}
                onClick={() => addTool(tool.name)}
                className={`bg-black/30 backdrop-blur-sm border ${tool.borderColor} hover:bg-black/50 hover:scale-105 rounded-lg px-3 py-2 transition-all duration-200 flex items-center space-x-2 group`}
              >
                <img 
                  src={tool.logo} 
                  alt={tool.name} 
                  className="w-4 h-4 object-contain group-hover:scale-110 transition-transform filter invert"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className={`text-sm font-medium ${tool.textColor}`}>{tool.name}</span>
                <Plus className={`w-3 h-3 ${tool.textColor} opacity-60 group-hover:opacity-100`} />
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex space-x-2">
          <Input
            placeholder="Describe what you want your agent to do..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="flex-1 bg-gray-800/50 border-gray-600"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={() => handleSendMessage()}
            disabled={!currentMessage.trim() || isLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Quick Starters */}
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">Quick starters:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSuggestionClick("I want to create a customer support agent")}
              className="text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded px-2 py-1 transition-colors"
            >
              Customer Support
            </button>
            <button
              onClick={() => handleSuggestionClick("I need a data analysis agent")}
              className="text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded px-2 py-1 transition-colors"
            >
              Data Analysis
            </button>
            <button
              onClick={() => handleSuggestionClick("I want a content writing agent")}
              className="text-xs bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 rounded px-2 py-1 transition-colors"
            >
              Content Creation
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}