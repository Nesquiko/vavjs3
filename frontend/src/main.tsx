import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '/src/index.css';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegistrationPage } from './pages/RegistrationPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ProtectedRoute } from './pages/ProtectedRoute';
import { User } from './model.ts';

const Root = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const navigation = useNavigate();

  useEffect(() => {
    async function fetchUserWithToken() {
      await fetch(import.meta.env.VITE_BACKEND_URL + '/user/login/token', {
        credentials: 'include',
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('User not logged in');
          }
        })
        .then((user) => {
          setUser(user);
          navigation('/home', { replace: true });
        })
        .catch(() => {
          setUser(undefined);
        });
    }
    fetchUserWithToken();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage setUser={setUser} />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute user={user}>
            <HomePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>,
);
