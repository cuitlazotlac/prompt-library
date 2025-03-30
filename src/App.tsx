import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { CreatePrompt } from './pages/CreatePrompt';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { EditPrompt } from './pages/EditPrompt';
import PromptDetail from './pages/PromptDetail';
import Admin from './pages/Admin';

// Create a client
const queryClient = new QueryClient();

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Navigation searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home searchQuery={searchQuery} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/create" element={<CreatePrompt />} />
                <Route path="/edit/:id" element={<EditPrompt />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/prompt/:id" element={<PromptDetail />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
          </div>
          <Toaster position="bottom-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App; 