import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import PlayListCard from "./PlayListCard";
import { UserData } from "../context/User";
import { SongData } from "../context/song";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = UserData();
  const { searchSongs } = SongData();
  const [query, setQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Set initial value
    setIsDarkMode(document.documentElement.classList.contains("dark"));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full lg:w-[25%] h-full p-2 flex-col gap-2 text-black dark:text-white hidden lg:flex">
      {/* Top Section: Home & Search */}
      <div className="bg-gray-100 dark:bg-[#121212] h-fit rounded flex flex-col justify-around py-4">
        <div
          className="flex items-center gap-3 pl-8 cursor-pointer py-2"
          onClick={() => navigate("/")}
        >
          <img
            src={isDarkMode ? assets.home_icon_dark : assets.home_icon_light}
            className="w-6"
            alt="home"
          />
          <p className="font-bold text-base">Home</p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2">
          <img
            src={isDarkMode ? assets.search_icon_dark : assets.search_icon_light}
            className="w-6"
            alt="search"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              searchSongs(e.target.value);
            }}
            placeholder="Search Songs..."
            className="bg-transparent border-b border-black dark:border-white text-black dark:text-white outline-none w-full placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>

      {/* Library Section */}
      <div className="bg-gray-100 dark:bg-[#121212] rounded mt-4 overflow-y-auto max-h-[80vh]">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={isDarkMode ? assets.stack_icon_dark : assets.stack_icon_light}
              className="w-8"
              alt="library"
            />
            <p className="font-semibold text-sm">Your Library</p>
          </div>
          <div className="flex items-center gap-3">
            <img src={assets.arrow_icon} className="w-8" alt="arrow" />
            <img src={assets.plus_icon} className="w-8" alt="plus" />
          </div>
        </div>

        <div onClick={() => navigate("/playlist")}>
          <PlayListCard />
        </div>

        {/* Podcast CTA */}
        <div className="p-4 m-2 bg-gray-200 dark:bg-[#1e1e1e] rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4">
          <h1 className="text-base">Let's find some podcasts to follow</h1>
          <p className="font-light text-sm">
            We'll keep you updated on new episodes
          </p>
          <button className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black text-[14px] rounded-full mt-4">
            Browse Podcasts
          </button>
        </div>

        {/* Admin Access */}
        {/* {user && user.role === "admin" && (
          <button
            className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black text-[14px] rounded-full mt-4 ml-4"
            onClick={() => navigate("/admin")}
          >
            Admin Dashboard
          </button>
        )} */}
      </div>
    </div>
  );
};

export default Sidebar;
