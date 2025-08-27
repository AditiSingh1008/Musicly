// ✅ Updated Dashboard.jsx (final version based on your backend)

import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/user/me", {
        withCredentials: true,
      });
      setUser(res.data);
      setNewName(res.data.name);
    } catch (error) {
      console.error("Profile fetch failed:", error);
    }
  };

  const updateName = async () => {
    try {
      setUpdating(true);
      await axios.put(
        `http://localhost:5001/api/user/profile/${user._id}`,
        { name: newName },
        { withCredentials: true }
      );
      alert("Name updated!");
      fetchProfile();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  const upgradePremium = async () => {
    try {
      await axios.post(
        "http://localhost:5001/api/user/upgrade-premium",
        {},
        { withCredentials: true }
      );
      alert("You are now premium!");
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.message || "Upgrade failed");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}</h2>
      <p className="mb-1">Email: {user.email}</p>
      <p className="mb-4">
        Premium:{" "}
        <span className={user.isPremium ? "text-green-600" : "text-red-600"}>
          {user.isPremium ? "Yes ✅" : "No ❌"}
        </span>
      </p>

      {/* 📝 Update Name */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Update Name</label>
        <input
          className="border px-3 py-1 rounded w-full"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          onClick={updateName}
          disabled={updating}
          className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
        >
          {updating ? "Updating..." : "Update Name"}
        </button>
      </div>

      {/* 💎 Upgrade to Premium */}
      {!user.isPremium && (
        <button
          onClick={upgradePremium}
          className="bg-yellow-500 text-white px-4 py-2 rounded mb-4"
        >
          Upgrade to Premium
        </button>
      )}

      {/* 🎵 Playlist (with song title and artist) */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Your Playlist</h3>
        {user.playlist?.length > 0 ? (
          <ul className="list-disc list-inside">
            {user.playlist.map((song) => (
              <li key={song._id}>{song.title} — {song.artist}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No songs in playlist yet.</p>
        )}
      </div>

      {/* 📊 Listening Stats */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Listening Stats</h3>
        {user.listeningStats?.length > 0 ? (
          <ul className="list-disc list-inside">
            {user.listeningStats.map((stat, index) => (
              <li key={index}>
                {stat.type.toUpperCase()} — {stat.date} : {stat.minutesListened} mins
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No stats available yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
