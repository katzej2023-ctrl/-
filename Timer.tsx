import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number; // in seconds
  label: string;
  onComplete: () => void;
  isActive: boolean;
}

export const Timer: React.FC<TimerProps> = ({ duration, label, onComplete, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (isActive && timeLeft <= 0) onComplete();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="border-2 border-bauhaus-black p-4 bg-white mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 font-bold uppercase text-bauhaus-blue">
          <Clock className="w-5 h-5" />
          {label}
        </div>
        <div className="text-4xl font-black tabular-nums tracking-tight">
          {formatTime(timeLeft)}
        </div>
      </div>
      
      {/* Bauhaus Progress Bar */}
      <div className="w-full h-4 border-2 border-bauhaus-black bg-gray-100 relative">
        <div 
          className="h-full bg-bauhaus-red transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};