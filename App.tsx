import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ArticleDetail } from './pages/ArticleDetail';
import { Directory } from './pages/Directory';
import { Events } from './pages/Events';
import { AdminDashboard } from './pages/Admin';
import { User, AppState } from './types';
import { Button } from './components/Common';

// Simple Login Component
const Login = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@citypulse.com' && password === 'admin') {
      onLogin({ id: '1', name: 'Admin User', email, role: 'admin' });
    } else {
      setError('Invalid credentials. Try admin@citypulse.com / admin');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Staff Login</h2>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              required 
            />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
        <p className="mt-4 text-xs text-center text-gray-500">Demo: admin@citypulse.com / admin</p>
      </div>
    </div>
  );
};

// Simple Contact Page
const Contact = () => (
    <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Contact Us</h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <form onSubmit={e => { e.preventDefault(); alert("Message sent!"); }} className="space-y-4">
                <input placeholder="Name" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                <input type="email" placeholder="Email" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                <textarea rows={4} placeholder="Message" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                <Button type="submit">Send Message</Button>
            </form>
        </div>
    </div>
);

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; user: User | null }> = ({ children, user }) => {
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const App = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Router>
      <ScrollToTop />
      <Layout 
        user={user} 
        toggleTheme={toggleTheme} 
        isDark={theme === 'dark'}
        onLogout={() => setUser(null)}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticleDetail user={user} />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={user ? <Navigate to="/admin" /> : <Login onLogin={setUser} />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute user={user}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;