import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { HomePage } from './pages/HomePage';
import { PostDetailsPage } from './pages/PostDetailsPage';
import { AdminPanel } from './pages/AdminPanel';

import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './context/useThemeStore';
import { useEffect } from 'react';

function App() {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/posts/:id" element={<PostDetailsPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
