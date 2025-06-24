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

interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  agentConfig?: any;
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
    { name: "Google Sheets", icon: "📊", color: "bg-green-500" },
    { name: "Gmail", icon: "📧", color: "bg-red-500" },
    { name: "Slack", icon: "💬", color: "bg-purple-500" },
    { name: "Discord", icon: "🎮", color: "bg-indigo-500" },
    { name: "OpenAI", icon: "🤖", color: "bg-emerald-500" },
    { name: "Telegram", icon: "📱", color: "bg-blue-500" },
    { name: "MySQL", icon: "🗄️", color: "bg-orange-500" },
    { name: "PostgreSQL", icon: "🐘", color: "bg-blue-600" },
    { name: "AWS S3", icon: "☁️", color: "bg-yellow-500" },
    { name: "Notion", icon: "📝", color: "bg-gray-600" },
    { name: "Google Calendar", icon: "📅", color: "bg-blue-500" },
    { name: "Airtable", icon: "📋", color: "bg-orange-400" },
    { name: "Stripe", icon: "💳", color: "bg-purple-600" },
    { name: "Webhooks", icon: "🔗", color: "bg-gray-500" },
    { name: "HTTP Request", icon: "🌐", color: "bg-green-600" },
    { name: "File Storage", icon: "📁", color: "bg-blue-400" }
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

  const generateAgentResponse = async (userMessage: string): Promise<ChatMessage> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('customer support') || lowerMessage.includes('help desk')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Great! A customer support agent. I'll help you set this up. What specific tasks should it handle?",
        timestamp: new Date(),
        suggestions: [
          "Answer FAQs automatically",
          "Escalate complex issues to humans", 
          "Track customer satisfaction",
          "Generate support tickets"
        ]
      };
    }

    if (lowerMessage.includes('data') || lowerMessage.includes('analysis')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Perfect! A data analysis agent. What type of data will it work with?",
        timestamp: new Date(),
        suggestions: [
          "Sales and revenue data",
          "Customer behavior analytics",
          "Social media metrics",
          "Financial reports"
        ]
      };
    }

    if (lowerMessage.includes('content') || lowerMessage.includes('writing')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Excellent! A content creation agent. What kind of content should it generate?",
        timestamp: new Date(),
        suggestions: [
          "Blog posts and articles",
          "Social media content",
          "Email newsletters", 
          "Product descriptions"
        ]
      };
    }

    if (lowerMessage.includes('schedule') || lowerMessage.includes('calendar')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "A scheduling assistant! What scheduling tasks should it handle?",
        timestamp: new Date(),
        suggestions: [
          "Book meetings automatically",
          "Send calendar reminders",
          "Find optimal meeting times",
          "Manage time zones"
        ]
      };
    }

    if (lowerMessage.includes('ready') || lowerMessage.includes('create') || lowerMessage.includes('build')) {
      const agentConfig = {
        name: "Custom AI Agent",
        description: "Generated from chat conversation",
        category: "Custom",
        aiModel: "gpt-4o",
        tools: tools,
        pricing: 0.05,
        accessType: "public"
      };

      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Perfect! I've generated your agent configuration. You can review and deploy it using the form below.",
        timestamp: new Date(),
        agentConfig: agentConfig
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
            {tools.map((tool) => (
              <Badge key={tool} className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 flex items-center">
                <span className="mr-1">{commonTools.find(t => t.name === tool)?.icon || "🔧"}</span>
                {tool}
                <button onClick={() => removeTool(tool)} className="ml-1">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {commonTools.filter(tool => !tools.includes(tool.name)).slice(0, 8).map((tool) => (
              <button
                key={tool.name}
                onClick={() => addTool(tool.name)}
                className={`text-xs hover:opacity-80 rounded px-3 py-1.5 transition-all text-white flex items-center space-x-1 ${tool.color}`}
              >
                <span>{tool.icon}</span>
                <span>{tool.name}</span>
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Add custom tool..."
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              className="flex-1 bg-gray-800/50 border-gray-600"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newTool.trim()) {
                  addTool(newTool.trim());
                  setNewTool('');
                }
              }}
            />
            <Button 
              size="sm" 
              onClick={() => {
                if (newTool.trim()) {
                  addTool(newTool.trim());
                  setNewTool('');
                }
              }}
              className="bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30"
            >
              Add
            </Button>
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
      </CardContent>
    </Card>
  );
}