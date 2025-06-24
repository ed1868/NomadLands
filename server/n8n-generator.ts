import { Agent } from "@shared/schema";
import { randomUUID } from "crypto";

export interface N8nWorkflowNode {
  parameters: Record<string, any>;
  type: string;
  typeVersion: number;
  position: [number, number];
  id: string;
  name: string;
  credentials?: Record<string, any>;
  webhookId?: string;
}

export interface N8nWorkflow {
  name: string;
  nodes: N8nWorkflowNode[];
  connections: Record<string, any>;
  pinData: Record<string, any>;
  meta: {
    templateCredsSetupCompleted: boolean;
    instanceId: string;
  };
}

// Tool configurations for different integrations
const TOOL_CONFIGS = {
  gmail: {
    type: "n8n-nodes-base.gmailTool",
    typeVersion: 2.1,
    parameters: { options: {} },
    credentials: {
      gmailOAuth2: {
        id: "gmail-auth",
        name: "Gmail OAuth2"
      }
    }
  },
  slack: {
    type: "@n8n/n8n-nodes-langchain.toolSlack",
    typeVersion: 1,
    parameters: { options: {} },
    credentials: {
      slackOAuth2Api: {
        id: "slack-auth",
        name: "Slack OAuth2"
      }
    }
  },
  notion: {
    type: "@n8n/n8n-nodes-langchain.toolNotion",
    typeVersion: 1,
    parameters: { options: {} },
    credentials: {
      notionApi: {
        id: "notion-auth",
        name: "Notion API"
      }
    }
  },
  github: {
    type: "@n8n/n8n-nodes-langchain.toolGitHub",
    typeVersion: 1,
    parameters: { options: {} },
    credentials: {
      githubApi: {
        id: "github-auth",
        name: "GitHub API"
      }
    }
  },
  trello: {
    type: "@n8n/n8n-nodes-langchain.toolTrello",
    typeVersion: 1,
    parameters: { options: {} },
    credentials: {
      trelloApi: {
        id: "trello-auth",
        name: "Trello API"
      }
    }
  },
  calendar: {
    type: "@n8n/n8n-nodes-langchain.toolGoogleCalendar",
    typeVersion: 1,
    parameters: { options: {} },
    credentials: {
      googleCalendarOAuth2Api: {
        id: "calendar-auth",
        name: "Google Calendar OAuth2"
      }
    }
  },
  sheets: {
    type: "@n8n/n8n-nodes-langchain.toolGoogleSheets",
    typeVersion: 1,
    parameters: { options: {} },
    credentials: {
      googleSheetsOAuth2Api: {
        id: "sheets-auth",
        name: "Google Sheets OAuth2"
      }
    }
  },
  zapier: {
    type: "@n8n/n8n-nodes-langchain.toolZapier",
    typeVersion: 1,
    parameters: { options: {} },
    credentials: {
      zapierApi: {
        id: "zapier-auth",
        name: "Zapier API"
      }
    }
  },
  salesforce: {
    type: "@n8n/n8n-nodes-langchain.toolSalesforce",
    typeVersion: 1,
    parameters: { options: {} },
    credentials: {
      salesforceOAuth2Api: {
        id: "salesforce-auth",
        name: "Salesforce OAuth2"
      }
    }
  },
  hubspot: {
    type: "@n8n/n8n-nodes-langchain.toolHubSpot",
    typeVersion: 1,
    parameters: { options: {} },
    credentials: {
      hubspotApi: {
        id: "hubspot-auth",
        name: "HubSpot API"
      }
    }
  },
  "web-search": {
    type: "@n8n/n8n-nodes-langchain.toolHttpRequest",
    typeVersion: 1.1,
    parameters: {
      toolDescription: "Use this tool to search the internet",
      method: "POST",
      url: "https://api.tavily.com/search",
      sendBody: true,
      specifyBody: "json",
      jsonBody: JSON.stringify({
        api_key: "{tavilyApiKey}",
        query: "{searchTerm}",
        search_depth: "basic",
        include_answer: true,
        topic: "news",
        include_raw_content: true,
        max_results: 3
      }),
      placeholderDefinitions: {
        values: [
          {
            name: "searchTerm",
            description: "What the user has requested to search the internet for",
            type: "string"
          },
          {
            name: "tavilyApiKey",
            description: "Tavily API key for web search",
            type: "string"
          }
        ]
      }
    }
  }
};

