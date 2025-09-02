import { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { motion } from "framer-motion";
import mediaData from "../data/media.json";
import { socket, sendMediaUpdate } from "../socket";

// Helper function to format time
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds)) return "00:00";
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function MediaPlayer() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState({ currentTime: 0, duration: 0, percentage: 0 });
  const [volume, setVolume] = useState(0.75);

  const audioRef = useRef(null);
  const safeMediaData = Array.isArray(mediaData) ? mediaData : [];
  const track = safeMediaData[idx];

  // Effect to control the audio hardware
  useEffect(() => {
    if (playing) {
      audioRef.current.play().catch(e => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [playing, idx]);

  // Effect to listen for server updates
  useEffect(() => {
    const handleMediaUpdate = (state) => {
      if (state.idx !== idx) setIdx(state.idx);
      if (state.playing !== playing) setPlaying(state.playing);
    };
    socket.on('mediaControl', handleMediaUpdate);
    return () => socket.off('mediaControl', handleMediaUpdate);
  }, [idx, playing]);
  
  // --- THIS SECTION WAS MISSING ---
  // --- All Click Handlers ---

  const handleNext = () => {
    const newIndex = (idx + 1) % safeMediaData.length;
    setIdx(newIndex);
    sendMediaUpdate({ idx: newIndex, playing });
  };
  
  const handlePrev = () => {
    const newIndex = (idx - 1 + safeMediaData.length) % safeMediaData.length;
    setIdx(newIndex);
    sendMediaUpdate({ idx: newIndex, playing });
  };
  
  const handleTogglePlay = () => {
    const newIsPlaying = !playing;
    setPlaying(newIsPlaying);
    sendMediaUpdate({ idx, playing: newIsPlaying });
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleProgressChange = (e) => {
    const newPercentage = e.target.value;
    const newTime = (audioRef.current.duration / 100) * newPercentage;
    audioRef.current.currentTime = newTime;
  };

  if (!track) {
    return ( <div className="..."><p>Loading...</p></div> );
  }

  // --- JSX for Rendering ---
  return (
    <motion.div
      className="bg-zinc-900 text-white rounded-lg p-4 sm:p-6 shadow-2xl w-full max-w-sm mx-auto"
    >
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onTimeUpdate={() => {
          setProgress(p => ({ ...p, currentTime: audioRef.current.currentTime, percentage: (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0 }))
        }}
        onLoadedData={() => {
          setProgress(p => ({...p, duration: audioRef.current.duration}));
          audioRef.current.volume = volume;
        }}
      />
      
      <div className="flex items-center gap-4">
        <motion.img key={track.src} src={track.albumArt} alt="Album Art" className="w-16 h-16 rounded-md shadow-md" />
        <div className="flex-1">
          <h3 className="font-bold text-lg truncate">{track.title}</h3>
          <p className="text-sm text-gray-400 truncate">{track.artist}</p>
        </div>
      </div>
  
      <div className="w-full mt-4">
        <input type="range" min="0" max="100" step="0.1" value={progress.percentage} onChange={handleProgressChange} className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(progress.currentTime)}</span>
          <span>{formatTime(progress.duration)}</span>
        </div>
      </div>
  
      <div className="flex items-center justify-between mt-3">
        <div className="flex-1"></div>
        <div className="flex items-center gap-6">
          <motion.button onClick={handlePrev} className="text-gray-400 hover:text-white"><FaBackward size={20} /></motion.button>
          <motion.button onClick={handleTogglePlay} className="p-4 rounded-full bg-white text-black shadow-lg">
            {playing ? <FaPause size={22} /> : <FaPlay size={22} />}
          </motion.button>
          <motion.button onClick={handleNext} className="text-gray-400 hover:text-white"><FaForward size={20} /></motion.button>
        </div>
        
        <div className="flex-1 flex items-center justify-end gap-2">
          {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
        </div>
      </div>
    </motion.div>
  );
}