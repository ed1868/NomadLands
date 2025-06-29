// Test script for dual agent creation system
import fetch from 'node-fetch';

async function testDualAgentCreation() {
  const loginPayload = {
    username: "test",
    password: "testing"
  };

  // Login first
  console.log('Logging in...');
  const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginPayload)
  });

  if (!loginResponse.ok) {
    console.error('Login failed:', await loginResponse.text());
    return;
  }

  const loginData = await loginResponse.json();
  const token = loginData.token;
  console.log('Login successful!');

  // Test dual agent creation
  const agentPayload = {
    agentData: {
      name: "Test Email Assistant",
      description: "An AI agent that helps manage and organize emails efficiently",
      category: "productivity",
      tools: ["email", "calendar"],
      aiModel: "gpt-4",
      systemPrompt: "You are a helpful email assistant that helps users organize and manage their emails."
    },
    conversationHistory: [
      { role: "user", content: "I need an agent to help me manage my emails" },
      { role: "assistant", content: "I'll create an email management agent for you that can help organize and prioritize your emails." }
    ],
    optimizedPrompt: "Create an intelligent email management system that can categorize, prioritize, and respond to emails automatically."
  };

  console.log('Creating dual agent...');
  const dualAgentResponse = await fetch('http://localhost:5000/api/chat/create-dual-agent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(agentPayload)
  });

  if (!dualAgentResponse.ok) {
    const errorText = await dualAgentResponse.text();
    console.error('Dual agent creation failed:', errorText);
    return;
  }

  const dualAgentData = await dualAgentResponse.json();
  console.log('Dual agent created successfully!');
  console.log('Agent ID:', dualAgentData.agent.id);
  console.log('N8n Workflow ID:', dualAgentData.implementations.n8n.workflowId);
  console.log('Python Path:', dualAgentData.implementations.python.path);
  console.log('Message:', dualAgentData.message);
}

testDualAgentCreation().catch(console.error);