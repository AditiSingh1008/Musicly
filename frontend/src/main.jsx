import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/User.jsx";
import { SongProvider } from "./context/Song.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx"; // ✅ import this

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider> {/* ✅ wrap everything here */}
      <UserProvider>
        <SongProvider>
          <App />
        </SongProvider>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>
);

// ✅ Register service worker if it exists
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("✅ Service Worker registered:", reg);
      })
      .catch((err) => {
        console.error("❌ Service Worker registration failed:", err);
      });
  });
}