export class N8nWorkflowGenerator {
  private generateNodeId(): string {
    return randomUUID();
  }

  private createChatTrigger(): N8nWorkflowNode {
    return {
      parameters: { options: {} },
      type: "@n8n/n8n-nodes-langchain.chatTrigger",
      typeVersion: 1.1,
      position: [-500, 20],
      id: this.generateNodeId(),
      name: "When chat message received",
      webhookId: this.generateNodeId()
    };
  }

  private createLanguageModel(aiModel: string): N8nWorkflowNode {
    const modelConfigs = {
      "gpt-4o": {
        type: "@n8n/n8n-nodes-langchain.lmChatOpenAi",
        model: "gpt-4o",
        credentials: "openAiApi"
      },
      "claude-3-sonnet": {
        type: "@n8n/n8n-nodes-langchain.lmChatAnthropic",
        model: "claude-3-sonnet-20240229",
        credentials: "anthropicApi"
      },
      "gemini-pro": {
        type: "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
        model: "gemini-pro",
        credentials: "googleGeminiApi"
      }
    };

    const config = modelConfigs[aiModel] || modelConfigs["gpt-4o"];

    return {
      parameters: {
        model: {
          __rl: true,
          value: config.model,
          mode: "list"
        },
        options: {}
      },
      type: config.type,
      typeVersion: 1.2,
      position: [140, 220],
      id: this.generateNodeId(),
      name: "Language Model",
      credentials: {
        [config.credentials]: {
          id: "auth-id",
          name: "Auth Account"
        }
      }
    };
  }

  private createMemoryNode(): N8nWorkflowNode {
    return {
      parameters: {},
      type: "@n8n/n8n-nodes-langchain.memoryBufferWindow",
      typeVersion: 1.3,
      position: [260, 220],
      id: this.generateNodeId(),
      name: "Simple Memory"
    };
  }

  private createOutputParser(): N8nWorkflowNode {
    return {
      parameters: {
        schemaType: "manual",
        inputSchema: JSON.stringify({
          type: "object",
          properties: {
            response: {
              type: "string",
              description: "The agent's response to the user"
            },
            actions: {
              type: "array",
              items: {
                type: "string"
              },
              description: "List of actions taken by the agent"
            }
          },
          required: ["response"]
        })
      },
      type: "@n8n/n8n-nodes-langchain.outputParserStructured",
      typeVersion: 1.2,
      position: [640, 220],
      id: this.generateNodeId(),
      name: "Structured Output Parser"
    };
  }

  private createAgentNode(agent: Agent): N8nWorkflowNode {
    const systemMessage = agent.systemPrompt || `You are ${agent.name}, ${agent.description}. 
    
Response time: ${agent.responseTime || 'standard'}
Usage volume: ${agent.usageVolume || 'medium'}  
Error handling: ${agent.errorHandling || 'graceful fallback'}
Availability: ${agent.availability || 'business hours'}

Please provide helpful, accurate responses based on your capabilities and the tools available to you.`;

    return {
      parameters: {
        promptType: "define",
        text: "{{ $json.chatInput }}",
        hasOutputParser: true,
        options: {
          systemMessage: systemMessage
        }
      },
      type: "@n8n/n8n-nodes-langchain.agent",
      typeVersion: 2,
      position: [220, 0],
      id: this.generateNodeId(),
      name: agent.name
    };
  }

