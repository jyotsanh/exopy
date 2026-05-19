import { useState, useEffect, useCallback } from "react";
import { MdPause, MdStop, MdPlayArrow } from "react-icons/md";

interface TimeTrackerCardProps {
  initialSeconds?: number;
  autoStart?: boolean;
  onTimeUpdate?: (seconds: number) => void;
  onStop?: (totalSeconds: number) => void;
}

const TimeTrackerCard: React.FC<TimeTrackerCardProps> = ({
  initialSeconds = 0,
  autoStart = false,
  onTimeUpdate,
  onStop,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);

  // Timer effect
  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setSeconds((prev) => {
        const newValue = prev + 1;
        onTimeUpdate?.(newValue);
        return newValue;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, onTimeUpdate]);

  // Format time helper
  const formatTime = useCallback((totalSeconds: number): string => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  }, []);

  // Handlers
  const handleToggle = () => setIsRunning((prev) => !prev);

  const handleStop = () => {
    onStop?.(seconds);
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <div className="rounded-2xl p-5 flex flex-col items-center gap-4 bg-linear-to-br from-green-950 to-green-900 shadow-xl shadow-green-950/50 relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-green-700/20" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-green-600/10" />

      <span className="self-start text-base font-bold text-white relative z-10">
        Time Tracker
      </span>

      <span className="text-4xl font-black text-white tracking-widest font-mono relative z-10 drop-shadow-[0_0_20px_rgba(74,222,128,0.5)]">
        {formatTime(seconds)}
      </span>

      <div className="flex gap-3 relative z-10">
        <button
          onClick={handleToggle}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all"
          aria-label={isRunning ? "Pause" : "Play"}
        >
          {isRunning ? <MdPause size={20} /> : <MdPlayArrow size={20} />}
        </button>
        <button
          onClick={handleStop}
          className="w-11 h-11 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-all shadow-lg shadow-rose-500/40"
          aria-label="Stop"
        >
          <MdStop size={20} />
        </button>
      </div>
    </div>
  );
};

export default TimeTrackerCard;