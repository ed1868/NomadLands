# productivity Agent - n8n Workflow

## Overview
This n8n workflow implements the productivity Agent agent for productivity automation.

## Description
An AI agent specialized in productivity tasks

## Installation
1. Import the workflow.json file into your n8n instance
2. Configure the required credentials and connections
3. Activate the workflow
4. Test the webhook endpoint

## Workflow Details
- **Workflow ID**: Generated automatically
- **Tools**: google-calendar, email, slack
- **AI Model**: gpt-4o

## Usage
Send POST requests to the webhook URL with your chat messages to interact with the agent.

## Configuration
Make sure to configure the following in your n8n instance:
- OpenAI/Claude API credentials
- Tool-specific credentials (Gmail, Slack, etc.)
- Webhook security settings

Generated on: 2025-06-29T22:20:14.927Z
