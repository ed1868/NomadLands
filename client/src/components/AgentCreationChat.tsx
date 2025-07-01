import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Send,
  Bot,
  User,
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
      borderColor: "border-gray-400",
      textColor: "text-gray-300"
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
    },
    { 
      name: "Trello", 
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/trello.svg",
      borderColor: "border-blue-400",
      textColor: "text-blue-300"
    },
    { 
      name: "GitHub", 
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg",
      borderColor: "border-gray-400",
      textColor: "text-gray-300"
    }
  ];

  const addTool = (toolName: string) => {
    if (!tools.includes(toolName)) {
      setTools([...tools, toolName]);
    }
  };

  const removeTool = (toolName: string) => {
    setTools(tools.filter(tool => tool !== toolName));
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

      // Then create the dual agent (n8n + python)
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
        
        toast({
          title: "🎉 Agent Created Successfully!",
          description: "Your AI agent has been created with both n8n and Python implementations. Check your agents page!",
        });
        
        onAgentGenerated(dualAgentData);
        showSuccessMessage();
      } else {
        throw new Error('Failed to create dual agent');
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: "❌ Creation Failed",
        description: "There was an error creating your agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessMessage = () => {
    const successMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'bot',
      content: "🎉 Great! Your AI agent has been successfully created and deployed. You'll be redirected to your agents page shortly where you can manage and test your new agent.",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, successMessage]);
    
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

      if (!openaiResponse.ok) {
        throw new Error('Failed to get response');
      }

      const data = await openaiResponse.json();
      
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions,
        agentConfig: data.agentConfig,
        showCreateButton: data.showCreateButton,
        agentData: data.agentData
      };
    } catch (error) {
      console.error('Error generating response:', error);
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I'm having trouble processing that right now. Could you try rephrasing your request?",
        timestamp: new Date()
      };
    }
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
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black border border-gray-800 rounded-xl overflow-hidden">
      {/* Clean header */}
      <div className="bg-gray-900/50 border-b border-gray-800 px-6 py-4">
        <h2 className="text-lg font-medium text-white">AI Agent Creator</h2>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.type === 'bot' && (
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-lg ${message.type === 'user' ? 'order-first' : ''}`}>
              <div className={`p-4 rounded-xl ${
                message.type === 'user' 
                  ? 'bg-emerald-600 text-white ml-auto' 
                  : 'bg-gray-900 text-gray-100 border border-gray-800'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>

              {/* Action buttons for bot messages */}
              {message.type === 'bot' && message.showCreateButton && (
                <div className="mt-3">
                  <Button
                    onClick={() => handleCreateAgent(message)}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 hover:from-emerald-600/30 hover:to-blue-600/30 border border-emerald-500/30 hover:border-emerald-400/50 text-emerald-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    🚀 Create Agent
                  </Button>
                </div>
              )}

              {/* Suggestions */}
              {message.type === 'bot' && message.suggestions && (
                <div className="mt-3 space-y-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left text-sm bg-gray-700/30 hover:bg-gray-600/40 border border-gray-600/50 hover:border-gray-500/50 rounded-lg px-3 py-2 text-gray-300 hover:text-white transition-all duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {message.type === 'user' && (
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Selected tools display */}
      {tools.length > 0 && (
        <div className="px-6 py-3 bg-gray-900/30 border-t border-gray-800">
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => {
              const toolData = commonTools.find(t => t.name === tool);
              return (
                <div key={tool} className="flex items-center gap-2 bg-emerald-600/10 border border-emerald-600/20 rounded-lg px-3 py-1.5">
                  <span className="text-xs text-emerald-400">{tool}</span>
                  <button 
                    onClick={() => removeTool(tool)} 
                    className="hover:bg-red-500/20 rounded p-0.5"
                  >
                    <X className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tools selection */}
      <div className="px-6 py-4 bg-gray-900/30 border-t border-gray-800">
        <p className="text-sm text-gray-400 mb-3">Add integrations:</p>
        <div className="grid grid-cols-4 gap-3">
          {commonTools.filter(tool => !tools.includes(tool.name)).slice(0, 8).map((tool, index) => {
            const colors = [
              { bg: 'bg-emerald-500/20', border: 'border-emerald-400/30', text: 'text-emerald-300', hoverBg: 'hover:bg-emerald-500/30', hoverBorder: 'hover:border-emerald-400/50' },
              { bg: 'bg-blue-500/20', border: 'border-blue-400/30', text: 'text-blue-300', hoverBg: 'hover:bg-blue-500/30', hoverBorder: 'hover:border-blue-400/50' },
              { bg: 'bg-purple-500/20', border: 'border-purple-400/30', text: 'text-purple-300', hoverBg: 'hover:bg-purple-500/30', hoverBorder: 'hover:border-purple-400/50' },
              { bg: 'bg-orange-500/20', border: 'border-orange-400/30', text: 'text-orange-300', hoverBg: 'hover:bg-orange-500/30', hoverBorder: 'hover:border-orange-400/50' },
              { bg: 'bg-red-500/20', border: 'border-red-400/30', text: 'text-red-300', hoverBg: 'hover:bg-red-500/30', hoverBorder: 'hover:border-red-400/50' },
              { bg: 'bg-yellow-500/20', border: 'border-yellow-400/30', text: 'text-yellow-300', hoverBg: 'hover:bg-yellow-500/30', hoverBorder: 'hover:border-yellow-400/50' },
              { bg: 'bg-pink-500/20', border: 'border-pink-400/30', text: 'text-pink-300', hoverBg: 'hover:bg-pink-500/30', hoverBorder: 'hover:border-pink-400/50' },
              { bg: 'bg-indigo-500/20', border: 'border-indigo-400/30', text: 'text-indigo-300', hoverBg: 'hover:bg-indigo-500/30', hoverBorder: 'hover:border-indigo-400/50' }
            ];
            const colorScheme = colors[index % colors.length];
            
            return (
              <button
                key={tool.name}
                onClick={() => addTool(tool.name)}
                className={`${colorScheme.bg} ${colorScheme.hoverBg} border ${colorScheme.border} ${colorScheme.hoverBorder} rounded-lg p-3 flex flex-col items-center gap-2 transition-all duration-200 group hover:scale-105 shadow-lg hover:shadow-xl`}
              >
                <img 
                  src={tool.logo} 
                  alt={tool.name} 
                  className="w-5 h-5 filter invert opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className={`text-xs ${colorScheme.text} group-hover:text-white transition-colors`}>{tool.name}</span>
              </button>
            );
          })}
        </div>
        
        {/* Quick starter buttons */}
        <div className="mt-4 pt-3 border-t border-gray-700/30">
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

      {/* Input area */}
      <div className="p-6 bg-gray-900/30 border-t border-gray-800">
        <div className="flex gap-3">
          <Input
            placeholder="Describe what you want your agent to do..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="flex-1 bg-gray-800 border-gray-700 focus:border-emerald-500 text-white placeholder-gray-400"
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          />
          <Button 
            onClick={() => handleSendMessage()}
            disabled={!currentMessage.trim() || isLoading}
            className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 hover:from-emerald-600/30 hover:to-blue-600/30 border border-emerald-500/30 hover:border-emerald-400/50 text-emerald-300 hover:text-white px-4 transition-all duration-200 hover:scale-105"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}