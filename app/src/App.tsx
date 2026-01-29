import { useState, useEffect } from 'react';
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
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthSection onAuth={() => setIsAuthenticated(true)} />;
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
      case 'admin':
        return <AdminSection />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
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
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
