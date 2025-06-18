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
import Signup from "@/pages/signup-premium";
import Signin from "@/pages/signin";
import Dashboard from "@/pages/dashboard-clean";
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
      <Route path="/signup" component={Signup} />
      <Route path="/signin" component={Signin} />
      <Route path="/dashboard" component={Dashboard} />
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
