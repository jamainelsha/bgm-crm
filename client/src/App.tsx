// BGM CRM — App Router
// Design: Precision Slate — all routes wrapped in persistent sidebar layout

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ResidentsPage from "./pages/Residents";
import UnitsPage from "./pages/Units";
import ContractsPage from "./pages/Contracts";
import EnquiriesPage from "./pages/Enquiries";
import WaitlistPage from "./pages/Waitlist";
import AppointmentsPage from "./pages/Appointments";
import TasksPage from "./pages/Tasks";
import MaintenancePage from "./pages/Maintenance";
import DocumentsPage from "./pages/Documents";
import ReportsPage from "./pages/Reports";
import { tasks, maintenanceRequests, enquiries } from "./lib/data";

// Compute badge counts
const taskBadge = tasks.filter(t => t.status === 'Overdue').length;
const maintenanceBadge = maintenanceRequests.filter(m => m.priority === 'Urgent' && m.status !== 'Completed').length;
const enquiryBadge = enquiries.filter(e => e.status === 'New').length;

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout taskBadge={taskBadge} maintenanceBadge={maintenanceBadge} enquiryBadge={enquiryBadge}>
      {children}
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <AppLayout><Dashboard /></AppLayout>} />
      <Route path="/residents" component={() => <AppLayout><ResidentsPage /></AppLayout>} />
      <Route path="/units" component={() => <AppLayout><UnitsPage /></AppLayout>} />
      <Route path="/contracts" component={() => <AppLayout><ContractsPage /></AppLayout>} />
      <Route path="/enquiries" component={() => <AppLayout><EnquiriesPage /></AppLayout>} />
      <Route path="/waitlist" component={() => <AppLayout><WaitlistPage /></AppLayout>} />
      <Route path="/appointments" component={() => <AppLayout><AppointmentsPage /></AppLayout>} />
      <Route path="/tasks" component={() => <AppLayout><TasksPage /></AppLayout>} />
      <Route path="/maintenance" component={() => <AppLayout><MaintenancePage /></AppLayout>} />
      <Route path="/documents" component={() => <AppLayout><DocumentsPage /></AppLayout>} />
      <Route path="/reports" component={() => <AppLayout><ReportsPage /></AppLayout>} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="bottom-right" richColors />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
