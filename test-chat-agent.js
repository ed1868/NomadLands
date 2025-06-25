// Test script for chat agent creation
const BASE_URL = 'http://localhost:5000';

async function testChatAgentCreation() {
  try {
    // First login to get token
    console.log('1. Logging in...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test', password: 'testing' })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login result:', loginData.user ? 'Success' : 'Failed');
    
    if (!loginData.token) {
      throw new Error('No token received');
    }
    
    // Test agent creation
    console.log('2. Creating agent via chat...');
    const agentResponse = await fetch(`${BASE_URL}/api/chat/create-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        message: 'I want to create a customer support agent that can handle emails and slack messages'
      })
    });
    
    const agentData = await agentResponse.json();
    console.log('Agent creation result:', agentData);
    
    if (agentData.success) {
      console.log('✓ Agent created successfully!');
      console.log('Agent ID:', agentData.agent.id);
      console.log('Workflow ID:', agentData.workflow.id);
      console.log('Webhook URL:', agentData.workflow.webhookUrl);
    } else {
      console.log('✗ Agent creation failed:', agentData.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testChatAgentCreation();