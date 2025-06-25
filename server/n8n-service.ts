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
    // Force the credentials for now since environment variables aren't working
    this.baseUrl = 'https://ainomads.app.n8n.cloud';
    this.apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNmQ4MGI3MC04NTE2LTQ2Yzg0ZS0xYWQ2M2ZzMTY5MGYiLCJpc3MiOiJuOG4iLCJhdWJsaW11cXAiOiJwaWFwIiwiaWF0IjoxNjUwODM0ODM0fQ.UngN_hAQmWjAswoEuz4iu-eZLNivIL8RNHKa644uDS8';
    this.generator = new N8nWorkflowGenerator();

    console.log('n8n integration enabled with base URL:', this.baseUrl);
    console.log('API key configured:', this.apiKey ? 'Yes' : 'No');
  }

  private async makeN8nRequest(endpoint: string, method: string = 'GET', data?: any) {
    // Use the correct n8n REST API endpoint format
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    
    console.log(`Making n8n request: ${method} ${url}`);
    console.log('Using API key:', this.apiKey.substring(0, 20) + '...');
    
    const response = await fetch(url, {
      method,
      headers: {
        'X-N8N-API-KEY': this.apiKey,
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
      
      // Create the workflow in n8n
      const workflowResponse = await this.makeN8nRequest('/workflows', 'POST', {
        name: workflow.name,
        nodes: workflow.nodes,
        connections: workflow.connections,
        settings: {
          executionOrder: 'v1'
        },
        pinData: workflow.pinData,
        meta: workflow.meta
      });

      // Activate the workflow
      await this.makeN8nRequest(`/workflows/${workflowResponse.id}/activate`, 'POST');

      // Extract webhook URL if chat trigger exists
      let webhookUrl = undefined;
      const chatTrigger = workflow.nodes.find(node => 
        node.type === '@n8n/n8n-nodes-langchain.chatTrigger'
      );
      
      if (chatTrigger) {
        webhookUrl = `${this.baseUrl}/webhook-test/${chatTrigger.webhookId}`;
      }

      return {
        workflowId: workflowResponse.id,
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