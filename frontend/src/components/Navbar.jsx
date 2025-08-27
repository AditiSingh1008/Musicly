import React, { useEffect, useState, useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate, Link } from "react-router-dom";
import { UserData } from "../context/User";
import { FaBars } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { logoutUser, user } = UserData();
  const [isPremium, setIsPremium] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const premiumFlag = localStorage.getItem("isPremiumUser");
    setIsPremium(premiumFlag === "true");
  }, []);

  const handlePremiumClick = () => {
    navigate("/explore-premium");
  };

  // Common theme-friendly button style
  const themeButton = "px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black text-[14px] rounded-full transition whitespace-nowrap";

  return (
    <div className={`w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} shadow-md px-4 sm:px-6 py-3`}>
      <div className="flex justify-between items-center">
        {/* Arrows */}
        <div className="flex items-center gap-3">
  <img
    src={darkMode ? assets.left_arrow_dark : assets.left_arrow_light}
    className="w-6 h-6 cursor-pointer hover:opacity-80 transition"
    onClick={() => navigate(-1)}
    alt="Left"
  />
  <img
    src={darkMode ? assets.right_arrow_dark : assets.right_arrow_light}
    className="w-6 h-6 cursor-pointer hover:opacity-80 transition"
    onClick={() => navigate(1)}
    alt="Right"
  />
</div>


        {/* Hamburger (Mobile) */}
        <div className="md:hidden">
          <FaBars
            className="text-xl cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-4">
          {user?.role === "admin" && (
            <button onClick={() => navigate("/admin")} className={themeButton}>
              Admin Dashboard 🛠️
            </button>
          )}

          <button onClick={() => navigate("/chatbot")} className={themeButton}>
            Chatbot 🤖
          </button>

          {!isPremium ? (
            <button onClick={handlePremiumClick} className={themeButton}>
              Explore Premium
            </button>
          ) : (
            <p className="px-4 py-1.5 bg-green-500 text-white text-[14px] rounded-full whitespace-nowrap">
              Premium User 🌟
            </p>
          )}

          <button onClick={logoutUser} className={themeButton}>
            Logout
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white text-black dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            title="Toggle Theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="flex flex-col gap-2 mt-3 md:hidden">
          {user?.role === "admin" && (
            <button onClick={() => { navigate("/admin"); setMenuOpen(false); }} className={themeButton}>
              Admin Dashboard 🛠️
            </button>
          )}

          <button onClick={() => { navigate("/chatbot"); setMenuOpen(false); }} className={themeButton}>
            Chatbot 🤖
          </button>

          {!isPremium ? (
            <button onClick={() => { handlePremiumClick(); setMenuOpen(false); }} className={themeButton}>
              Explore Premium
            </button>
          ) : (
            <p className="px-4 py-1.5 bg-green-500 text-white text-[14px] rounded-full">
              Premium User 🌟
            </p>
          )}

          <button onClick={() => { logoutUser(); setMenuOpen(false); }} className={themeButton}>
            Logout
          </button>

          {/* Mobile Theme Toggle */}
          <button
            onClick={() => {
              toggleTheme();
              setMenuOpen(false);
            }}
            className={themeButton}
          >
            {darkMode ? "Switch to Light 🌞" : "Switch to Dark 🌙"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
