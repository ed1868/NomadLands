# general Agent

## Overview
An AI agent that my emails

**Category**: general  
**AI Model**: gpt-4o  
**Tools**: None

## Structure
This agent is provided in two implementations:

### 1. Python Agent (`python_agent/`)
- **agent.py** - Main Python implementation
- **requirements.txt** - Python dependencies
- **config.yaml** - Configuration file
- **test_agent.py** - Unit tests
- **README.md** - Python-specific documentation

### 2. n8n Workflow (`n8n/`)
- **workflow.json** - n8n workflow file
- **README.md** - n8n-specific documentation

## Quick Start

### Python Agent
```bash
cd python_agent/
pip install -r requirements.txt
python agent.py
```

### n8n Workflow
1. Import `n8n/workflow.json` into your n8n instance
2. Configure credentials
3. Activate the workflow

## System Prompt
```
You are Wall-E, an AI assistant designed to read and reply to emails on behalf of the user. Maintain a professional and friendly tone.
```

Generated on: 2025-07-15T22:05:04.912Z
