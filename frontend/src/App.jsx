import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { UserData } from "./context/User";
import Loading from "./components/Loading";
import Admin from "./pages/Admin";
import PlayList from "./pages/PlayList";
import Album from "./pages/Album";
import ExplorePremiumPage from "./pages/ExplorePremiumPage";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import PrivateRoute from "./components/PrivateRoute";
import ChatbotPage from "./pages/ChatbotPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
// In App.jsx or Routes.jsx
import Dashboard from "./pages/Dashboard";

<Route path="/dashboard" element={<Dashboard />} />


// ✅ Import Theme context
import { useTheme } from "./context/ThemeContext";

const App = () => {
  const { loading, user, isAuth } = UserData();
  const { darkMode } = useTheme(); // ✅ Get dark mode value

  if (loading) return <Loading />;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white text-black dark:bg-[#0f172a] dark:text-white transition-colors duration-300">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={<PrivateRoute isAuth={isAuth} element={<Home />} />}
            />
            <Route
              path="/playlist"
              element={
                <PrivateRoute isAuth={isAuth} element={<PlayList user={user} />} />
              }
            />
            <Route
              path="/album/:id"
              element={
                <PrivateRoute isAuth={isAuth} element={<Album user={user} />} />
              }
            />
            <Route
              path="/admin"
              element={<PrivateRoute isAuth={isAuth} element={<Admin />} />}
            />
            <Route
              path="/explore-premium"
              element={
                <PrivateRoute isAuth={isAuth} element={<ExplorePremiumPage />} />
              }
            />
            <Route
              path="/chatbot"
              element={<PrivateRoute isAuth={isAuth} element={<ChatbotPage />} />}
            />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Stripe Pages */}
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<CancelPage />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
