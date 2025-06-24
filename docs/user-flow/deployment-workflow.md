# Agent Deployment Workflow Testing Guide

## Purpose
This guide provides step-by-step instructions for testing the complete agent deployment system in AI Nomads.

## Prerequisites
- User must be authenticated (use test credentials: username: `test`, password: `testing`)
- Server must be running and accessible

## Workflow Steps

### Step 1: Access Deployment Page
**Action:** Navigate to the Deploy page
**URL:** `/deploy`
**Expected:** Landing on deployment dashboard with hero section and empty deployments list

### Step 2: Initiate New Deployment
**Action:** Click "Deploy Your First Agent" or "Deploy New Agent" button
**Expected:** Deployment form appears with all configuration sections

### Step 3: Basic Information Configuration
**Fields to Fill:**
- **Agent Name:** "Test Email Classifier"
- **Description:** "Automatically classifies emails into categories like urgent, spam, or promotional"
- **Category:** Select "Productivity" from dropdown

**Expected:** Form accepts input without validation errors

### Step 4: AI Configuration Setup
**Configuration Fields:**
- **AI Model:** Select "GPT-4" (default)
- **Temperature:** Set to 0.7 (default)
- **Max Tokens:** Set to 1000 (default)
- **Environment:** Select "Production"
- **System Prompt:** 
  ```
  You are an AI assistant specialized in email classification. Analyze email content and categorize it appropriately into urgent, spam, promotional, or general categories.
  ```

**Expected:** All AI configuration options are selectable and save properly

### Step 5: Pricing & Access Configuration
**Pricing Fields:**
- **Price per Call:** "0.05"
- **Currency:** "USD" (default)
- **Access Type:** Select "Public"

**Expected:** Pricing fields accept decimal values and access types are selectable

### Step 6: Tags Management
**Actions:**
1. Add tag "email" and click "Add"
2. Add tag "classification" and click "Add"
3. Add tag "productivity" and click "Add"
4. Add tag "automation" and click "Add"

**Expected:** Tags appear as badges below the input field with remove (×) buttons

### Step 7: Submit Deployment
**Action:** Click "Deploy Agent" button
**Expected:** 
- Loading state shows "Deploying..."
- Success notification appears
- Form clears or redirects to deployment list
- New deployment appears in the deployments list

### Step 8: Verify Deployment Details
**Check the following in the deployment list:**
- Agent name displays correctly
- Status shows as "Active"
- API endpoint is generated (format: `/api/agents/deployed/test-email-classifier-[timestamp]`)
- Access type shows "Public" with globe icon
- Health status shows "Healthy" in green
- All tags are displayed as badges
- Metrics show 0 calls and $0.00 revenue initially

### Step 9: Test Deployment Actions
**Available Actions:**
1. **Settings Button:** Should be clickable (functionality may be placeholder)
2. **View Analytics:** Should be clickable
3. **API Documentation:** Should be clickable
4. **Test Endpoint:** Should be clickable

**Expected:** All buttons are interactive and respond to clicks

### Step 10: Analytics Verification
**Action:** Click "View Analytics" button
**Expected:** 
- Analytics modal or page opens
- Shows zero usage metrics initially
- Displays charts placeholder or empty state
- Contains metrics like total calls, revenue, response time, success rate

## Test Data Templates

### Minimal Test Deployment
```json
{
  "name": "Simple Test Agent",
  "description": "Basic test agent for validation",
  "category": "development",
  "pricePerCall": "0.01"
}
```

### Complete Test Deployment
```json
{
  "name": "Advanced Email Classifier",
  "description": "Enterprise-grade email classification with sentiment analysis and priority scoring",
  "category": "productivity",
  "configuration": {
    "model": "gpt-4",
    "temperature": 0.5,
    "maxTokens": 2000,
    "systemPrompt": "You are an advanced email classification system. Analyze emails for category, sentiment, priority, and actionability."
  },
  "pricePerCall": "0.10",
  "currency": "USD",
  "accessType": "enterprise",
  "environment": "production",
  "tags": ["email", "classification", "enterprise", "ai", "productivity"]
}
```

## Validation Checklist

### Form Validation
- [ ] Required fields show validation errors when empty
- [ ] Price per call accepts only positive numbers
- [ ] Temperature range is enforced (0-2)
- [ ] Max tokens has reasonable limits
- [ ] Tags can be added and removed
- [ ] Form submits only when all required fields are valid

### Deployment Creation
- [ ] Deployment appears in list immediately after creation
- [ ] Unique API endpoint is generated
- [ ] All form data is preserved in the deployment
- [ ] Status is set to "Active" by default
- [ ] Health status is initialized to "Healthy"

### UI/UX Elements
- [ ] Loading states work during form submission
- [ ] Success/error notifications appear appropriately
- [ ] Form layout is responsive on different screen sizes
- [ ] Dark theme styling is consistent
- [ ] All buttons and inputs are properly styled

### Data Persistence
- [ ] Deployments persist after page refresh
- [ ] User can navigate away and return to see deployments
- [ ] Deployment details remain accurate
- [ ] Analytics data (even if zero) is tracked

## Common Issues & Troubleshooting

### Form Submission Fails
1. Check all required fields are filled
2. Verify price per call is a valid positive number
3. Ensure system prompt is not empty if required
4. Check browser console for validation errors

### Deployment Doesn't Appear
1. Refresh the page to reload deployment list
2. Check if user is properly authenticated
3. Verify server is responding to API requests
4. Check browser network tab for failed requests

### API Endpoint Not Generated
1. Verify deployment was actually created in database
2. Check server logs for any errors during creation
3. Ensure unique endpoint generation logic is working

## Success Metrics
- **Form Completion Rate:** User can fill out entire form without errors
- **Deployment Success Rate:** Deployments are created and appear in list
- **UI Responsiveness:** All interactions provide immediate feedback
- **Data Accuracy:** All input data is correctly stored and displayed