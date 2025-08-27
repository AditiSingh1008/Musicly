import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Player from "./Player";

const Layout = ({ children }) => {
  return (
    <div className="h-screen bg-white text-black dark:bg-[#121212] dark:text-white transition-colors duration-300">
      <div className="h-[90%] flex">
        <Sidebar />
        <div className="w-full m-2 px-6 pt-4 rounded overflow-auto lg:w-[75%] lg:ml-0">
          <Navbar />
          {children}
        </div>
      </div>
      <Player />
    </div>
  );
};

export default Layout;
