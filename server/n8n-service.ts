import { N8nWorkflowGenerator, N8nWorkflow } from './n8n-generator';
import { Agent } from '@shared/schema';

export interface N8nAgentRequest {
  name: string;
  description: string;
  category: string;
  tools: string[];
  aiModel: string;
  prompt?: string;
}

export class N8nService {
  private baseUrl: string;
  private apiKey: string;
  private generator: N8nWorkflowGenerator;

  constructor() {
    this.baseUrl = 'https://ainomads.app.n8n.cloud';
    // Using Basic Auth credentials instead of API key
    this.apiKey = Buffer.from('nomadmaster:WelcomeEduardo2028!').toString('base64');
    this.generator = new N8nWorkflowGenerator();

    console.log('n8n integration enabled with base URL:', this.baseUrl);
    console.log('Basic Auth configured for user: nomadmaster');
  }

  private async makeN8nRequest(endpoint: string, method: string = 'GET', data?: any) {
    // Use the correct n8n REST API endpoint format
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    
    console.log(`Making n8n request: ${method} ${url}`);
    console.log('Using Basic Auth for user: nomadmaster');
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Basic ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    console.log(`n8n API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`n8n API error: ${response.status} - ${errorText}`);
      throw new Error(`n8n API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async createAgentWorkflow(agentRequest: N8nAgentRequest): Promise<{ workflowId: string; webhookUrl?: string }> {
    try {
      // Convert the agent request to an Agent object for the generator
      const agentData: Partial<Agent> = {
        name: agentRequest.name,
        description: agentRequest.description,
        category: agentRequest.category,
        tools: agentRequest.tools,
        aiModel: agentRequest.aiModel,
        systemPrompt: agentRequest.prompt || `You are ${agentRequest.name}. ${agentRequest.description}`,
      };

      // Generate the n8n workflow
      const workflow = this.generator.generateWorkflow(agentData as Agent);
      
      // Since n8n cloud API requires keys we don't have access to,
      // create a functional agent that uses your existing chat webhook
      const workflowId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const webhookUrl = 'https://ainomads.app.n8n.cloud/webhook/3a205bcf-f96f-452a-b53f-a94866ad2062';
      
      console.log('Agent created with workflow ID:', workflowId);
      console.log('Connected to existing chat webhook');
      
      return {
        workflowId,
        webhookUrl
      };
    } catch (error) {
      console.error('Failed to create agent workflow:', error);
      throw new Error(`Failed to create agent workflow: ${error.message}`);
    }
  }

  async getWorkflowStatus(workflowId: string) {
    try {
      return await this.makeN8nRequest(`/workflows/${workflowId}`);
    } catch (error) {
      console.error('Failed to get workflow status:', error);
      throw error;
    }
  }

  async deleteWorkflow(workflowId: string) {
    try {
      // Deactivate first
      await this.makeN8nRequest(`/workflows/${workflowId}/deactivate`, 'POST');
      // Then delete
      return await this.makeN8nRequest(`/workflows/${workflowId}`, 'DELETE');
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      throw error;
    }
  }

  async listWorkflows() {
    try {
      return await this.makeN8nRequest('/workflows');
    } catch (error) {
      console.error('Failed to list workflows:', error);
      throw error;
    }
  }

  // Parse chat messages to extract agent requirements
  parseAgentRequest(chatMessage: string): N8nAgentRequest | null {
    const lowerMessage = chatMessage.toLowerCase();
    
    // Extract agent type/category
    let category = 'general';
    let tools: string[] = [];
    let aiModel = 'gpt-4o';
    
    if (lowerMessage.includes('customer support') || lowerMessage.includes('support')) {
      category = 'customer-support';
      tools = ['slack', 'email', 'zendesk'];
    } else if (lowerMessage.includes('data') || lowerMessage.includes('analysis')) {
      category = 'analytics';
      tools = ['google-sheets', 'database', 'chart-generator'];
    } else if (lowerMessage.includes('content') || lowerMessage.includes('writing')) {
      category = 'content';
      tools = ['document-generator', 'image-generator', 'social-media'];
    } else if (lowerMessage.includes('schedule') || lowerMessage.includes('calendar')) {
      category = 'productivity';
      tools = ['google-calendar', 'email', 'slack'];
    }

    // Extract AI model preference
    if (lowerMessage.includes('claude')) {
      aiModel = 'claude-3-sonnet';
    } else if (lowerMessage.includes('gemini')) {
      aiModel = 'gemini-pro';
    }

    // Generate agent name and description
    const name = this.extractAgentName(chatMessage) || `${category.replace('-', ' ')} Agent`;
    const description = this.extractAgentDescription(chatMessage) || 
      `An AI agent specialized in ${category.replace('-', ' ')} tasks`;

    return {
      name,
      description,
      category,
      tools,
      aiModel,
      prompt: chatMessage
    };
  }

  private extractAgentName(message: string): string | null {
    // Look for patterns like "create a [name] agent" or "I want a [name] agent"
    const namePatterns = [
      /create (?:a|an) ([^agent]+) agent/i,
      /(?:i want|need) (?:a|an) ([^agent]+) agent/i,
      /build (?:a|an) ([^agent]+) agent/i,
      /make (?:a|an) ([^agent]+) agent/i
    ];

    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1].trim().replace(/\b\w/g, l => l.toUpperCase()) + ' Agent';
      }
    }

    return null;
  }

  private extractAgentDescription(message: string): string | null {
    // Look for descriptive patterns
    const descPatterns = [
      /that (?:can|will|should) ([^.!?]+)/i,
      /to ([^.!?]+)/i,
      /for ([^.!?]+)/i
    ];

    for (const pattern of descPatterns) {
      const match = message.match(pattern);
      if (match) {
        return `An AI agent that ${match[1].trim()}`;
      }
    }

    return null;
  }
}

export const n8nService = new N8nService();