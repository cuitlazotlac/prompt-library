import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Home } from '@/pages/Home';
import { CreatePrompt } from '@/pages/CreatePrompt';
import { EditPrompt } from '@/pages/EditPrompt';
import { Profile } from '@/pages/Profile';
import Admin from '@/pages/Admin';
import Navigation from '@/components/Navigation';
import '@/styles/themes.css';

const queryClient = new QueryClient();

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="font-sans">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <Router>
              <Navigation 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <Routes>
                <Route path="/" element={<Home searchQuery={searchQuery} />} />
                <Route path="/create" element={<CreatePrompt />} />
                <Route path="/edit/:id" element={<EditPrompt />} />
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