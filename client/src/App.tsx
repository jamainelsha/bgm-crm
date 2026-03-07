import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";

// Core pages
import Dashboard from "./pages/Dashboard";
import Residents from "./pages/Residents";
import Units from "./pages/Units";
import Contracts from "./pages/Contracts";

// Sales pages
import Leads from "./pages/Leads";
import Waitlist from "./pages/Waitlist";
import Appointments from "./pages/Appointments";

// Operations pages
import Tasks from "./pages/Tasks";
import Maintenance from "./pages/Maintenance";
import SimCards from "./pages/SimCards";

// Admin pages
import Reports from "./pages/Reports";
import Templates from "./pages/Templates";
import Documents from "./pages/Documents";
import ResidentOnboarding from "./pages/ResidentOnboarding";

function Router() {
  return (
    <Layout taskBadge={3} maintenanceBadge={2}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/residents" component={Residents} />
        <Route path="/units" component={Units} />
        <Route path="/contracts" component={Contracts} />
        <Route path="/leads" component={Leads} />
        <Route path="/waitlist" component={Waitlist} />
        <Route path="/appointments" component={Appointments} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/maintenance" component={Maintenance} />
        <Route path="/sim-cards" component={SimCards} />
        <Route path="/reports" component={Reports} />
        <Route path="/templates" component={Templates} />
        <Route path="/documents" component={Documents} />
        <Route path="/onboarding" component={ResidentOnboarding} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
