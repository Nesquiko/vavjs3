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
import { Ad, RideEntry, RideType, User } from './model.ts';
import { AdminPage } from './pages/AdminPage.tsx';
import { AnnoyingAd } from './pages/AnnoyingAd.tsx';
import { RideGraphs } from './pages/RideGraphs.tsx';

const AD_SHOW_AFTER_SECS = 60;

const Root = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [ad, setAd] = useState<Ad | undefined>(undefined);
  const navigation = useNavigate();

  const setRideTypes = (rideTypes: RideType[]) => {
    setUser({ ...user!, rideTypes: rideTypes });
  };

  const setRideEntries = (rideEntries: RideEntry[]) => {
    setUser({ ...user!, rides: rideEntries });
  };

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

  useEffect(() => {
    async function fetAd() {
      await fetch(import.meta.env.VITE_BACKEND_URL + '/ad', {
        credentials: 'include',
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch ad');
          }
        })
        .then((ad) => {
          setAd(ad);
        })
        .catch(() => {
          setAd(undefined);
        });
    }
    fetAd();
  }, []);

  return (
    <>
      {ad && (
        <AnnoyingAd user={user} ad={ad} showAfterSecs={AD_SHOW_AFTER_SECS} />
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute user={user} checkAdmin={false}>
              <HomePage
                user={user!}
                setRideTypes={setRideTypes}
                setRideEntries={setRideEntries}
                setUser={setUser}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} checkAdmin={true}>
              <AdminPage ad={ad} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/graphs"
          element={
            <ProtectedRoute user={user} checkAdmin={false}>
              <RideGraphs rides={user?.rides} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>,
);
