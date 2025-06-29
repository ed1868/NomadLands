#!/usr/bin/env python3
"""
Test suite for the General Agent - Gmail Email Management AI Agent
"""

import unittest
from unittest.mock import Mock, patch, MagicMock
import json
import os
import sys

# Add the agent module to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agent import GmailEmailAgent

class TestGmailEmailAgent(unittest.TestCase):
    """Test cases for the GmailEmailAgent class."""
    
    def setUp(self):
        """Set up test fixtures before each test method."""
        self.test_api_key = "test_openai_api_key"
        self.test_credentials_path = "test_credentials.json"
        
        # Mock OpenAI client to avoid actual API calls
        with patch('agent.openai.OpenAI'):
            self.agent = GmailEmailAgent(
                openai_api_key=self.test_api_key,
                gmail_credentials_path=self.test_credentials_path
            )
    
    def test_agent_initialization(self):
        """Test that the agent initializes correctly."""
        self.assertIsNotNone(self.agent)
        self.assertEqual(self.agent.credentials_path, self.test_credentials_path)
        self.assertIsNotNone(self.agent.scopes)
        self.assertEqual(len(self.agent.scopes), 3)
    
    @patch('agent.build')
    @patch('agent.Credentials.from_authorized_user_file')
    def test_gmail_service_setup_with_existing_token(self, mock_credentials, mock_build):
        """Test Gmail service setup with existing valid token."""
        # Mock valid credentials
        mock_creds = Mock()
        mock_creds.valid = True
        mock_credentials.return_value = mock_creds
        
        # Mock Gmail service
        mock_service = Mock()
        mock_build.return_value = mock_service
        
        with patch('os.path.exists', return_value=True):
            self.agent._setup_gmail_service()
        
        self.assertEqual(self.agent.gmail_service, mock_service)
        mock_build.assert_called_once_with('gmail', 'v1', credentials=mock_creds)
    
    def test_parse_email(self):
        """Test email parsing functionality."""
        # Mock Gmail message structure
        mock_message = {
            'id': 'test_message_id',
            'snippet': 'Test email snippet',
            'labelIds': ['INBOX', 'UNREAD'],
            'payload': {
                'headers': [
                    {'name': 'Subject', 'value': 'Test Subject'},
                    {'name': 'From', 'value': 'test@example.com'},
                    {'name': 'Date', 'value': 'Mon, 1 Jan 2024 12:00:00 +0000'}
                ],
                'mimeType': 'text/plain',
                'body': {
                    'data': 'VGVzdCBlbWFpbCBib2R5'  # Base64 encoded "Test email body"
                }
            }
        }
        
        result = self.agent._parse_email(mock_message)
        
        self.assertEqual(result['id'], 'test_message_id')
        self.assertEqual(result['subject'], 'Test Subject')
        self.assertEqual(result['sender'], 'test@example.com')
        self.assertEqual(result['snippet'], 'Test email snippet')
        self.assertIn('INBOX', result['labels'])
    
    def test_decode_base64(self):
        """Test base64 decoding functionality."""
        test_data = 'VGVzdCBtZXNzYWdl'  # Base64 for "Test message"
        result = self.agent._decode_base64(test_data)
        self.assertEqual(result, 'Test message')
    
    def test_decode_base64_invalid(self):
        """Test base64 decoding with invalid data."""
        invalid_data = 'invalid_base64_data'
        result = self.agent._decode_base64(invalid_data)
        self.assertEqual(result, "Unable to decode email content")
    
    @patch.object(GmailEmailAgent, 'gmail_service')
    def test_get_recent_emails_no_service(self, mock_service):
        """Test get_recent_emails when Gmail service is not available."""
        self.agent.gmail_service = None
        result = self.agent.get_recent_emails()
        self.assertEqual(result, [])
    
    @patch.object(GmailEmailAgent, 'gmail_service')
    def test_get_recent_emails_success(self, mock_service):
        """Test successful email retrieval."""
        # Mock Gmail API responses
        mock_service.users().messages().list().execute.return_value = {
            'messages': [{'id': 'msg1'}, {'id': 'msg2'}]
        }
        
        mock_message_data = {
            'id': 'msg1',
            'snippet': 'Test snippet',
            'labelIds': ['INBOX'],
            'payload': {
                'headers': [
                    {'name': 'Subject', 'value': 'Test Subject'},
                    {'name': 'From', 'value': 'test@example.com'},
                    {'name': 'Date', 'value': 'Mon, 1 Jan 2024 12:00:00 +0000'}
                ],
                'mimeType': 'text/plain',
                'body': {'data': 'VGVzdA=='}
            }
        }
        
        mock_service.users().messages().get().execute.return_value = mock_message_data
        
        # Mock the agent's gmail_service
        self.agent.gmail_service = mock_service
        
        result = self.agent.get_recent_emails(max_results=2)
        
        self.assertEqual(len(result), 2)
        mock_service.users().messages().list.assert_called_once()
    
    @patch('agent.openai.OpenAI')
    def test_analyze_email(self, mock_openai_class):
        """Test email analysis functionality."""
        # Mock OpenAI response
        mock_response = Mock()
        mock_response.choices[0].message.content = json.dumps({
            "category": "work",
            "priority": "high",
            "sentiment": "neutral",
            "key_topics": ["meeting", "project"],
            "suggested_actions": ["respond", "schedule"],
            "summary": "Email about project meeting"
        })
        
        mock_client = Mock()
        mock_client.chat.completions.create.return_value = mock_response
        mock_openai_class.return_value = mock_client
        
        # Reinitialize agent with mocked OpenAI
        test_agent = GmailEmailAgent(
            openai_api_key=self.test_api_key,
            gmail_credentials_path=self.test_credentials_path
        )
        
        test_email = {
            'id': 'test_id',
            'subject': 'Test Subject',
            'sender': 'test@example.com',
            'body': 'Test email body content'
        }
        
        result = test_agent.analyze_email(test_email)
        
        self.assertEqual(result['category'], 'work')
        self.assertEqual(result['priority'], 'high')
        self.assertEqual(result['email_id'], 'test_id')
        self.assertIn('analyzed_at', result)
    
    def test_generate_email_report_empty(self):
        """Test report generation with no emails."""
        result = self.agent.generate_email_report([])
        self.assertEqual(result, "No emails to report on.")
    
    def test_generate_email_report_with_emails(self):
        """Test report generation with processed emails."""
        processed_emails = [
            {
                'id': '1',
                'subject': 'Work Email',
                'sender': 'boss@company.com',
                'analysis': {
                    'category': 'work',
                    'priority': 'high',
                    'sentiment': 'neutral'
                }
            },
            {
                'id': '2',
                'subject': 'Personal Email',
                'sender': 'friend@example.com',
                'analysis': {
                    'category': 'personal',
                    'priority': 'low',
                    'sentiment': 'positive'
                }
            }
        ]
        
        result = self.agent.generate_email_report(processed_emails)
        
        self.assertIn("Total emails processed: 2", result)
        self.assertIn("High priority emails: 1", result)
        self.assertIn("Work: 1 emails", result)
        self.assertIn("Personal: 1 emails", result)
        self.assertIn("Work Email", result)

