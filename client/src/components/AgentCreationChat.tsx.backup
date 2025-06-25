import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Code, 
  Upload, 
  Link,
  Wand2,
  MessageCircle,
  Plus,
  X
} from "lucide-react";

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
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
  const [newTool, setNewTool] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const commonTools = [
    { 
      name: "Google Sheets", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg",
      borderColor: "border-green-400",
      textColor: "text-green-300"
    },
    { 
      name: "Gmail", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
      borderColor: "border-red-400",
      textColor: "text-red-300"
    },
    { 
      name: "Slack", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
      borderColor: "border-purple-400",
      textColor: "text-purple-300"
    },
    { 
      name: "Discord", 
      logo: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg",
      borderColor: "border-indigo-400",
      textColor: "text-indigo-300"
    },
    { 
      name: "OpenAI", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
      borderColor: "border-emerald-400",
      textColor: "text-emerald-300"
    },
    { 
      name: "Telegram", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",
      borderColor: "border-blue-400",
      textColor: "text-blue-300"
    },
    { 
      name: "MySQL", 
      logo: "https://upload.wikimedia.org/wikipedia/en/d/dd/MySQL_logo.svg",
      borderColor: "border-orange-400",
      textColor: "text-orange-300"
    },
    { 
      name: "PostgreSQL", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg",
      borderColor: "border-blue-400",
      textColor: "text-blue-300"
    },
    { 
      name: "AWS S3", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Amazon-S3-Logo.svg",
      borderColor: "border-yellow-400",
      textColor: "text-yellow-300"
    },
    { 
      name: "Notion", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
      borderColor: "border-gray-400",
      textColor: "text-gray-300"
    },
    { 
      name: "Google Calendar", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg",
      borderColor: "border-blue-400",
      textColor: "text-blue-300"
    },
    { 
      name: "Airtable", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg",
      borderColor: "border-orange-400",
      textColor: "text-orange-300"
    },
    { 
      name: "Stripe", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
      borderColor: "border-purple-400",
      textColor: "text-purple-300"
    },
    { 
      name: "Webhooks", 
      logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBzdHJva2U9IiM2Mzc5ODEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=",
      borderColor: "border-gray-400",
      textColor: "text-gray-300"
    },
    { 
      name: "HTTP Request", 
      logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEyQzIxIDEzLjEgMjAuMSAxNCAyMCAxNEgxNFYyMEM0IDE5IDQgMTcgMTQgN0gyMEMyMSA3IDIxIDEwLjkgMjEgMTJaIiBzdHJva2U9IiM0QUY0RjQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=",
      borderColor: "border-cyan-400",
      textColor: "text-cyan-300"
    },
    { 
      name: "File Storage", 
      logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzIDJINkM0LjkgMiA0IDIuOSA0IDRWMJDNC40IDIwIDIwIDIwSDhDMTkuMSAyMCAyMCAxOS4xIDIwIDE4VjlMMTMgMloiIHN0cm9rZT0iIzM5RDNGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEzIDJWOUgyMCIgc3Ryb2tlPSIjMzlEM0ZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K",
      borderColor: "border-blue-400",
      textColor: "text-blue-300"
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
      // Use OpenAI to generate the complete workflow structure
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
      
      // Send comprehensive n8n workflow structure to webhook
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
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: `🎉 Agent workflow created successfully!\n\nWorkflow Details:\n• Name: ${n8nWorkflowData.agent.name}\n• Description: ${n8nWorkflowData.agent.description}\n• Tools: ${n8nWorkflowData.agent.tools?.join(', ') || 'None'}\n• AI Model: ${n8nWorkflowData.agent.aiModel}\n• System Prompt: ${n8nWorkflowData.agent.systemPrompt?.substring(0, 100)}...\n\nYour n8n workflow is now ready!`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }
    } catch (error) {
      console.error('Error creating agent workflow:', error);
    }
  };

  const extractAgentName = (content: string): string => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('customer support')) return 'Customer Support Agent';
    if (lowerContent.includes('data analysis')) return 'Data Analysis Agent';
    if (lowerContent.includes('content') || lowerContent.includes('writing')) return 'Content Creation Agent';
    if (lowerContent.includes('schedule') || lowerContent.includes('calendar')) return 'Scheduling Assistant';
    return 'AI Assistant';
  };

  const extractCategory = (content: string): string => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('customer') || lowerContent.includes('support')) return 'customer-support';
    if (lowerContent.includes('data') || lowerContent.includes('analysis')) return 'data-analysis';
    if (lowerContent.includes('content') || lowerContent.includes('writing')) return 'content-creation';
    if (lowerContent.includes('schedule') || lowerContent.includes('calendar')) return 'productivity';
    return 'general';
  };

  const getDefaultTools = (content: string): string[] => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('customer') || lowerContent.includes('support')) {
      return ['Slack', 'Gmail', 'Zendesk'];
    }
    if (lowerContent.includes('data') || lowerContent.includes('analysis')) {
      return ['Google Sheets', 'PostgreSQL', 'OpenAI'];
    }
    if (lowerContent.includes('content') || lowerContent.includes('writing')) {
      return ['OpenAI', 'Google Docs', 'Notion'];
    }
    if (lowerContent.includes('schedule') || lowerContent.includes('calendar')) {
      return ['Google Calendar', 'Gmail', 'Slack'];
    }
    return ['OpenAI', 'Gmail'];
  };

  const generateSystemPrompt = (content: string, tools: string[]): string => {
    const lowerContent = content.toLowerCase();
    let basePrompt = `You are an AI assistant created to help users with their tasks. `;
    
    if (lowerContent.includes('customer') || lowerContent.includes('support')) {
      basePrompt += `You specialize in customer support and help resolve customer inquiries professionally and efficiently. You have access to support tools and can escalate issues when needed.`;
    } else if (lowerContent.includes('data') || lowerContent.includes('analysis')) {
      basePrompt += `You specialize in data analysis and can help users understand their data, create reports, and generate insights from various data sources.`;
    } else if (lowerContent.includes('content') || lowerContent.includes('writing')) {
      basePrompt += `You specialize in content creation and can help write, edit, and optimize various types of content including articles, emails, and marketing materials.`;
    } else if (lowerContent.includes('schedule') || lowerContent.includes('calendar')) {
      basePrompt += `You specialize in scheduling and productivity, helping users manage their time, schedule meetings, and organize their workflow efficiently.`;
    }

    if (tools.length > 0) {
      basePrompt += `\n\nAvailable tools: ${tools.join(', ')}. Use these tools when appropriate to help users accomplish their goals.`;
    }

    return basePrompt;
  };

  const generateN8nTools = (tools: string[]): any[] => {
    return tools.map(tool => {
      const toolName = tool.toLowerCase().replace(/\s+/g, '-');
      return {
        name: toolName,
        description: `Integration with ${tool}`,
        type: 'custom'
      };
    });
  };

  const generateAgentResponse = async (userMessage: string): Promise<ChatMessage> => {
    try {
      // Use OpenAI to generate intelligent responses and gather agent requirements
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
          agentData: result.agentData || null
        };
      } else {
        throw new Error('OpenAI API failed');
      }
    } catch (error) {
      console.error('Error with OpenAI response:', error);
      // Fallback to simple responses
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
        ]
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

    if (lowerMessage.includes('data') || lowerMessage.includes('analysis')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Perfect! A data analysis agent. What's your data volume and update frequency?",
        timestamp: new Date(),
        suggestions: [
          "Process daily sales reports",
          "Real-time dashboard updates",
          "Weekly performance summaries",
          "Monthly trend analysis"
        ]
      };
    }

    if (lowerMessage.includes('content') || lowerMessage.includes('writing')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Excellent! What's your target audience and content tone?",
        timestamp: new Date(),
        suggestions: [
          "Professional B2B audience",
          "Casual social media tone",
          "Technical documentation style",
          "Marketing copy with CTAs"
        ]
      };
    }

    if (lowerMessage.includes('schedule') || lowerMessage.includes('calendar')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "A scheduling assistant! What are your availability constraints and meeting preferences?",
        timestamp: new Date(),
        suggestions: [
          "Only weekdays 9-5 EST",
          "Buffer 15 minutes between meetings",
          "Prefer video calls over phone",
          "Block focus time automatically"
        ]
      };
    }

    if (lowerMessage.includes('response time') || lowerMessage.includes('30 seconds') || lowerMessage.includes('daily') || lowerMessage.includes('professional') || lowerMessage.includes('weekdays')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Good! Now, what's your expected usage volume and budget range?",
        timestamp: new Date(),
        suggestions: [
          "Low volume: <100 calls/day",
          "Medium volume: 100-1000 calls/day", 
          "High volume: >1000 calls/day",
          "Budget: $0.01-0.10 per call"
        ]
      };
    }

    if (lowerMessage.includes('volume') || lowerMessage.includes('budget') || lowerMessage.includes('calls') || lowerMessage.includes('0.0')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Almost done! What error handling and fallback behavior do you need?",
        timestamp: new Date(),
        suggestions: [
          "Graceful degradation with retries",
          "Human handoff for failures",
          "Log all errors for debugging",
          "Send alerts for critical issues"
        ]
      };
    }

    if (lowerMessage.includes('error') || lowerMessage.includes('fallback') || lowerMessage.includes('handoff') || lowerMessage.includes('ready') || lowerMessage.includes('create') || lowerMessage.includes('build') || lowerMessage.includes('deploy')) {
      const agentConfig = {
        name: "Custom AI Agent",
        description: "Generated from comprehensive chat conversation with specific requirements",
        category: "Custom",
        aiModel: "gpt-4o",
        tools: tools,
        pricing: 0.05,
        accessType: "public"
      };

      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Perfect! I've captured all your requirements. Your agent is configured for your specific use case, volume, and error handling needs. Ready to deploy!",
        timestamp: new Date(),
        agentConfig: agentConfig,
        showCreateButton: true
      };
    }

    // Generic response
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: "That sounds interesting! Can you tell me more about the specific tasks this agent should perform?",
      timestamp: new Date(),
      suggestions: [
        "It should automate repetitive tasks",
        "It needs to interact with customers",
        "It should analyze data and reports",
        "It will create content and documents"
      ]
    };
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || currentMessage.trim();
    if (!text) return;

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
                
                {message.agentConfig && (
                  <div className="mt-3">
                    <button
                      onClick={() => onAgentGenerated(message.agentConfig)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      Review & Deploy Agent
                    </button>
                  </div>
                )}

                {message.showCreateButton && (
                  <div className="mt-3">
                    <button
                      onClick={() => handleCreateAgent(message)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <span>🚀 Create Agent Now</span>
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
                    className="w-4 h-4 object-contain"
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
                  className="w-4 h-4 object-contain group-hover:scale-110 transition-transform"
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
            placeholder="Describe what you want your agent to do... (try: 'I want to create a customer support agent')"
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
            <button
              onClick={() => handleSuggestionClick("I need a scheduling assistant")}
              className="text-xs bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30 rounded px-2 py-1 transition-colors"
            >
              Scheduling
            </button>
            <button
              onClick={() => handleSuggestionClick("I'm ready to create my agent")}
              disabled={tools.length === 0}
              className="text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded px-2 py-1 transition-colors disabled:opacity-50"
            >
              {tools.length > 0 ? "Create Now" : "Select tools first"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}