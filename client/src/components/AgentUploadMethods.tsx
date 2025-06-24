import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Code, 
  Link, 
  FileText, 
  Workflow,
  PythonIcon,
  FileCode,
  ExternalLink
} from "lucide-react";

interface AgentUploadMethodsProps {
  onAgentConfigGenerated: (config: any) => void;
}

export default function AgentUploadMethods({ onAgentConfigGenerated }: AgentUploadMethodsProps) {
  const [pythonFiles, setPythonFiles] = useState<File[]>([]);
  const [n8nUrl, setN8nUrl] = useState('');
  const [jsonConfig, setJsonConfig] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePythonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const pythonFiles = files.filter(file => file.name.endsWith('.py'));
    setPythonFiles(pythonFiles);
  };

  const processPythonFiles = async () => {
    if (pythonFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload Python files first.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Read file contents
      const fileContents = await Promise.all(
        pythonFiles.map(async (file) => {
          const text = await file.text();
          return { name: file.name, content: text };
        })
      );

      // Analyze Python code and generate agent config
      const agentConfig = {
        name: `Python Agent (${pythonFiles[0].name.replace('.py', '')})`,
        description: `Agent generated from Python files: ${pythonFiles.map(f => f.name).join(', ')}`,
        category: "Development",
        aiModel: "gpt-4o",
        tools: extractToolsFromPython(fileContents),
        pricing: 0.10,
        accessType: "private",
        sourceFiles: fileContents,
        sourceType: "python"
      };

      onAgentConfigGenerated(agentConfig);
      
      toast({
        title: "Python Agent Created",
        description: `Successfully analyzed ${pythonFiles.length} Python files.`,
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "Failed to process Python files. Please check the files and try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processN8nWorkflow = async () => {
    if (!n8nUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter an n8n workflow URL.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Extract workflow ID from URL and fetch workflow data
      const workflowId = extractWorkflowId(n8nUrl);
      
      const agentConfig = {
        name: `n8n Workflow Agent`,
        description: `Agent based on n8n workflow: ${n8nUrl}`,
        category: "Automation",
        aiModel: "gpt-4o",
        tools: ["HTTP Request", "Webhooks", "Google Sheets"],
        pricing: 0.08,
        accessType: "public",
        n8nUrl: n8nUrl,
        sourceType: "n8n"
      };

      onAgentConfigGenerated(agentConfig);
      
      toast({
        title: "n8n Agent Created",
        description: "Successfully imported n8n workflow.",
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import n8n workflow. Please check the URL and try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processJsonConfig = async () => {
    if (!jsonConfig.trim()) {
      toast({
        title: "JSON Required",
        description: "Please enter a JSON configuration.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const config = JSON.parse(jsonConfig);
      
      const agentConfig = {
        name: config.name || "JSON Configured Agent",
        description: config.description || "Agent created from JSON configuration",
        category: config.category || "Custom",
        aiModel: config.aiModel || "gpt-4o",
        tools: config.tools || ["HTTP Request"],
        pricing: config.pricing || 0.05,
        accessType: config.accessType || "public",
        jsonConfig: config,
        sourceType: "json"
      };

      onAgentConfigGenerated(agentConfig);
      
      toast({
        title: "JSON Agent Created", 
        description: "Successfully imported agent from JSON configuration.",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax and try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Upload className="w-5 h-5 text-emerald-500" />
          <span>Import Agent Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="python" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
            <TabsTrigger value="python" className="data-[state=active]:bg-emerald-600/20">
              <Code className="w-4 h-4 mr-2" />
              Python Files
            </TabsTrigger>
            <TabsTrigger value="n8n" className="data-[state=active]:bg-emerald-600/20">
              <Workflow className="w-4 h-4 mr-2" />
              n8n Workflow
            </TabsTrigger>
            <TabsTrigger value="json" className="data-[state=active]:bg-emerald-600/20">
              <FileText className="w-4 h-4 mr-2" />
              JSON Config
            </TabsTrigger>
          </TabsList>

          <TabsContent value="python" className="space-y-4">
            <div>
              <Label htmlFor="python-upload" className="text-sm font-medium text-gray-300">
                Upload Python Files (.py)
              </Label>
              <div className="mt-2">
                <Input
                  id="python-upload"
                  type="file"
                  multiple
                  accept=".py"
                  onChange={handlePythonUpload}
                  className="bg-gray-800/50 border-gray-600"
                />
              </div>
              {pythonFiles.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-400 mb-2">Selected files:</p>
                  <div className="space-y-1">
                    {pythonFiles.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                        <FileCode className="w-4 h-4 text-emerald-500" />
                        <span>{file.name}</span>
                        <span className="text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button 
              onClick={processPythonFiles}
              disabled={pythonFiles.length === 0 || isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isProcessing ? "Processing..." : "Create Agent from Python"}
            </Button>
          </TabsContent>

          <TabsContent value="n8n" className="space-y-4">
            <div>
              <Label htmlFor="n8n-url" className="text-sm font-medium text-gray-300">
                n8n Workflow URL
              </Label>
              <div className="mt-2 flex space-x-2">
                <Input
                  id="n8n-url"
                  placeholder="https://your-n8n-instance.com/workflow/123"
                  value={n8nUrl}
                  onChange={(e) => setN8nUrl(e.target.value)}
                  className="flex-1 bg-gray-800/50 border-gray-600"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://n8n.io', '_blank')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Paste the URL of your n8n workflow. Make sure it's publicly accessible or provide authentication.
              </p>
            </div>
            <Button 
              onClick={processN8nWorkflow}
              disabled={!n8nUrl.trim() || isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isProcessing ? "Importing..." : "Import n8n Workflow"}
            </Button>
          </TabsContent>

          <TabsContent value="json" className="space-y-4">
            <div>
              <Label htmlFor="json-config" className="text-sm font-medium text-gray-300">
                Agent JSON Configuration
              </Label>
              <Textarea
                id="json-config"
                placeholder={`{
  "name": "My Custom Agent",
  "description": "Agent description",
  "category": "Productivity", 
  "aiModel": "gpt-4o",
  "tools": ["Web Search", "Email"],
  "pricing": 0.05,
  "accessType": "public"
}`}
                value={jsonConfig}
                onChange={(e) => setJsonConfig(e.target.value)}
                className="min-h-[200px] bg-gray-800/50 border-gray-600 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide a JSON configuration with your agent settings, tools, and behavior.
              </p>
            </div>
            <Button 
              onClick={processJsonConfig}
              disabled={!jsonConfig.trim() || isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isProcessing ? "Processing..." : "Create Agent from JSON"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Helper functions
function extractToolsFromPython(files: { name: string; content: string }[]): string[] {
  const tools = new Set<string>();
  
  files.forEach(file => {
    const content = file.content.toLowerCase();
    
    // Check for common imports and libraries
    if (content.includes('requests') || content.includes('urllib')) tools.add('HTTP Request');
    if (content.includes('pandas') || content.includes('numpy')) tools.add('Google Sheets');
    if (content.includes('sqlite') || content.includes('sqlalchemy')) tools.add('MySQL');
    if (content.includes('smtplib') || content.includes('email')) tools.add('Gmail');
    if (content.includes('selenium') || content.includes('beautifulsoup')) tools.add('HTTP Request');
    if (content.includes('pillow') || content.includes('opencv')) tools.add('File Storage');
    if (content.includes('flask') || content.includes('fastapi')) tools.add('Webhooks');
    if (content.includes('schedule') || content.includes('cron')) tools.add('Google Calendar');
    if (content.includes('openai')) tools.add('OpenAI');
    if (content.includes('stripe')) tools.add('Stripe');
    if (content.includes('slack')) tools.add('Slack');
    if (content.includes('discord')) tools.add('Discord');
    if (content.includes('telegram')) tools.add('Telegram');
    if (content.includes('notion')) tools.add('Notion');
    if (content.includes('airtable')) tools.add('Airtable');
  });
  
  return Array.from(tools);
}

function extractWorkflowId(url: string): string {
  // Extract workflow ID from n8n URL
  const match = url.match(/workflow\/(\d+)/);
  return match ? match[1] : '';
}