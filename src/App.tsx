import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Home } from '@/pages/Home';
import { CreatePrompt } from '@/pages/CreatePrompt';
import { EditPrompt } from '@/pages/EditPrompt';
import { Profile } from '@/pages/Profile';
import Admin from '@/pages/Admin';
import Navigation from '@/components/Navigation';
import PromptDetail from '@/pages/PromptDetail';
import posthog from '@/lib/posthog';
import { useEffect } from 'react';
import '@/styles/themes.css';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  useEffect(() => {
    // Capture page views when the route changes
    const handleRouteChange = () => {
      posthog.capture('$pageview')
    }

    window.addEventListener('popstate', handleRouteChange)
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  return (
    <div className="font-sans">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <Router>
              <Navigation />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/prompt/:id" element={<PromptDetail />} />
                <Route path="/create" element={<CreatePrompt />} />
                <Route 
                  path="/edit/:id" 
                  element={
                    <ProtectedRoute>
                      <EditPrompt />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
              <Toaster />
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App; 