import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { localUser } from '@/lib/localUser';

// Page imports
import { useEffect, useState } from 'react';
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
import AIPragmaticsTutor from './pages/AIPragmaticsTutor';
import VirtualRoleplayLab from './pages/VirtualRoleplayLab';
import EthnographyCaseLibrary from './pages/EthnographyCaseLibrary';
import StudyGroupCollaboration from './pages/StudyGroupCollaboration';
import PragmaticCulturalTour from './pages/PragmaticCulturalTour';
import InstitutionSetup from './pages/InstitutionSetup';
import ClassManagement from './pages/ClassManagement';
import JoinClass from './pages/JoinClass';
import LecturerAnalyticsDashboard from './pages/LecturerAnalyticsDashboard';
import CulturalCaseTraining from './pages/CulturalCaseTraining';
import AdminPanel from './pages/AdminPanel';
import ProfileSetup from './pages/ProfileSetup';
import DosenDashboard from './pages/DosenDashboard';
import ClassChat from './pages/ClassChat';
import EthnographyForum from './pages/EthnographyForum';
import PragmaticReport from './pages/PragmaticReport';

const AuthenticatedApp = () => {
  const [localU, setLocalU] = useState(() => localUser.get());

  // Re-check localUser when navigating (e.g. after login)
  useEffect(() => {
    const check = () => setLocalU(localUser.get());
    window.addEventListener('storage', check);
    // Interval fallback for same-tab updates
    const iv = setInterval(check, 300);
    return () => { window.removeEventListener('storage', check); clearInterval(iv); };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
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
        <Route path="/ai-pragmatics-tutor" element={<AIPragmaticsTutor />} />
        <Route path="/virtual-roleplay-lab" element={<VirtualRoleplayLab />} />
        <Route path="/ethnography-case-library" element={<EthnographyCaseLibrary />} />
        <Route path="/study-group" element={<StudyGroupCollaboration />} />
        <Route path="/pragmatic-cultural-tour" element={<PragmaticCulturalTour />} />
        <Route path="/institution-setup" element={<InstitutionSetup />} />
        <Route path="/class-management" element={<ClassManagement />} />
        <Route path="/join-class" element={<JoinClass />} />
        <Route path="/lecturer-analytics" element={<LecturerAnalyticsDashboard />} />
        <Route path="/cultural-case-training" element={<CulturalCaseTraining />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/dosen-dashboard" element={<DosenDashboard />} />
        <Route path="/class-chat" element={<ClassChat />} />
        <Route path="/ethnography-forum" element={<EthnographyForum />} />
        <Route path="/pragmatic-report" element={<PragmaticReport />} />
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