  private createToolNodes(tools: string[]): N8nWorkflowNode[] {
    const toolNodes: N8nWorkflowNode[] = [];
    let yOffset = 220;

    tools.forEach((toolName, index) => {
      const config = TOOL_CONFIGS[toolName.toLowerCase()];
      if (config) {
        const toolNode: N8nWorkflowNode = {
          parameters: config.parameters,
          type: config.type,
          typeVersion: config.typeVersion,
          position: [380 + (index * 120), yOffset + (index * 40)],
          id: this.generateNodeId(),
          name: toolName.charAt(0).toUpperCase() + toolName.slice(1)
        };

        if (config.credentials) {
          toolNode.credentials = config.credentials;
        }

        if (config.type.includes("HttpRequest")) {
          toolNode.webhookId = this.generateNodeId();
        }

        toolNodes.push(toolNode);
      }
    });

    return toolNodes;
  }

  private createConnections(nodes: N8nWorkflowNode[]): Record<string, any> {
    const connections: Record<string, any> = {};
    
    // Find key nodes
    const agentNode = nodes.find(n => n.type === "@n8n/n8n-nodes-langchain.agent");
    const languageModelNode = nodes.find(n => n.type.includes("lmChat"));
    const memoryNode = nodes.find(n => n.type === "@n8n/n8n-nodes-langchain.memoryBufferWindow");
    const outputParserNode = nodes.find(n => n.type === "@n8n/n8n-nodes-langchain.outputParserStructured");
    const triggerNode = nodes.find(n => n.type === "@n8n/n8n-nodes-langchain.chatTrigger");
    const toolNodes = nodes.filter(n => 
      n.type.includes("Tool") || n.type.includes("tool") || n.type.includes("gmail") || n.type.includes("HttpRequest")
    );

    if (!agentNode) return connections;

    // Connect trigger to agent
    if (triggerNode) {
      connections[triggerNode.name] = {
        main: [[{
          node: agentNode.name,
          type: "main",
          index: 0
        }]]
      };
    }

    // Connect language model to agent
    if (languageModelNode) {
      connections[languageModelNode.name] = {
        ai_languageModel: [[{
          node: agentNode.name,
          type: "ai_languageModel",
          index: 0
        }]]
      };
    }

    // Connect memory to agent
    if (memoryNode) {
      connections[memoryNode.name] = {
        ai_memory: [[{
          node: agentNode.name,
          type: "ai_memory",
          index: 0
        }]]
      };
    }

    // Connect output parser to agent
    if (outputParserNode) {
      connections[outputParserNode.name] = {
        ai_outputParser: [[{
          node: agentNode.name,
          type: "ai_outputParser",
          index: 0
        }]]
      };
    }

    // Connect tools to agent
    toolNodes.forEach(toolNode => {
      connections[toolNode.name] = {
        ai_tool: [[{
          node: agentNode.name,
          type: "ai_tool",
          index: 0
        }]]
      };
    });

    return connections;
  }

  public generateWorkflow(agent: Agent): N8nWorkflow {
    const nodes: N8nWorkflowNode[] = [];

    // Add core nodes
    nodes.push(this.createChatTrigger());
    nodes.push(this.createAgentNode(agent));
    nodes.push(this.createLanguageModel(agent.aiModel || "gpt-4o"));
    nodes.push(this.createMemoryNode());
    nodes.push(this.createOutputParser());

    // Add tool nodes
    if (agent.tools && agent.tools.length > 0) {
      const toolNodes = this.createToolNodes(agent.tools);
      nodes.push(...toolNodes);
    }

    // Create connections
    const connections = this.createConnections(nodes);

    return {
      name: `${agent.name} Workflow`,
      nodes: nodes,
      connections: connections,
      pinData: {},
      meta: {
        templateCredsSetupCompleted: true,
        instanceId: this.generateNodeId()
      }
    };
  }
}