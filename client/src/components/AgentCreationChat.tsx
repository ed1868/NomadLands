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
  optimizedPrompt?: string;
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
      
      // First generate the workflow data for n8n
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

      // Create dual agent implementation (n8n + Python using Claude)
      const dualAgentResponse = await fetch('/api/chat/create-dual-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          agentData: workflowData.agent,
          conversationHistory: messages.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content }))
        })
      });

      if (dualAgentResponse.ok) {
        const dualAgentData = await dualAgentResponse.json();
        console.log('Dual agent created successfully:', dualAgentData);
        
        // Show enhanced success popup with both implementations
        showAgentApprovalPopup({
          action: 'create_dual_agent_workflow',
          timestamp: new Date().toISOString(),
          user: 'ai-nomads-user',
          agent: dualAgentData.agent,
          implementations: dualAgentData.implementations,
          n8nWorkflow: workflowData.n8nWorkflow,
          message: dualAgentData.message
        });
        return; // Exit early for successful dual agent creation
      } else {
        console.warn('Dual agent creation failed, falling back to n8n only');
      }
      
      const webhookUrl = 'https://ainomads.app.n8n.cloud/webhook-test/3a205bcf-f96f-452a-b53f-a94866ad2062';
      
      const n8nWorkflowData = {
        action: 'create_agent_workflow',
        timestamp: new Date().toISOString(),
        user: 'ai-nomads-user',
        agent: workflowData.agent,
        n8nWorkflow: workflowData.n8nWorkflow
      };

      try {
        const webhookResult = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(n8nWorkflowData)
        });

        console.log('Webhook response status:', webhookResult.status);
        console.log('Webhook response ok:', webhookResult.ok);
        
        if (webhookResult.ok) {
          const webhookResponseData = await webhookResult.json();
          console.log('Webhook success response:', webhookResponseData);
        } else {
          const errorText = await webhookResult.text();
          console.warn('Webhook not ready (n8n workflow needs to be executed):', errorText);
          
          // Show user-friendly message about n8n setup
          toast({
            title: "Webhook Setup Required",
            description: "Please activate your n8n workflow first, then try again.",
            variant: "default"
          });
        }
      } catch (webhookError) {
        console.warn('Webhook error (n8n not ready):', webhookError);
        
        // Show user-friendly message about n8n setup
        toast({
          title: "Webhook Setup Required", 
          description: "Please activate your n8n workflow, then try again.",
          variant: "default"
        });
      }
      
      // Always show success popup since agent was created successfully
      showAgentApprovalPopup(n8nWorkflowData);
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
    <div className="w-full max-w-4xl mx-auto bg-gray-900/40 border border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 px-4 sm:px-6 py-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Agent Creator</h3>
              <p className="text-xs text-gray-400">Build your custom automation assistant</p>
            </div>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30">
            BETA
          </Badge>
        </div>
      </div>

      <div className="flex flex-col h-[600px] sm:h-[700px]">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[75%] ${
                message.type === 'user' 
                  ? 'bg-emerald-600/20 border border-emerald-500/30' 
                  : 'bg-gray-800/50 border border-gray-600/50'
              } rounded-2xl p-4 backdrop-blur-sm`}>
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-emerald-500/20' 
                      : 'bg-blue-500/20'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Bot className="w-3 h-3 text-blue-400" />
                    )}
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {message.type === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">{message.content}</p>
                
                {/* Action Buttons */}
                {(message.agentConfig || message.agentData) && (
                  <div className="mt-4">
                    <button
                      onClick={() => message.agentConfig ? onAgentGenerated(message.agentConfig) : handleCreateAgent(message)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white px-4 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      🚀 Create Agent Now
                    </button>
                  </div>
                )}

                {message.showCreateButton && !message.agentConfig && !message.agentData && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleCreateAgent(message)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white px-4 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      🚀 Create Agent Now
                    </button>
                  </div>
                )}
                
                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-gray-400 font-medium">Try these:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-left text-sm bg-gray-700/30 hover:bg-gray-600/40 border border-gray-600/50 hover:border-gray-500/50 rounded-lg px-3 py-2 transition-all duration-200 text-gray-300 hover:text-white"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Loading Animation */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800/50 border border-gray-600/50 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-blue-400" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-xs text-gray-400">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Tools Section - Collapsible on Mobile */}
        {tools.length > 0 && (
          <div className="border-t border-gray-700/50 px-4 sm:px-6 py-3 bg-gray-900/20">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">
                Selected Tools ({tools.length})
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => {
                const toolData = commonTools.find(t => t.name === tool);
                return (
                  <div key={tool} className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-1.5 flex items-center space-x-2">
                    <img 
                      src={toolData?.logo} 
                      alt={tool} 
                      className="w-4 h-4 object-contain filter invert"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="text-sm font-medium text-emerald-300">{tool}</span>
                    <button 
                      onClick={() => removeTool(tool)} 
                      className="hover:bg-red-500/20 rounded p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Tools */}
        <div className="border-t border-gray-700/50 px-4 sm:px-6 py-3 bg-gray-900/10">
          <label className="text-sm font-medium text-gray-300 mb-3 block">
            Add Tools & Integrations
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {commonTools.filter(tool => !tools.includes(tool.name)).slice(0, 12).map((tool) => (
              <button
                key={tool.name}
                onClick={() => addTool(tool.name)}
                className="bg-gray-800/30 hover:bg-gray-700/40 border border-gray-600/30 hover:border-gray-500/50 rounded-lg p-2 transition-all duration-200 flex flex-col items-center space-y-1 group"
              >
                <img 
                  src={tool.logo} 
                  alt={tool.name} 
                  className="w-5 h-5 object-contain group-hover:scale-110 transition-transform filter invert"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-xs font-medium text-gray-400 group-hover:text-white text-center leading-tight">
                  {tool.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700/50 px-4 sm:px-6 py-4 bg-gray-900/20">
          <div className="flex space-x-3">
            <div className="flex-1">
              <Input
                placeholder="Describe your agent idea... (e.g., 'Create a customer support agent that handles refunds')"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="bg-gray-800/50 border-gray-600/50 focus:border-emerald-500/50 text-white placeholder-gray-400 rounded-xl h-12"
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              />
            </div>
            <Button 
              onClick={() => handleSendMessage()}
              disabled={!currentMessage.trim() || isLoading}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 rounded-xl h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Quick Starters */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Quick starters:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSuggestionClick("I want to create a customer support agent")}
                className="text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg px-3 py-1.5 transition-all duration-200 hover:scale-105"
              >
                📞 Customer Support
              </button>
              <button
                onClick={() => handleSuggestionClick("I need a data analysis agent")}
                className="text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-lg px-3 py-1.5 transition-all duration-200 hover:scale-105"
              >
                📊 Data Analysis
              </button>
              <button
                onClick={() => handleSuggestionClick("I want a content writing agent")}
                className="text-xs bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 rounded-lg px-3 py-1.5 transition-all duration-200 hover:scale-105"
              >
                ✍️ Content Creation
              </button>
              <button
                onClick={() => handleSuggestionClick("I need a scheduling assistant agent")}
                className="text-xs bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30 rounded-lg px-3 py-1.5 transition-all duration-200 hover:scale-105"
              >
                📅 Scheduling
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}