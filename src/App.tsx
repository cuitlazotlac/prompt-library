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
import { Navigation } from '@/components/Navigation';
import PromptDetail from '@/pages/PromptDetail';
import '@/styles/themes.css';

// Create a client
const queryClient = new QueryClient();

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <div className="min-h-screen">
              <Navigation 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery} 
              />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home searchQuery={searchQuery} />} />
                  <Route path="/create" element={<CreatePrompt />} />
                  <Route path="/edit/:id" element={<EditPrompt />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/prompt/:id" element={<PromptDetail />} />
                </Routes>
              </main>
            </div>
          </Router>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
} 