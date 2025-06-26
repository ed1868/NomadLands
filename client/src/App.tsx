import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Marketplace from "@/pages/marketplace";
import NomadLands from "@/pages/nomad-lands";
import SmartContracts from "@/pages/smart-contracts";
import NomadFleets from "@/pages/nomad-fleets";
import ApiDocs from "@/pages/api-docs";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/dashboard";
import Deploy from "@/pages/deploy";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/nomad-lands" component={NomadLands} />
      <Route path="/smart-contracts" component={SmartContracts} />
      <Route path="/nomad-fleets" component={NomadFleets} />
      <Route path="/api-docs" component={ApiDocs} />
      <Route path="/auth" component={Auth} />
      <Route path="/signin" component={Auth} />
      <Route path="/signup" component={Auth} />
      <Route path="/login" component={Auth} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/deploy" component={Deploy} />

      <Route path="/test-login" component={() => <div dangerouslySetInnerHTML={{__html: `
        <!DOCTYPE html>
        <html>
        <head><title>Test Login</title></head>
        <body>
          <h1>Test Login</h1>
          <button onclick="testLogin()">Test Login</button>
          <div id="result"></div>
          <script>
            async function testLogin() {
              const resultDiv = document.getElementById('result');
              try {
                const response = await fetch('/api/auth/signin', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username: 'test', password: 'testing' })
                });
                console.log('Response:', response);
                if (!response.ok) throw new Error('Login failed');
                const data = await response.json();
                console.log('Login data:', data);
                if (data.token) {
                  localStorage.setItem('token', data.token);
                  window.location.href = '/dashboard';
                }
                resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
              } catch (error) {
                console.error('Login error:', error);
                resultDiv.innerHTML = '<p style="color: red;">Error: ' + error.message + '</p>';
              }
            }
          </script>
        </body>
        </html>
      `}} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
