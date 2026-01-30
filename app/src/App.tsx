import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { BottomNav } from '@/components/BottomNav';
import { AuthSection } from '@/sections/AuthSection';
import { HomeSection } from '@/sections/HomeSection';
import { AgendaSection } from '@/sections/AgendaSection';
import { ChallengeSection } from '@/sections/ChallengeSection';
import { RankingSection } from '@/sections/RankingSection';
import { PerfilSection } from '@/sections/PerfilSection';
import { AdminSection } from '@/sections/AdminSection';
import { ProfessorSection } from '@/sections/ProfessorSection';
import { LoadingScreen } from '@/components/LoadingScreen';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  if (loading) {
    return <LoadingScreen />;
  }

  // Fix: Use user directly instead of isAuthenticated state
  if (!user) {
    return <AuthSection />;
  }

  const renderSection = () => {
    switch (activeTab) {
      case 'home':
        return <HomeSection onNavigate={setActiveTab} />;
      case 'agenda':
        return <AgendaSection />;
      case 'jogos':
        return <ChallengeSection />;
      case 'ranking':
        return <RankingSection />;
      case 'perfil':
        return <PerfilSection />;
      case 'professor':
        return <ProfessorSection />;
      case 'admin':
        return <AdminSection />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {renderSection()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#422006',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
