#!/usr/bin/env python3
"""
General Agent - Gmail Email Management AI Agent
An AI agent that processes Gmail emails and provides intelligent email management.
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import openai
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GmailEmailAgent:
    """AI agent for Gmail email management and processing."""
    
    def __init__(self, openai_api_key: str, gmail_credentials_path: str = None):
        """Initialize the Gmail Email Agent.
        
        Args:
            openai_api_key: OpenAI API key for AI processing
            gmail_credentials_path: Path to Gmail OAuth credentials file
        """
        self.openai_client = openai.OpenAI(api_key=openai_api_key)
        self.gmail_service = None
        self.credentials_path = gmail_credentials_path
        
        # Gmail API scopes
        self.scopes = [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/gmail.labels'
        ]
        
        # Initialize Gmail service
        self._setup_gmail_service()
    
    def _setup_gmail_service(self):
        """Set up Gmail API service with OAuth authentication."""
        try:
            creds = None
            token_path = 'token.json'
            
            # Load existing token
            if os.path.exists(token_path):
                creds = Credentials.from_authorized_user_file(token_path, self.scopes)
            
            # If there are no valid credentials, get new ones
            if not creds or not creds.valid:
                if creds and creds.expired and creds.refresh_token:
                    creds.refresh(Request())
                else:
                    if self.credentials_path and os.path.exists(self.credentials_path):
                        flow = InstalledAppFlow.from_client_secrets_file(
                            self.credentials_path, self.scopes)
                        creds = flow.run_local_server(port=0)
                    else:
                        logger.warning("Gmail credentials not found. Email features will be limited.")
                        return
                
                # Save credentials for next run
                with open(token_path, 'w') as token:
                    token.write(creds.to_json())
            
            self.gmail_service = build('gmail', 'v1', credentials=creds)
            logger.info("Gmail service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to setup Gmail service: {e}")
            self.gmail_service = None
    
    def get_recent_emails(self, max_results: int = 10, query: str = "is:unread") -> List[Dict]:
        """Retrieve recent emails from Gmail.
        
        Args:
            max_results: Maximum number of emails to retrieve
            query: Gmail search query (default: unread emails)
            
        Returns:
            List of email dictionaries with metadata and content
        """
        if not self.gmail_service:
            logger.error("Gmail service not available")
            return []
        
        try:
            # Search for emails
            results = self.gmail_service.users().messages().list(
                userId='me', q=query, maxResults=max_results
            ).execute()
            
            messages = results.get('messages', [])
            emails = []
            
            for message in messages:
                # Get full message details
                msg = self.gmail_service.users().messages().get(
                    userId='me', id=message['id']
                ).execute()
                
                # Extract email data
                email_data = self._parse_email(msg)
                emails.append(email_data)
            
            logger.info(f"Retrieved {len(emails)} emails")
            return emails
            
        except Exception as e:
            logger.error(f"Error retrieving emails: {e}")
            return []
    
    def _parse_email(self, message: Dict) -> Dict:
        """Parse Gmail message into structured data.
        
        Args:
            message: Gmail API message object
            
        Returns:
            Dictionary with parsed email data
        """
        headers = message['payload'].get('headers', [])
        
        # Extract headers
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
        sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown Sender')
        date = next((h['value'] for h in headers if h['name'] == 'Date'), '')
        
        # Extract body
        body = self._extract_body(message['payload'])
        
        return {
            'id': message['id'],
            'subject': subject,
            'sender': sender,
            'date': date,
            'body': body,
            'labels': message.get('labelIds', []),
            'snippet': message.get('snippet', '')
        }
    
    def _extract_body(self, payload: Dict) -> str:
        """Extract email body text from payload.
        
        Args:
            payload: Gmail message payload
            
        Returns:
            Email body as string
        """
        body = ""
        
        if 'parts' in payload:
            for part in payload['parts']:
                if part['mimeType'] == 'text/plain':
                    data = part['body']['data']
                    body = self._decode_base64(data)
                    break
        elif payload['mimeType'] == 'text/plain':
            data = payload['body']['data']
            body = self._decode_base64(data)
        
        return body
    
    def _decode_base64(self, data: str) -> str:
        """Decode base64 encoded email content."""
        import base64
        try:
            return base64.urlsafe_b64decode(data).decode('utf-8')
        except Exception:
            return "Unable to decode email content"
    
    def analyze_email(self, email: Dict) -> Dict:
        """Analyze email using AI to extract insights and categorization.
        
        Args:
            email: Email dictionary from get_recent_emails()
            
        Returns:
            Analysis results including category, priority, sentiment, and summary
        """
        try:
            prompt = f"""
            Analyze this email and provide structured insights:
            
            Subject: {email['subject']}
            From: {email['sender']}
            Content: {email['body'][:1000]}...
            
            Please provide:
            1. Category (work, personal, promotional, newsletter, urgent, etc.)
            2. Priority (high, medium, low)
            3. Sentiment (positive, neutral, negative)
            4. Key topics/entities mentioned
            5. Suggested actions
            6. Brief summary
            
            Return as JSON format.
            """
            
            response = self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are an expert email analyst. Provide structured analysis in JSON format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            analysis = json.loads(response.choices[0].message.content)
            analysis['email_id'] = email['id']
            analysis['analyzed_at'] = datetime.now().isoformat()
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing email: {e}")
            return {
                'email_id': email['id'],
                'error': str(e),
                'category': 'unknown',
                'priority': 'medium',
                'sentiment': 'neutral'
            }
    
    def process_emails(self, max_emails: int = 10) -> List[Dict]:
        """Process recent emails with AI analysis.
        
        Args:
            max_emails: Maximum number of emails to process
            
        Returns:
            List of processed emails with analysis
        """
        logger.info(f"Processing up to {max_emails} emails...")
        
        # Get recent emails
        emails = self.get_recent_emails(max_results=max_emails)
        
        if not emails:
            logger.info("No emails found to process")
            return []
        
        # Analyze each email
        processed_emails = []
        for email in emails:
            logger.info(f"Analyzing email: {email['subject'][:50]}...")
            analysis = self.analyze_email(email)
            
            # Combine email data with analysis
            processed_email = {
                **email,
                'analysis': analysis
            }
            processed_emails.append(processed_email)
        
        logger.info(f"Processed {len(processed_emails)} emails successfully")
        return processed_emails
    
    def generate_email_report(self, processed_emails: List[Dict]) -> str:
        """Generate a summary report of processed emails.
        
        Args:
            processed_emails: List of emails with analysis
            
        Returns:
            Formatted report string
        """
        if not processed_emails:
            return "No emails to report on."
        
        # Categorize emails
        categories = {}
        high_priority = []
        
        for email in processed_emails:
            analysis = email.get('analysis', {})
            category = analysis.get('category', 'unknown')
            priority = analysis.get('priority', 'medium')
            
            if category not in categories:
                categories[category] = 0
            categories[category] += 1
            
            if priority == 'high':
                high_priority.append(email)
        
        # Generate report
        report = f"""
