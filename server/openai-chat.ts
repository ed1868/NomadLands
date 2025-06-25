import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AgentConversationRequest {
  message: string;
  tools: string[];
  conversationHistory: Array<{ role: string; content: string }>;
}

export interface AgentData {
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

export class OpenAIChatService {
  
  async generateAgentResponse(request: AgentConversationRequest) {
    try {
      const systemPrompt = `You are an AI assistant helping users create custom AI agents for n8n workflows. Your job is to:

1. Ask intelligent follow-up questions to gather complete agent requirements
2. Extract agent details like name, description, tools needed, behavior, use case, target audience
3. When you have enough information, indicate readiness to create the agent
4. Provide helpful suggestions for the user

Key information to gather:
- Agent name and description
- Specific use case and target audience  
- Required tools and integrations
- Desired behavior and response style
- System prompt requirements

Respond in a conversational, helpful manner. When you have sufficient details, set readyToCreate: true in your response.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...request.conversationHistory.slice(-10), // Last 10 messages for context
        { role: "user", content: request.message }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: messages as any,
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        response: result.response || "I'm here to help you create your AI agent. Could you tell me more about what you'd like it to do?",
        suggestions: result.suggestions || [],
        readyToCreate: result.readyToCreate || false,
        agentData: result.agentData || null
      };
      
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate response');
    }
  }

  async generateWorkflow(agentData: AgentData, tools: string[], conversationHistory: Array<{ role: string; content: string }>) {
    try {
      const systemPrompt = `You are an expert at creating n8n workflows for AI agents. Generate a comprehensive n8n workflow structure based on the agent requirements.

Create a detailed JSON structure with:
1. Agent details (name, description, category, tools, systemPrompt)
2. Complete n8n workflow with proper nodes and connections
3. Optimized system prompts for the specific use case
4. Proper tool configurations for n8n

The workflow should include Chat Trigger, AI Agent, Memory, and any tool-specific nodes.`;

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create an n8n workflow for this agent:
Agent Data: ${JSON.stringify(agentData, null, 2)}
Selected Tools: ${tools.join(', ')}
Conversation Context: ${conversationHistory.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')}

Respond with a complete JSON structure including agent details and n8nWorkflow.` }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: messages as any,
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 2000
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        agent: result.agent || {
          name: agentData.name || 'AI Assistant',
          description: agentData.description || 'A helpful AI assistant',
          category: agentData.category || 'general',
          tools: tools,
          aiModel: 'gpt-4o',
          systemPrompt: agentData.systemPrompt || 'You are a helpful AI assistant.'
        },
        n8nWorkflow: result.n8nWorkflow || this.getDefaultWorkflow(agentData, tools)
      };
      
    } catch (error) {
      console.error('OpenAI workflow generation error:', error);
      // Return default structure if OpenAI fails
      return {
        agent: {
          name: agentData.name || 'AI Assistant',
          description: agentData.description || 'A helpful AI assistant',
          category: agentData.category || 'general',
          tools: tools,
          aiModel: 'gpt-4o',
          systemPrompt: agentData.systemPrompt || 'You are a helpful AI assistant.'
        },
        n8nWorkflow: this.getDefaultWorkflow(agentData, tools)
      };
    }
  }

  private getDefaultWorkflow(agentData: AgentData, tools: string[]) {
    return {
      name: `${agentData.name || 'AI Assistant'} Workflow`,
      nodes: [
        {
          id: 'chat-trigger',
          name: 'Chat Trigger',
          type: '@n8n/n8n-nodes-langchain.chatTrigger',
          position: [300, 300],
          parameters: {
            public: true,
            mode: 'chat'
          }
        },
        {
          id: 'ai-agent',
          name: 'AI Agent',
          type: '@n8n/n8n-nodes-langchain.agent',
          position: [600, 300],
          parameters: {
            agent: 'conversationalAgent',
            systemMessage: agentData.systemPrompt || 'You are a helpful AI assistant.',
            maxIterations: 10,
            tools: tools.map(tool => ({
              name: tool.toLowerCase().replace(/\s+/g, '-'),
              description: `Integration with ${tool}`,
              type: 'custom'
            }))
          }
        },
        {
          id: 'memory',
          name: 'Memory',
          type: '@n8n/n8n-nodes-langchain.memoryBufferWindow',
          position: [600, 500],
          parameters: {
            sessionIdType: 'fromInput',
            k: 10
          }
        }
      ],
      connections: {
        'Chat Trigger': {
          main: [[{node: 'AI Agent', type: 'main', index: 0}]]
        },
        'Memory': {
          ai_memory: [[{node: 'AI Agent', type: 'ai_memory', index: 0}]]
        }
      }
    };
  }
}

export const openaiChatService = new OpenAIChatService();