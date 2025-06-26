import OpenAI from "openai";

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
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private getAgentCreationSystemPrompt(): string {
    return `You are an AI agent creation assistant. Your goal is to help users create powerful AI agents by gathering essential information through natural conversation.

CORE OBJECTIVES:
1. Gather agent name, description, and required tools
2. Understand the user's specific use case and workflow needs  
3. Suggest relevant tools when appropriate
4. Create a fine-tuned system prompt for the final agent

AVAILABLE TOOLS TO SUGGEST:
- gmail, outlook (email management)
- slack, discord, teams (communication)
- github, gitlab, bitbucket (code repositories)
- salesforce, hubspot, pipedrive (CRM)
- stripe, paypal, quickbooks (payments/finance)
- zoom, google-meet (meetings)
- notion, airtable, trello (productivity)
- twitter, instagram, linkedin (social media)
- aws, azure, gcp (cloud platforms)
- web-search, tavily (web research)

CONVERSATION STYLE:
- Be concise and focused
- Ask specific, actionable questions
- Suggest tools based on the user's workflow
- Don't overwhelm with options
- Guide toward a clear agent definition

RESPONSE FORMAT:
Always respond in JSON with this structure:
{
  "message": "Your conversational response",
  "suggestedTools": ["tool1", "tool2"] (only when relevant),
  "readyToCreate": false (true when you have enough info),
  "agentData": {
    "name": "Agent Name",
    "description": "Clear description", 
    "category": "productivity|marketing|development|analytics|support|sales",
    "tools": ["selected", "tools"],
    "fineTunedPrompt": "Detailed system prompt for the agent"
  }
}`;
  }

  async generateAgentResponse(request: AgentConversationRequest) {
    try {
      const messages = [
        {
          role: "system" as const,
          content: this.getAgentCreationSystemPrompt()
        },
        ...request.conversationHistory.map(msg => ({
          role: msg.role as "user" | "assistant", 
          content: msg.content
        })),
        {
          role: "user" as const,
          content: request.message
        }
      ];

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages,
        max_tokens: 1500,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0].message.content || "{}";
      
      try {
        const parsedResponse = JSON.parse(responseText);
        
        // Ensure the response has the expected structure
        return {
          message: parsedResponse.message || "I'd be happy to help you create an AI agent. What kind of tasks do you want to automate?",
          suggestedTools: parsedResponse.suggestedTools || [],
          readyToCreate: parsedResponse.readyToCreate || false,
          agentData: parsedResponse.agentData || null
        };
      } catch (parseError) {
        console.error("Failed to parse OpenAI JSON response:", parseError);
        return {
          message: "I'd be happy to help you create an AI agent. What kind of tasks do you want to automate?",
          suggestedTools: [],
          readyToCreate: false,
          agentData: null
        };
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to generate agent response");
    }
  }

  async generateWorkflow(agentData: AgentData, tools: string[], conversationHistory: Array<{ role: string; content: string }>) {
    try {
      const systemPrompt = `You are an AI workflow generator for n8n. Create a comprehensive n8n workflow based on the provided agent data and conversation context.

Generate a workflow with proper nodes and connections for the agent:
- Agent: ${agentData.name}
- Description: ${agentData.description}
- Tools: ${tools.join(', ')}
- Conversation: ${conversationHistory.map(m => m.content).join(' ')}

Respond with a structure including agent details and n8nWorkflow configuration.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Create an n8n workflow for: ${agentData.name} - ${agentData.description}` }
        ],
        max_tokens: 2000,
        temperature: 0.3
      });

      return {
        agent: agentData,
        n8nWorkflow: {
          name: agentData.name || "AI Agent Workflow",
          nodes: [],
          connections: {},
          meta: { templateCredsSetupCompleted: true }
        },
        fineTunedPrompt: `You are ${agentData.name}. ${agentData.description}. Use the following tools when appropriate: ${tools.join(', ')}.`
      };
    } catch (error) {
      console.error("Error generating workflow:", error);
      throw new Error("Failed to generate workflow");
    }
  }
}

export const openaiChatService = new OpenAIChatService();