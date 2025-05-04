import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";

import { useAuthStore } from "./stores/authStore";
import Navbar from "./landing/Navbar";
import Hero from "./landing/Hero";
import ProfilePage from "./Profile/ProfilePage";
import Avia from "./Tickets/Avia";
import Hotels from "./Hotel/Hotels";
import Cars from "./Car/Cars";
import ChatBot from "./Bot/ChatBot"; // Импортируем ChatBot

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5000";

axios.interceptors.response.use(
  (resp) => resp,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      return Promise.resolve({ data: { isAuthenticated: false } });
    }
    return Promise.reject(err);
  }
);

function AppContent() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const location = useLocation();
  const isAviaPage = location.pathname === "/avia";
  const isProfilePage = location.pathname.startsWith("/profile");

  const handleLogout = async () => {
    await axios.post("/api/logout");
    clearAuth();
  };

  return (
    <>
      {!isProfilePage && !isAviaPage && (
        <Navbar isAuthenticated={isAuthenticated} user={user} />
      )}

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route
          path="/profile"
          element={
            isAuthenticated ? <ProfilePage /> : <Navigate to="/" replace />
          }
        />
        <Route path="/avia" element={<Avia />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="*" element={<div>Страница не найдена</div>} />
      </Routes>

      {/* Компонент ChatBot теперь всегда доступен на всех страницах */}
      <ChatBot />
    </>
  );
}

export default function App() {
  const { setUser, setIsAuthenticated, clearAuth } = useAuthStore();

  useEffect(() => {
    axios
      .get("/api/check-auth")
      .then((res) => {
        if (res.data.isAuthenticated) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          clearAuth();
        }
      })
      .catch(() => clearAuth());
  }, [setUser, setIsAuthenticated, clearAuth]);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}
