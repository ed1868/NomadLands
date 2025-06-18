import { useState } from "react";
import { Code, Copy, ExternalLink, Book, Zap, Shield, Terminal, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/navigation";

export default function ApiDocs() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("list-agents");

  // Agent API Endpoints
  const agentEndpoints = [
    {
      id: "list-agents",
      method: "GET",
      path: "/api/agents",
      description: "Retrieve all available AI agents with filtering options",
      params: "?category=productivity&featured=true&limit=20",
      response: `{
  "agents": [
    {
      "id": 7,
      "name": "Jira Project Manager Agent",
      "description": "Advanced project management with real-time Jira integration",
      "category": "productivity",
      "price": 89,
      "priceInWei": "89000000000000000000",
      "features": ["Task Automation", "Sprint Planning", "Issue Tracking"],
      "icon": "Activity",
      "gradientFrom": "#3b82f6",
      "gradientTo": "#1d4ed8",
      "featured": true,
      "rating": 4.9,
      "totalRuns": 15423,
      "status": "active"
    }
  ],
  "total": 847,
  "page": 1,
  "limit": 20
}`
    },
    {
      id: "get-agent",
      method: "GET",
      path: "/api/agents/{id}",
      description: "Get detailed information about a specific agent",
      response: `{
  "id": 7,
  "name": "Jira Project Manager Agent",
  "description": "Advanced project management with real-time Jira integration",
  "category": "productivity",
  "price": 89,
  "features": ["Task Automation", "Sprint Planning", "Issue Tracking"],
  "documentation": "https://docs.ainomads.com/agents/jira",
  "owner": "0x742d35Cc6635C0532925a3b8D359e16FA1000001",
  "created_at": "2025-06-01T10:00:00Z",
  "usage_stats": {
    "total_runs": 15423,
    "success_rate": 98.7,
    "avg_execution_time": "2.3s"
  }
}`
    },
    {
      id: "hire-agent",
      method: "POST",
      path: "/api/agents/{id}/hire",
      description: "Hire an agent for a specific task execution",
      request: `{
  "task_description": "Analyze sprint performance and generate report",
  "input_data": {
    "jira_project": "PROJ-123",
    "sprint_id": "sprint-456"
  },
  "payment_method": "crypto",
  "wallet_address": "0x742d35Cc6635C0532925a3b8D359e16FA1000001"
}`,
      response: `{
  "hire_id": "hire_789",
  "agent_id": 7,
  "status": "pending_payment",
  "estimated_cost": "0.089 ETH",
  "execution_time": "5-10 minutes",
  "payment_address": "0x742d35Cc6635C0532925a3b8D359e16FA1000002"
}`
    },
    {
      id: "agent-status",
      method: "GET",
      path: "/api/hires/{hire_id}/status",
      description: "Check the status of a hired agent task",
      response: `{
  "hire_id": "hire_789",
  "status": "completed",
  "progress": 100,
  "result": {
    "report_url": "https://storage.ainomads.com/reports/sprint-analysis-456.pdf",
    "key_metrics": {
      "velocity": 42,
      "burndown_completion": 98.5,
      "story_points_delivered": 89
    }
  },
  "execution_time": "7.2 minutes",
  "cost": "0.089 ETH"
}`
    },
    {
      id: "agent-categories",
      method: "GET",
      path: "/api/agents/categories",
      description: "Get all available agent categories and tags",
      response: `{
  "categories": [
    {
      "name": "productivity",
      "count": 287,
      "description": "Agents for workflow automation and productivity enhancement"
    },
    {
      "name": "content",
      "count": 198,
      "description": "Content creation and management agents"
    }
  ],
  "tags": [
    {
      "id": 1,
      "name": "Productivity",
      "slug": "productivity",
      "agent_count": 287
    }
  ]
}`
    }
  ];

  // Smart Contract API Endpoints
  const contractEndpoints = [
    {
      id: "list-contracts",
      method: "GET",
      path: "/api/smart-contracts",
      description: "Retrieve all available smart contracts",
      params: "?category=core&verified=true",
      response: `{
  "contracts": [
    {
      "id": 1,
      "name": "AgentRegistry.sol",
      "description": "Central registry for all AI agents with metadata and pricing",
      "category": "Core Infrastructure",
      "contract_address": "0x742d35Cc6635C0532925a3b8D359e16FA1000001",
      "abi": [...],
      "verified": true,
      "gas_estimate": 65000,
      "tax_percentage": 100,
      "features": ["Agent Registration", "Metadata Storage", "Owner Verification"]
    }
  ]
}`
    },
    {
      id: "deploy-contract",
      method: "POST",
      path: "/api/smart-contracts/{id}/deploy",
      description: "Deploy a smart contract to the blockchain",
      request: `{
  "network": "ethereum",
  "constructor_params": {
    "owner": "0x742d35Cc6635C0532925a3b8D359e16FA1000001",
    "initial_fee": "1000000000000000"
  },
  "gas_limit": 500000
}`,
      response: `{
  "deployment_id": "deploy_contract_123",
  "transaction_hash": "0x1234567890abcdef...",
  "contract_address": "0x987654321fedcba...",
  "status": "pending",
  "gas_used": 485000
}`
    },
    {
      id: "interact-contract",
      method: "POST",
      path: "/api/smart-contracts/{address}/interact",
      description: "Interact with a deployed smart contract",
      request: `{
  "function_name": "registerAgent",
  "params": [
    "Email Automation Agent",
    "Advanced email processing and automation",
    "productivity",
    "50000000000000000000"
  ],
  "from_address": "0x742d35Cc6635C0532925a3b8D359e16FA1000001",
  "gas_limit": 200000
}`,
      response: `{
  "transaction_hash": "0xabcdef1234567890...",
  "status": "pending",
  "estimated_confirmation": "2-3 minutes",
  "gas_used": 185000
}`
    },
    {
      id: "contract-events",
      method: "GET",
      path: "/api/smart-contracts/{address}/events",
      description: "Get events emitted by a smart contract",
      params: "?from_block=18500000&event=AgentRegistered",
      response: `{
  "events": [
    {
      "event": "AgentRegistered",
      "block_number": 18500123,
      "transaction_hash": "0xdef123456789abc...",
      "args": {
        "agentId": 25,
        "owner": "0x742d35Cc6635C0532925a3b8D359e16FA1000001",
        "name": "Email Automation Agent",
        "price": "50000000000000000000"
      },
      "timestamp": "2025-06-18T10:30:00Z"
    }
  ]
}`
    }
  ];

  // SDK Documentation
  const sdkDocs = {
    javascript: {
      installation: `npm install @ainomads/sdk ethers`,
      initialization: `import { AINomadsSDK } from '@ainomads/sdk';
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const sdk = new AINomadsSDK({
  provider,
  signer,
  apiKey: 'your-api-key',
  network: 'ethereum'
});`,
      examples: [
        {
          title: "List Available Agents",
          code: `// Get all agents in productivity category
const agents = await sdk.agents.list({
  category: 'productivity',
  featured: true,
  limit: 10
});

console.log('Available agents:', agents);`
        },
        {
          title: "Hire an Agent",
          code: `// Hire an agent for a specific task
const hire = await sdk.agents.hire(7, {
  taskDescription: 'Analyze my inbox and categorize emails',
  inputData: {
    email_account: 'user@company.com',
    folders: ['inbox', 'sent']
  }
});

console.log('Agent hired:', hire.hire_id);`
        },
        {
          title: "Deploy Smart Contract",
          code: `// Deploy AgentRegistry contract
const deployment = await sdk.contracts.deploy('AgentRegistry', {
  owner: await signer.getAddress(),
  initialFee: ethers.parseEther('0.001')
});

await deployment.wait();
console.log('Contract deployed at:', deployment.contractAddress);`
        },
        {
          title: "Register New Agent",
          code: `// Register a new agent on the blockchain
const tx = await sdk.contracts.interact(
  'AgentRegistry',
  'registerAgent',
  [
    'My Custom Agent',
    'Description of agent capabilities',
    'automation',
    ethers.parseEther('25')
  ]
);

await tx.wait();
console.log('Agent registered!');`
        }
      ]
    },
    python: {
      installation: `pip install ainomads-sdk web3`,
      initialization: `from ainomads_sdk import AINomadsSDK
from web3 import Web3

# Connect to Ethereum network
w3 = Web3(Web3.HTTPProvider('https://eth-mainnet.alchemyapi.io/v2/your-key'))

sdk = AINomadsSDK(
    web3=w3,
    api_key='your-api-key',
    private_key='your-private-key'
)`,
      examples: [
        {
          title: "Search and Filter Agents",
          code: `# Search for content creation agents
agents = sdk.agents.search(
    query='content creation',
    category='content',
    min_rating=4.5,
    max_price=100
)

for agent in agents:
    print(f"{agent['name']}: {agent['rating']}/5 - " + str(agent['price']))`
        },
        {
          title: "Monitor Agent Execution",
          code: `# Hire agent and monitor progress
hire = sdk.agents.hire(
    agent_id=15,
    task_data={
        'input_text': 'Create a blog post about AI trends',
        'word_count': 1000,
        'tone': 'professional'
    }
)

# Poll for completion
while True:
    status = sdk.agents.get_status(hire['hire_id'])
    print(f"Progress: {status['progress']}%")
    
    if status['status'] == 'completed':
        print("Task completed!")
        print("Result:", status['result'])
        break
    
    time.sleep(10)`
        }
      ]
    },
    curl: {
      examples: [
        {
          title: "Authentication",
          code: `# Set your API key
export API_KEY="your-api-key-here"

# All requests require authentication header
curl -H "Authorization: Bearer $API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.ainomads.com/api/agents`
        },
        {
          title: "List Agents with Filtering",
          code: `# Get productivity agents sorted by rating
curl -H "Authorization: Bearer $API_KEY" \\
     "https://api.ainomads.com/api/agents?category=productivity&sort=rating&order=desc&limit=5"`
        },
        {
          title: "Hire Agent for Task",
          code: `# Hire agent for email processing
curl -X POST \\
     -H "Authorization: Bearer $API_KEY" \\
     -H "Content-Type: application/json" \\
     -d '{
       "task_description": "Process and categorize my emails",
       "input_data": {
         "email_provider": "gmail",
         "account": "user@company.com"
       },
       "payment_method": "crypto"
     }' \\
     https://api.ainomads.com/api/agents/7/hire`
        },
        {
          title: "Deploy Smart Contract",
          code: `# Deploy AgentRegistry contract
curl -X POST \\
     -H "Authorization: Bearer $API_KEY" \\
     -H "Content-Type: application/json" \\
     -d '{
       "network": "ethereum",
       "constructor_params": {
         "owner": "0x742d35Cc6635C0532925a3b8D359e16FA1000001",
         "initial_fee": "1000000000000000"
       },
       "gas_limit": 500000
     }' \\
     https://api.ainomads.com/api/smart-contracts/1/deploy`
        }
      ]
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Real-time Integration",
      description: "Deploy agents instantly with webhooks and live updates"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "OAuth 2.0, API keys, and role-based access control"
    },
    {
      icon: Book,
      title: "Comprehensive Docs",
      description: "Complete documentation with examples and SDKs"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-emerald-950/10">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extralight mb-8 text-gray-200 tracking-wide fade-in-luxury">
            API Documentation
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto font-extralight leading-relaxed">
            Integrate AI agents directly into your systems.
            <br className="hidden md:block" />
            <span className="knight-text font-light">RESTful APIs with comprehensive documentation.</span>
          </p>
        </div>

        {/* API Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-black/40 border border-gray-800 p-8 rounded backdrop-blur-sm">
              <feature.icon className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-light text-gray-200 mb-3">{feature.title}</h3>
              <p className="text-gray-400 font-extralight">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Tabbed API Documentation */}
        <Tabs defaultValue="agents" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-700">
            <TabsTrigger value="agents" className="data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-300">
              <Users className="w-4 h-4 mr-2" />
              Agent APIs
            </TabsTrigger>
            <TabsTrigger value="contracts" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
              <FileText className="w-4 h-4 mr-2" />
              Smart Contracts
            </TabsTrigger>
            <TabsTrigger value="sdk" className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300">
              <Terminal className="w-4 h-4 mr-2" />
              SDK Documentation
            </TabsTrigger>
          </TabsList>

          {/* Agent APIs Tab */}
          <TabsContent value="agents" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <h3 className="text-lg font-light text-gray-200 mb-6">Agent Endpoints</h3>
                <div className="space-y-2">
                  {agentEndpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => setSelectedEndpoint(endpoint.id)}
                      className={`w-full text-left p-4 rounded border transition-all duration-300 ${
                        selectedEndpoint === endpoint.id
                          ? "bg-emerald-900/20 border-emerald-700 text-emerald-400"
                          : "bg-black/40 border-gray-800 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Badge 
                          className={`text-xs px-2 py-1 ${
                            endpoint.method === 'GET' ? 'bg-blue-900/40 text-blue-400' : 'bg-green-900/40 text-green-400'
                          }`}
                        >
                          {endpoint.method}
                        </Badge>
                      </div>
                      <div className="text-sm font-mono text-gray-300 mb-1">{endpoint.path}</div>
                      <div className="text-xs text-gray-500">{endpoint.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3">
                {agentEndpoints
                  .filter((endpoint) => endpoint.id === selectedEndpoint)
                  .map((endpoint) => (
                    <div key={endpoint.id} className="bg-black/40 border border-gray-800 rounded backdrop-blur-sm">
                      <div className="p-6 border-b border-gray-800">
                        <div className="flex items-center gap-4 mb-4">
                          <Badge className={`${
                            endpoint.method === 'GET' ? 'bg-blue-900/40 text-blue-400' : 'bg-green-900/40 text-green-400'
                          }`}>
                            {endpoint.method}
                          </Badge>
                          <span className="text-lg font-mono text-gray-200">{endpoint.path}</span>
                          {endpoint.params && (
                            <span className="text-sm text-gray-500 font-mono">{endpoint.params}</span>
                          )}
                        </div>
                        <p className="text-gray-400">{endpoint.description}</p>
                      </div>

                      <div className="p-6">
                        {endpoint.request && (
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-medium text-gray-200">Request Body</h4>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(endpoint.request!)}
                                className="text-gray-400 hover:text-gray-200"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            <pre className="bg-gray-950 border border-gray-700 rounded p-4 text-sm text-gray-300 overflow-x-auto">
                              <code>{endpoint.request}</code>
                            </pre>
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-200">Response</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(endpoint.response)}
                              className="text-gray-400 hover:text-gray-200"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <pre className="bg-gray-950 border border-gray-700 rounded p-4 text-sm text-gray-300 overflow-x-auto">
                            <code>{endpoint.response}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* Smart Contracts Tab */}
          <TabsContent value="contracts" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <h3 className="text-lg font-light text-gray-200 mb-6">Contract Endpoints</h3>
                <div className="space-y-2">
                  {contractEndpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => setSelectedEndpoint(endpoint.id)}
                      className={`w-full text-left p-4 rounded border transition-all duration-300 ${
                        selectedEndpoint === endpoint.id
                          ? "bg-blue-900/20 border-blue-700 text-blue-400"
                          : "bg-black/40 border-gray-800 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Badge 
                          className={`text-xs px-2 py-1 ${
                            endpoint.method === 'GET' ? 'bg-blue-900/40 text-blue-400' : 'bg-green-900/40 text-green-400'
                          }`}
                        >
                          {endpoint.method}
                        </Badge>
                      </div>
                      <div className="text-sm font-mono text-gray-300 mb-1">{endpoint.path}</div>
                      <div className="text-xs text-gray-500">{endpoint.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3">
                {contractEndpoints
                  .filter((endpoint) => endpoint.id === selectedEndpoint)
                  .map((endpoint) => (
                    <div key={endpoint.id} className="bg-black/40 border border-gray-800 rounded backdrop-blur-sm">
                      <div className="p-6 border-b border-gray-800">
                        <div className="flex items-center gap-4 mb-4">
                          <Badge className={`${
                            endpoint.method === 'GET' ? 'bg-blue-900/40 text-blue-400' : 'bg-green-900/40 text-green-400'
                          }`}>
                            {endpoint.method}
                          </Badge>
                          <span className="text-lg font-mono text-gray-200">{endpoint.path}</span>
                          {endpoint.params && (
                            <span className="text-sm text-gray-500 font-mono">{endpoint.params}</span>
                          )}
                        </div>
                        <p className="text-gray-400">{endpoint.description}</p>
                      </div>

                      <div className="p-6">
                        {endpoint.request && (
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-medium text-gray-200">Request Body</h4>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(endpoint.request!)}
                                className="text-gray-400 hover:text-gray-200"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            <pre className="bg-gray-950 border border-gray-700 rounded p-4 text-sm text-gray-300 overflow-x-auto">
                              <code>{endpoint.request}</code>
                            </pre>
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-200">Response</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(endpoint.response)}
                              className="text-gray-400 hover:text-gray-200"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <pre className="bg-gray-950 border border-gray-700 rounded p-4 text-sm text-gray-300 overflow-x-auto">
                            <code>{endpoint.response}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* SDK Documentation Tab */}
          <TabsContent value="sdk" className="mt-8">
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-light text-white mb-4">Official SDKs</h3>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Integrate AI Nomads into your applications with our official SDKs and comprehensive examples.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* JavaScript SDK */}
                <div className="bg-black/40 border border-gray-800 rounded backdrop-blur-sm">
                  <div className="p-4 lg:p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                      <Code className="w-6 h-6 text-yellow-400" />
                      <h4 className="text-lg lg:text-xl font-light text-white">JavaScript</h4>
                    </div>
                    <p className="text-gray-400 text-sm">For web applications and Node.js projects</p>
                  </div>
                  
                  <div className="p-4 lg:p-6">
                    <h5 className="text-sm font-medium text-gray-200 mb-3">Installation</h5>
                    <pre className="bg-gray-950 border border-gray-700 rounded p-3 text-xs lg:text-sm text-gray-300 mb-4 overflow-x-auto">
                      <code>{sdkDocs.javascript.installation}</code>
                    </pre>
                    
                    <h5 className="text-sm font-medium text-gray-200 mb-3">Initialization</h5>
                    <pre className="bg-gray-950 border border-gray-700 rounded p-3 text-xs lg:text-sm text-gray-300 overflow-x-auto">
                      <code>{sdkDocs.javascript.initialization}</code>
                    </pre>
                  </div>
                </div>

                {/* Python SDK */}
                <div className="bg-black/40 border border-gray-800 rounded backdrop-blur-sm">
                  <div className="p-4 lg:p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                      <Terminal className="w-6 h-6 text-blue-400" />
                      <h4 className="text-lg lg:text-xl font-light text-white">Python</h4>
                    </div>
                    <p className="text-gray-400 text-sm">For data science and backend automation</p>
                  </div>
                  
                  <div className="p-4 lg:p-6">
                    <h5 className="text-sm font-medium text-gray-200 mb-3">Installation</h5>
                    <pre className="bg-gray-950 border border-gray-700 rounded p-3 text-xs lg:text-sm text-gray-300 mb-4 overflow-x-auto">
                      <code>{sdkDocs.python.installation}</code>
                    </pre>
                    
                    <h5 className="text-sm font-medium text-gray-200 mb-3">Initialization</h5>
                    <pre className="bg-gray-950 border border-gray-700 rounded p-3 text-xs lg:text-sm text-gray-300 overflow-x-auto">
                      <code>{sdkDocs.python.initialization}</code>
                    </pre>
                  </div>
                </div>

                {/* cURL Examples */}
                <div className="bg-black/40 border border-gray-800 rounded backdrop-blur-sm md:col-span-2 lg:col-span-1">
                  <div className="p-4 lg:p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                      <ExternalLink className="w-6 h-6 text-green-400" />
                      <h4 className="text-lg lg:text-xl font-light text-white">REST API</h4>
                    </div>
                    <p className="text-gray-400 text-sm">Direct HTTP requests for any language</p>
                  </div>
                  
                  <div className="p-4 lg:p-6">
                    <h5 className="text-sm font-medium text-gray-200 mb-3">Authentication</h5>
                    <pre className="bg-gray-950 border border-gray-700 rounded p-3 text-xs lg:text-sm text-gray-300 overflow-x-auto">
                      <code>{sdkDocs.curl.examples[0].code}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Code Examples */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                {/* JavaScript Examples */}
                <div>
                  <h4 className="text-xl lg:text-2xl font-light text-white mb-4 lg:mb-6">JavaScript Examples</h4>
                  <div className="space-y-4 lg:space-y-6">
                    {sdkDocs.javascript.examples.map((example, index) => (
                      <div key={index} className="bg-black/40 border border-gray-800 rounded backdrop-blur-sm">
                        <div className="p-3 lg:p-4 border-b border-gray-800">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm lg:text-lg font-medium text-gray-200">{example.title}</h5>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(example.code)}
                              className="text-gray-400 hover:text-gray-200"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 lg:p-4">
                          <pre className="text-xs lg:text-sm text-gray-300 overflow-x-auto bg-gray-950 border border-gray-700 rounded p-2 lg:p-3">
                            <code>{example.code}</code>
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Python Examples */}
                <div>
                  <h4 className="text-xl lg:text-2xl font-light text-white mb-4 lg:mb-6">Python Examples</h4>
                  <div className="space-y-4 lg:space-y-6">
                    {sdkDocs.python.examples.map((example, index) => (
                      <div key={index} className="bg-black/40 border border-gray-800 rounded backdrop-blur-sm">
                        <div className="p-3 lg:p-4 border-b border-gray-800">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm lg:text-lg font-medium text-gray-200">{example.title}</h5>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(example.code)}
                              className="text-gray-400 hover:text-gray-200"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 lg:p-4">
                          <pre className="text-xs lg:text-sm text-gray-300 overflow-x-auto bg-gray-950 border border-gray-700 rounded p-2 lg:p-3">
                            <code>{example.code}</code>
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* cURL Examples */}
              <div>
                <h4 className="text-xl lg:text-2xl font-light text-white mb-4 lg:mb-6">cURL Examples</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {sdkDocs.curl.examples.map((example, index) => (
                    <div key={index} className="bg-black/40 border border-gray-800 rounded backdrop-blur-sm">
                      <div className="p-3 lg:p-4 border-b border-gray-800">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm lg:text-lg font-medium text-gray-200">{example.title}</h5>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(example.code)}
                            className="text-gray-400 hover:text-gray-200"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 lg:p-4">
                        <pre className="text-xs lg:text-sm text-gray-300 overflow-x-auto bg-gray-950 border border-gray-700 rounded p-2 lg:p-3">
                          <code>{example.code}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Get Started CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-emerald-950/30 to-blue-950/30 rounded-lg border border-gray-700">
          <h3 className="text-2xl font-light text-white mb-4">Ready to get started?</h3>
          <p className="text-gray-400 mb-6">Join thousands of developers already building with AI Nomads</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-emerald-900/40 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/60">
              Get API Key
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              View Examples
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}