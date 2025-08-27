import React, { useEffect, useRef, useState, useContext } from "react";
import { SongData } from "../context/Song";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext"; // 🔥 Theme context import

const Player = () => {
  const {
    song,
    fetchSingleSong,
    selectedSong,
    isPlaying,
    setIsPlaying,
    nextMusic,
    prevMusic,
  } = SongData();

  const { darkMode } = useContext(ThemeContext); // 🌗 Get darkMode value

  useEffect(() => {
    fetchSingleSong();
  }, [selectedSong]);

  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const [volume, setVolume] = useState(1);

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetaData = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetaData);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [song]);

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  return (
    <div>
      {song && (
        <div
          className={`h-[10%] flex justify-between items-center px-4 ${
            darkMode ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          {/* Song Thumbnail and Info */}
          <div className="lg:flex items-center gap-4">
            <img
              src={
                song.thumbnail
                  ? song.thumbnail.url
                  : "https://via.placeholder.com/50"
              }
              className="w-12"
              alt=""
            />
            <div className="hidden md:block">
              <p>{song.title}</p>
              <p>
                {song.description && song.description.slice(0, 30)}...
              </p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center gap-1 m-auto">
            {song && song.audio && (
              <>
                {isPlaying ? (
                  <audio ref={audioRef} src={song.audio.url} autoPlay />
                ) : (
                  <audio ref={audioRef} src={song.audio.url} />
                )}
              </>
            )}

            {/* Progress Bar */}
            <div className="w-full flex items-center font-thin">
              <input
                type="range"
                min="0"
                max="100"
                value={(progress / duration) * 100}
                onChange={handleProgressChange}
                className={`w-[120px] md:w-[300px] ${
                  darkMode ? "accent-green-400" : "accent-green-600"
                }`}
              />
            </div>

            {/* Playback Buttons */}
            <div className="flex justify-center items-center gap-4">
              <span className="cursor-pointer" onClick={prevMusic}>
                <GrChapterPrevious />
              </span>
              <button
                className={`rounded-full p-2 ${
                  darkMode ? "bg-white text-black" : "bg-black text-white"
                }`}
                onClick={handlePlayPause}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <span className="cursor-pointer" onClick={nextMusic}>
                <GrChapterNext />
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center">
            <input
              type="range"
              className={`w-16 md:w-32 ${
                darkMode ? "accent-green-400" : "accent-green-600"
              }`}
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
