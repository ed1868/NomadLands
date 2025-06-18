import { useState } from "react";
import { Code, Copy, ExternalLink, Book, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";

export default function ApiDocs() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("agents");

  const endpoints = [
    {
      id: "agents",
      method: "GET",
      path: "/api/agents",
      description: "Retrieve all available AI agents",
      response: `{
  "agents": [
    {
      "id": 1,
      "name": "Mindful Email Curator",
      "description": "Transforms chaotic inboxes into zen-like productivity spaces",
      "category": "productivity",
      "price": 29,
      "features": ["Smart Filtering", "Auto-Reply", "Priority Scoring"],
      "status": "active"
    }
  ]
}`
    },
    {
      id: "deploy",
      method: "POST",
      path: "/api/agents/{id}/deploy",
      description: "Deploy an AI agent to your workspace",
      request: `{
  "workspace_id": "workspace_123",
  "config": {
    "auto_start": true,
    "permissions": ["read", "write"]
  }
}`,
      response: `{
  "deployment_id": "deploy_456",
  "status": "deploying",
  "estimated_time": "2-3 minutes"
}`
    },
    {
      id: "status",
      method: "GET",
      path: "/api/deployments/{id}/status",
      description: "Check deployment status and health",
      response: `{
  "deployment_id": "deploy_456",
  "status": "active",
  "uptime": "99.9%",
  "last_activity": "2025-06-18T01:30:00Z"
}`
    },
    {
      id: "fleets",
      method: "POST",
      path: "/api/fleets/create",
      description: "Create and deploy agent fleets",
      request: `{
  "fleet_type": "enterprise",
  "agents": [1, 2, 3, 4, 5],
  "workspace_id": "workspace_123"
}`,
      response: `{
  "fleet_id": "fleet_789",
  "status": "deploying",
  "agents_deployed": 5
}`
    }
  ];

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

        {/* API Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Endpoints List */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-light text-gray-200 mb-6">Endpoints</h3>
            <div className="space-y-2">
              {endpoints.map((endpoint) => (
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

          {/* Endpoint Details */}
          <div className="lg:col-span-3">
            {endpoints
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
                      <code className="text-gray-300 font-mono text-lg">{endpoint.path}</code>
                    </div>
                    <p className="text-gray-400 font-extralight">{endpoint.description}</p>
                  </div>

                  <div className="p-6">
                    {endpoint.request && (
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-gray-300 font-light">Request Body</h4>
                          <Button
                            onClick={() => copyToClipboard(endpoint.request || "")}
                            className="bg-transparent border-gray-700 text-gray-400 hover:text-gray-300 p-2"
                            size="sm"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <pre className="bg-black/60 border border-gray-700 rounded p-4 text-gray-300 text-sm font-mono overflow-x-auto">
                          {endpoint.request}
                        </pre>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-gray-300 font-light">Response</h4>
                        <Button
                          onClick={() => copyToClipboard(endpoint.response)}
                          className="bg-transparent border-gray-700 text-gray-400 hover:text-gray-300 p-2"
                          size="sm"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <pre className="bg-black/60 border border-gray-700 rounded p-4 text-gray-300 text-sm font-mono overflow-x-auto">
                        {endpoint.response}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-16 bg-black/40 border border-gray-800 rounded-lg p-8 backdrop-blur-sm">
          <h3 className="text-2xl font-light text-gray-200 mb-6">Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-light text-gray-300 mb-4">Authentication</h4>
              <p className="text-gray-400 font-extralight mb-4">
                All API requests require authentication using API keys. Include your key in the Authorization header:
              </p>
              <pre className="bg-black/60 border border-gray-700 rounded p-4 text-gray-300 text-sm font-mono">
                Authorization: Bearer your_api_key_here
              </pre>
            </div>
            <div>
              <h4 className="text-lg font-light text-gray-300 mb-4">Rate Limits</h4>
              <p className="text-gray-400 font-extralight mb-4">
                API calls are limited based on your plan:
              </p>
              <ul className="text-gray-400 font-extralight space-y-2">
                <li>• Startup: 1,000 requests/hour</li>
                <li>• Growth: 10,000 requests/hour</li>
                <li>• Enterprise: Unlimited</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button className="obsidian-gradient text-gray-300 px-6 py-3 rounded border border-gray-700 font-light backdrop-blur-sm">
              <Code className="w-4 h-4 mr-2" />
              View SDKs
            </Button>
            <Button className="bg-transparent border-gray-700 text-gray-400 hover:text-gray-300 px-6 py-3 rounded font-light backdrop-blur-sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Postman Collection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}