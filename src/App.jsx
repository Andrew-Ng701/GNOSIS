import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppShell from "./components/AppShell";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import MatchPage from "./pages/MatchPage";
import AIAgentPage from "./pages/AIAgentPage";
import CommunityPage from "./pages/CommunityPage";
import MorePage from "./pages/MorePage";
import TimelinePage from "./pages/TimelinePage";
import DocumentsPage from "./pages/DocumentsPage";
import { getOnboardingComplete } from "./lib/storage";

function ProtectedRoute({ children }) {
  const done = getOnboardingComplete();
  const location = useLocation();

  if (!done && location.pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <AppShell>
              <HomePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/match"
        element={
          <ProtectedRoute>
            <AppShell>
              <MatchPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-agent"
        element={
          <ProtectedRoute>
            <AppShell>
              <AIAgentPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <AppShell>
              <CommunityPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/more"
        element={
          <ProtectedRoute>
            <AppShell>
              <MorePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/timeline"
        element={
          <ProtectedRoute>
            <AppShell showNav={false}>
              <TimelinePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <AppShell showNav={false}>
              <DocumentsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