EMAIL PROCESSING REPORT
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

SUMMARY:
- Total emails processed: {len(processed_emails)}
- High priority emails: {len(high_priority)}

CATEGORIES:
"""
        for category, count in categories.items():
            report += f"- {category.title()}: {count} emails\n"
        
        if high_priority:
            report += "\nHIGH PRIORITY EMAILS:\n"
            for email in high_priority[:5]:  # Show top 5
                report += f"- {email['subject'][:60]}... (from: {email['sender']})\n"
        
        return report

def main():
    """Main function to run the Gmail Email Agent."""
    # Load configuration
    openai_api_key = os.getenv('OPENAI_API_KEY')
    gmail_creds = os.getenv('GMAIL_CREDENTIALS_PATH', 'credentials.json')
    
    if not openai_api_key:
        logger.error("OPENAI_API_KEY environment variable is required")
        return
    
    # Initialize agent
    agent = GmailEmailAgent(
        openai_api_key=openai_api_key,
        gmail_credentials_path=gmail_creds
    )
    
    # Process emails
    processed_emails = agent.process_emails(max_emails=10)
    
    # Generate and print report
    report = agent.generate_email_report(processed_emails)
    print(report)
    
    # Save processed emails to file
    with open('processed_emails.json', 'w') as f:
        json.dump(processed_emails, f, indent=2, default=str)
    
    logger.info("Email processing complete. Results saved to processed_emails.json")

if __name__ == "__main__":
    main()