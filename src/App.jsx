import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Page imports
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import AIAnalyzer from './pages/AIAnalyzer';
import SocialLab from './pages/SocialLab';
import Journal from './pages/Journal';
import Analytics from './pages/Analytics';
import Ethnography from './pages/Ethnography';
import Modules from './pages/Modules';
import Achievements from './pages/Achievements';
import LecturerDashboard from './pages/LecturerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import LearningEcosystem from './pages/LearningEcosystem';
import CulturalWisdom from './pages/CulturalWisdom';
import Notifications from './pages/Notifications';
import DashboardLayout from './components/dashboard/DashboardLayout';
import GroupChallenge from './pages/GroupChallenge';
import CaseLibrary from './pages/CaseLibrary';
import Community from './pages/Community';
import AdaptiveLearning from './pages/AdaptiveLearning';
import WeeklyReport from './pages/WeeklyReport';

// After login redirect, send user to correct dashboard based on role intent
const RoleRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoadingAuth } = useAuth();

  useEffect(() => {
    if (isLoadingAuth) return;
    if (isAuthenticated) {
      const intent = sessionStorage.getItem('login_role_intent');
      sessionStorage.removeItem('login_role_intent');
      if (intent === 'dosen') {
        navigate('/lecturer', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      // Not authenticated after redirect — go back to landing
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoadingAuth, navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-sm text-muted-foreground">Mengalihkan...</p>
      </div>
    </div>
  );
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, authError } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Memuat PragmaticsAI...</p>
        </div>
      </div>
    );
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/role-redirect" element={<RoleRedirect />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-analyzer" element={<AIAnalyzer />} />
        <Route path="/social-lab" element={<SocialLab />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/ethnography" element={<Ethnography />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/lecturer" element={<LecturerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/learning-ecosystem" element={<LearningEcosystem />} />
        <Route path="/cultural-wisdom" element={<CulturalWisdom />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/group-challenge" element={<GroupChallenge />} />
        <Route path="/case-library" element={<CaseLibrary />} />
        <Route path="/community" element={<Community />} />
        <Route path="/adaptive-learning" element={<AdaptiveLearning />} />
        <Route path="/weekly-report" element={<WeeklyReport />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App