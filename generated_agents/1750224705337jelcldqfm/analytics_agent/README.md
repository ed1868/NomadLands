# analytics Agent

## Overview
An AI agent specialized in analytics tasks

**Category**: analytics  
**AI Model**: gpt-4o  
**Tools**: google-sheets, database, chart-generator

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
You are a helpful AI assistant.
```

Generated on: 2025-06-29T21:12:24.125Z
