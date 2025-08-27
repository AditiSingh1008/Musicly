import React, { useState } from "react";
import { UserData } from "../context/User";
import { Link, useNavigate } from "react-router-dom";
import { SongData } from "../context/Song";
import { MdDelete } from "react-icons/md";

const Admin = () => {
  const { user } = UserData();
  const {
    albums,
    songs,
    addAlbum,
    loading,
    addSong,
    addThumbnail,
    deleteSong,
  } = SongData();
  const navigate = useNavigate();

  if (user && user.role !== "admin") return navigate("/");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [singer, setSinger] = useState("");
  const [album, setAlbum] = useState("");

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const addAlbumHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    addAlbum(formData, setTitle, setDescription, setFile);
  };

  const addSongHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("singer", singer);
    formData.append("album", album);
    formData.append("file", file);

    addSong(formData, setTitle, setDescription, setFile, setSinger, setAlbum);
  };

  const addThumbnailHandler = (id) => {
    const formData = new FormData();
    formData.append("file", file);
    addThumbnail(id, formData, setFile);
  };

  const deleteHandler = (id) => {
    if (confirm("Are you sure you want to delete this song?")) {
      deleteSong(id);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#212121] dark:text-white p-8">
      <Link
        to="/"
        className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black text-[14px] rounded-full"
      >
        Go to Home Page
      </Link>

      <h2 className="text-2xl font-bold mb-6 mt-6">Add Album</h2>
      <form
        onSubmit={addAlbumHandler}
        className="bg-gray-100 dark:bg-[#181818] p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            placeholder="Title"
            className="auth-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            placeholder="Description"
            className="auth-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Thumbnail</label>
          <input
            type="file"
            className="auth-input"
            accept="image/*"
            onChange={fileChangeHandler}
            required
          />
        </div>

        <button
          disabled={loading}
          className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black text-sm rounded-full"
        >
          {loading ? "Please Wait..." : "Add"}
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-6 mt-10">Add Songs</h2>
      <form
        onSubmit={addSongHandler}
        className="bg-gray-100 dark:bg-[#181818] p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            placeholder="Title"
            className="auth-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            placeholder="Description"
            className="auth-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Singer</label>
          <input
            type="text"
            placeholder="Singer"
            className="auth-input"
            value={singer}
            onChange={(e) => setSinger(e.target.value)}
            required
          />
        </div>

        <select
          className="auth-input mb-4"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          required
        >
          <option value="">Choose Album</option>
          {albums &&
            albums.map((e, i) => (
              <option value={e._id} key={i}>
                {e.title}
              </option>
            ))}
        </select>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Audio</label>
          <input
            type="file"
            className="auth-input"
            accept="audio/*"
            onChange={fileChangeHandler}
            required
          />
        </div>

        <button
          disabled={loading}
          className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black text-sm rounded-full"
        >
          {loading ? "Please Wait..." : "Add"}
        </button>
      </form>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Added Songs</h3>
        <div className="flex justify-center md:justify-start gap-4 flex-wrap">
          {songs &&
            songs.map((e, i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-[#181818] p-4 rounded-lg shadow-md w-60"
              >
                {e.thumbnail ? (
                  <img
                    src={e.thumbnail.url}
                    alt=""
                    className="w-full h-40 object-cover rounded"
                  />
                ) : (
                  <div className="flex flex-col justify-center items-center gap-2">
                    <input type="file" onChange={fileChangeHandler} />
                    <button
                      onClick={() => addThumbnailHandler(e._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-full text-sm"
                    >
                      Add Thumbnail
                    </button>
                  </div>
                )}
                <div className="mt-2">
                  <h4 className="text-lg font-bold">{e.title}</h4>
                  <h4 className="text-sm text-gray-500 dark:text-gray-400">{e.singer}</h4>
                  <h4 className="text-sm text-gray-500 dark:text-gray-400">{e.description}</h4>
                  <button
                    onClick={() => deleteHandler(e._id)}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded-full text-sm flex items-center gap-1"
                  >
                    <MdDelete /> Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
