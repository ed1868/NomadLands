import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Send, 
  Bot, 
  User, 
  Loader2,
  Zap,
  X
} from "lucide-react";

export default function AgentCreationChat() {
  const [inputMessage, setInputMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [agentData, setAgentData] = useState<any>(null);
  const [webhookResponse, setWebhookResponse] = useState<any>(null);
  const [showCreateButton, setShowCreateButton] = useState(false);
  const [suggestedTools, setSuggestedTools] = useState<string[]>([]);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationHistory]);

  // Initial conversation starter
  useEffect(() => {
    if (conversationHistory.length === 0) {
      setConversationHistory([
        {
          role: "assistant",
          content: "Hi! I'm here to help you create a custom AI agent. What kind of tasks would you like to automate?"
        }
      ]);
    }
  }, []);

  // Tool detection function
  const detectToolsInMessage = (message: string): string[] => {
    const availableTools = [
      "gmail", "outlook", "slack", "discord", "teams", "github", "gitlab", 
      "bitbucket", "salesforce", "hubspot", "pipedrive", "stripe", "paypal", 
      "quickbooks", "zoom", "google-meet", "notion", "airtable", "trello",
      "twitter", "instagram", "linkedin", "aws", "azure", "gcp", "web-search", "tavily"
    ];
    
    const lowerMessage = message.toLowerCase();
    return availableTools.filter(tool => 
      lowerMessage.includes(tool.toLowerCase()) || 
      lowerMessage.includes(tool.replace("-", " "))
    );
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    
    // Add user message to conversation
    const newConversationHistory = [
      ...conversationHistory,
      { role: "user", content: userMessage }
    ];
    setConversationHistory(newConversationHistory);
    setIsLoading(true);

    try {
      // Detect tools mentioned in the message
      const detectedTools = detectToolsInMessage(userMessage);
      const allTools = Array.from(new Set([...tools, ...detectedTools]));
      setTools(allTools);

      const response = await apiRequest("POST", "/api/chat/openai", {
        message: userMessage,
        tools: allTools,
        conversationHistory: newConversationHistory
      });

      // Add assistant response to conversation
      const updatedHistory = [
        ...newConversationHistory,
        { role: "assistant", content: response.message }
      ];
      setConversationHistory(updatedHistory);

      // Handle suggested tools
      if (response.suggestedTools && response.suggestedTools.length > 0) {
        setSuggestedTools(response.suggestedTools.filter((tool: string) => !allTools.includes(tool)));
      }

      // Check if agent is ready to create
      if (response.readyToCreate && response.agentData) {
        setAgentData(response.agentData);
        setShowCreateButton(true);
        // Clear suggested tools when ready to create
        setSuggestedTools([]);
      }

    } catch (error) {
      console.error("Error sending message:", error);
      setConversationHistory(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const createAgent = async () => {
    if (!agentData) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/chat/create-agent", {
        agentData: agentData,
        fineTunedPrompt: agentData.fineTunedPrompt
      });

      if (response.success) {
        setWebhookResponse({
          workflowId: response.workflowId,
          webhookUrl: response.webhookUrl,
          fineTunedPrompt: response.fineTunedPrompt
        });
        setShowSuccessPopup(true);
      }
    } catch (error) {
      console.error("Error creating agent:", error);
      setConversationHistory(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error while creating your agent. Please try again." }
      ]);
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

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">AI Agent Creation Assistant</h3>
              <span className="px-2 py-1 bg-emerald-900/30 text-emerald-300 text-xs rounded border border-emerald-800/50">
                BETA
              </span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-black/20">
            {conversationHistory.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user" 
                    ? "bg-emerald-600/20 text-emerald-100" 
                    : "bg-gray-700/50 text-gray-200"
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {message.role === "user" ? (
                      <User className="h-3 w-3" />
                    ) : (
                      <Bot className="h-3 w-3 text-emerald-400" />
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700/50 text-gray-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-3 w-3 text-emerald-400" />
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Tools */}
          {suggestedTools.length > 0 && (
            <div className="border-t border-gray-800 p-4">
              <p className="text-sm text-gray-300 mb-2">Suggested tools:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTools.map((tool: string) => (
                  <button
                    key={tool}
                    onClick={() => {
                      if (!tools.includes(tool)) {
                        setTools([...tools, tool]);
                      }
                      setSuggestedTools(prev => prev.filter(t => t !== tool));
                    }}
                    className="px-3 py-1 bg-blue-900/30 text-blue-300 text-sm rounded border border-blue-800/50 hover:bg-blue-800/40 transition-colors"
                  >
                    + {tool}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Create Agent Button */}
          {showCreateButton && (
            <div className="border-t border-gray-800 p-4">
              <Button
                onClick={createAgent}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Creating Agent...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
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
          <div className="border-t border-gray-800 p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe what you want your agent to do..."
                className="flex-1 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-emerald-500"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4"
              >
                <Send className="h-4 w-4" />
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
                    // Reset chat state
                    setMessages([]);
                    setAgentData(null);
                    setTools([]);
                    setSuggestedTools([]);
                    setShowCreateButton(false);
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