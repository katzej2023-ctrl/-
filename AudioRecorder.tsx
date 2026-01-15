import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from './Button';

interface AudioRecorderProps {
  onRecordingComplete: (audioBase64: string) => void;
  autoStart?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, autoStart }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          if (reader.result) {
             onRecordingComplete(reader.result as string);
          }
        };
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  if (error) {
    return <div className="text-bauhaus-red font-bold border-2 border-bauhaus-red p-4">{error}</div>;
  }

  return (
    <div className="w-full">
      {isRecording ? (
        <div className="animate-pulse border-2 border-bauhaus-red bg-red-50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-4 h-4 bg-bauhaus-red rounded-full animate-ping"></div>
             <span className="font-bold text-bauhaus-red uppercase">Aufnahme läuft...</span>
          </div>
          <Button variant="danger" onClick={stopRecording} className="text-sm py-1 px-3">
            <Square className="w-4 h-4 mr-1 fill-current" /> Stop
          </Button>
        </div>
      ) : (
         <div className="text-center text-gray-500 italic">
            Waiting for recording to start...
         </div>
      )}
    </div>
  );
};