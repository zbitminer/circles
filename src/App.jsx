import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import AppShell from './components/layout/AppShell';
import Feed from './pages/Feed';
import Home from './pages/Home';
import Opportunities from './pages/Opportunities';
import Workshops from './pages/Workshops';
import Events from './pages/Events';
import Profile from './pages/Profile';
import Moderation from './pages/Moderation';
import Admin from './pages/Admin';
import Directory from './pages/Directory';
import SosBoard from './pages/SosBoard';
import ShabbatMeals from './pages/ShabbatMeals';
import Corporate from './pages/Corporate';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import MessagesPage from './pages/Messages';
import CommunityChatPage from './pages/CommunityChat';
import Analytics from './pages/Analytics';
import Contact from './pages/Contact';
import Sitemap from './pages/Sitemap';
import Health from './pages/Health';
import Donate from './pages/Donate';
import About from './pages/About';
import Trust from './pages/Trust';
import PlatformOverview from './pages/PlatformOverview';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Loading VolunteerHub...</p>
        </div>
      </div>
    );
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  return (
    <Routes>
      {/* Auth routes — always accessible */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Public browsing routes */}
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/events" element={<Events />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/sos" element={<SosBoard />} />
        <Route path="/shabbat" element={<ShabbatMeals />} />
        <Route path="/corporate" element={<Corporate />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="/health" element={<Health />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/about" element={<About />} />
        <Route path="/trust" element={<Trust />} />
        <Route path="/platform" element={<PlatformOverview />} />
      </Route>

      {/* Protected routes — require login */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AppShell />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/chat" element={<CommunityChatPage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/moderation" element={<ProtectedRoute requiredRoles={['admin', 'moderator']} unauthenticatedElement={<Navigate to="/login" replace />} />} />
          <Route path="/admin" element={<ProtectedRoute requiredRoles={['admin']} unauthenticatedElement={<Navigate to="/login" replace />} />} />
        </Route>
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
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App