import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Exhibition from '@/pages/Exhibition';
import ExhibitionDetail from '@/pages/ExhibitionDetail';
import Meetings from '@/pages/Meetings';
import MeetingDetail from '@/pages/MeetingDetail';
import Center from '@/pages/Center';
import Profile from '@/pages/center/Profile';
import Settings from '@/pages/center/Settings';
import Documents from '@/pages/center/Documents';
import Coaching from '@/pages/center/Coaching';
import Work from '@/pages/Work';
import Family from '@/pages/Family';
import Friends from '@/pages/Friends';
import Support from '@/pages/Support';
import SupportArticles from '@/pages/SupportArticles';
import SupportCommunity from '@/pages/SupportCommunity';
import SupportJournal from '@/pages/SupportJournal';
import CenterLayout from '@/components/center/CenterLayout';
import AdminLayout from '@/components/admin/AdminLayout';
import UserManagement from '@/pages/UserManagement';
import Events from '@/pages/Events';
import Analytics from '@/pages/Analytics';
import Hadmin from '@/pages/Hadmin';
import AdminMeetings from '@/pages/AdminMeetings';
import AdminContent from '@/pages/AdminContent';
import AdminRegistrations from '@/pages/AdminRegistrations';
import AdminExhibition from '@/pages/AdminExhibition';
import AdminGuestbook from '@/pages/AdminGuestbook';
import AdminCountdown from '@/pages/AdminCountdown';
import UnderConstruction from '@/pages/UnderConstruction';
import Teaser from '@/pages/Teaser';
import AdminRoute from '@/components/AdminRoute';

const AuthenticatedApp = () => {
  const { isLoadingPublicSettings } = useAuth();

  // Show loading spinner while checking app public settings
  if (isLoadingPublicSettings) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render the main app - /center routes require login via ProtectedRoute
  return (
   <Routes>
      {/* Add your page Route elements here */}
      <Route path="/" element={<Home />} />
      <Route path="/under-construction" element={<UnderConstruction />} />
      <Route path="/teaser" element={<Teaser />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/exhibition" element={<Exhibition />} />
      <Route path="/exhibition/:slug" element={<ExhibitionDetail />} />
      <Route path="/meetings" element={<Meetings />} />
      <Route path="/meetings/:slug" element={<MeetingDetail />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route element={<CenterLayout />}>
            <Route path="/center" element={<Center />} />
          <Route path="/center/profile" element={<Profile />} />
          <Route path="/center/settings" element={<Settings />} />
          <Route path="/center/documents" element={<Documents />} />
          <Route path="/center/coaching" element={<Coaching />} />
          <Route path="/center/work" element={<Work />} />
          <Route path="/center/family" element={<Family />} />
          <Route path="/center/friends" element={<Friends />} />
          <Route path="/center/support" element={<Support />} />
          <Route path="/center/support/articles" element={<SupportArticles />} />
          <Route path="/center/support/community" element={<SupportCommunity />} />
          <Route path="/center/support/journal" element={<SupportJournal />} />
            <Route path="/events" element={<Events />} />
          </Route>
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/hadmin" element={<Hadmin />} />
          <Route path="/hadmin/user-management" element={<UserManagement />} />
          <Route path="/hadmin/analytics" element={<Analytics />} />
          <Route path="/hadmin/meetings" element={<AdminMeetings />} />
          <Route path="/hadmin/content" element={<AdminContent />} />
          <Route path="/hadmin/registrations" element={<AdminRegistrations />} />
          <Route path="/hadmin/exhibition" element={<AdminExhibition />} />
          <Route path="/hadmin/guestbook" element={<AdminGuestbook />} />
          <Route path="/hadmin/countdown" element={<AdminCountdown />} />
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
        <Router basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