class TestIntegration(unittest.TestCase):
    """Integration tests for the complete email processing workflow."""
    
    @patch('agent.openai.OpenAI')
    @patch.object(GmailEmailAgent, '_setup_gmail_service')
    def test_process_emails_workflow(self, mock_setup, mock_openai_class):
        """Test the complete email processing workflow."""
        # Mock OpenAI client
        mock_response = Mock()
        mock_response.choices[0].message.content = json.dumps({
            "category": "work",
            "priority": "medium",
            "sentiment": "neutral",
            "summary": "Test email analysis"
        })
        
        mock_client = Mock()
        mock_client.chat.completions.create.return_value = mock_response
        mock_openai_class.return_value = mock_client
        
        # Create agent
        agent = GmailEmailAgent("test_key", "test_creds.json")
        
        # Mock get_recent_emails to return test data
        test_emails = [
            {
                'id': 'test1',
                'subject': 'Test Email',
                'sender': 'test@example.com',
                'body': 'Test body',
                'date': '2024-01-01',
                'labels': ['INBOX'],
                'snippet': 'Test snippet'
            }
        ]
        
        with patch.object(agent, 'get_recent_emails', return_value=test_emails):
            result = agent.process_emails(max_emails=1)
        
        self.assertEqual(len(result), 1)
        self.assertIn('analysis', result[0])
        self.assertEqual(result[0]['analysis']['category'], 'work')

if __name__ == '__main__':
    # Set up test environment
    os.environ['OPENAI_API_KEY'] = 'test_key'
    
    # Run tests
    unittest.main(verbosity=2)