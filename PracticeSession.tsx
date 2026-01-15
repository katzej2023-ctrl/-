import React, { useState, useEffect } from 'react';
import { AppStage, TaskConfig, GeneratedTaskContent } from '../types';
import { generateTaskContent, analyzeAudioSubmission } from '../services/geminiService';
import { Button } from './Button';
import { Timer } from './Timer';
import { AudioRecorder } from './AudioRecorder';
import { Chart } from './Chart';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Play, RotateCcw, Home, Mic, Info, Loader2 } from 'lucide-react';

interface PracticeSessionProps {
  taskConfig: TaskConfig;
  onExit: () => void;
}

export const PracticeSession: React.FC<PracticeSessionProps> = ({ taskConfig, onExit }) => {
  const [stage, setStage] = useState<AppStage>(AppStage.TASK_CARD);
  const [content, setContent] = useState<GeneratedTaskContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<string>("");
  const [audioBlob, setAudioBlob] = useState<string | null>(null);

  // Initialize Task Content
  useEffect(() => {
    const initTask = async () => {
      setLoading(true);
      const data = await generateTaskContent(taskConfig);
      setContent(data);
      setLoading(false);
    };
    initTask();
  }, [taskConfig]);

  const handlePrepComplete = () => {
    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
    audio.play().catch(e => console.log("Audio play failed", e));
    setStage(AppStage.SPEAKING);
  };

  const handleSpeakingComplete = async (audioData: string) => {
    setAudioBlob(audioData);
    setStage(AppStage.ANALYSIS);
    
    // Trigger Analysis
    if (content) {
      const result = await analyzeAudioSubmission(audioData, taskConfig, content);
      setAnalysis(result);
      setStage(AppStage.FEEDBACK);
    }
  };

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="w-12 h-12 animate-spin text-bauhaus-blue mb-4" />
      <p className="font-bold text-xl tracking-widest uppercase">Generiere Daten...</p>
    </div>
  );

  if (loading || !content) return renderLoading();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* --- Task Card View --- */}
      {stage === AppStage.TASK_CARD && (
        <div className="flex flex-col gap-6">
          <div className="border-4 border-bauhaus-black p-6 bg-white shadow-bauhaus">
             <div className="flex justify-between items-start border-b-2 border-bauhaus-black pb-4 mb-4">
                <h2 className="text-2xl font-black">{content.germanTitle}</h2>
                <span className="bg-bauhaus-black text-white px-2 py-1 font-mono text-sm">
                  Aufgabe {taskConfig.id}
                </span>
             </div>
             
             <div className="prose prose-lg text-bauhaus-black mb-6">
                <p className="whitespace-pre-wrap font-medium">{content.germanTaskText}</p>
             </div>

             {(content.chartData) && (
                <Chart data={content.chartData} title={content.chartTitle} />
             )}

             <div className="mt-8 border-t-2 border-dashed border-gray-300 pt-4">
               <details className="group cursor-pointer">
                 <summary className="font-bold text-bauhaus-blue hover:text-bauhaus-red flex items-center gap-2 transition-colors list-none">
                    <Info className="w-5 h-5" /> 
                    <span>点击查看中文任务详情</span>
                 </summary>
                 <div className="mt-4 p-4 bg-gray-100 border-l-4 border-bauhaus-blue text-sm text-gray-700">
                   {content.chineseInstructions}
                 </div>
               </details>
             </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={() => setStage(AppStage.PREPARATION)} fullWidth className="max-w-md text-xl py-4">
               <Play className="w-6 h-6 fill-current" /> 
               Vorbereitung Starten ({taskConfig.prepTimeSeconds}s)
            </Button>
          </div>
        </div>
      )}

      {/* --- Preparation Phase --- */}
      {stage === AppStage.PREPARATION && (
        <div className="flex flex-col items-center justify-center py-10">
          <h2 className="text-3xl font-black mb-8">Vorbereitungszeit</h2>
          <div className="w-full max-w-xl">
             <Timer 
               duration={taskConfig.prepTimeSeconds} 
               label="Vorbereitung" 
               isActive={true}
               onComplete={handlePrepComplete} 
             />
          </div>
          <p className="text-gray-500 mt-4 text-center max-w-lg">
            Nutzen Sie die Zeit, um Notizen zu machen. Die Aufnahme startet automatisch nach Ablauf der Zeit.
          </p>
          <div className="mt-8 p-4 border-2 border-bauhaus-yellow bg-yellow-50 w-full max-w-xl">
            <h4 className="font-bold text-sm uppercase mb-2 text-bauhaus-black">Redemittel-Tipp:</h4>
            <p className="italic text-lg">"{content.openingLineHint}"</p>
          </div>
          <Button onClick={handlePrepComplete} variant="outline" className="mt-8">
            Überspringen & Aufnahme starten
          </Button>
        </div>
      )}

      {/* --- Speaking Phase --- */}
      {stage === AppStage.SPEAKING && (
        <div className="flex flex-col items-center justify-center py-10">
           <h2 className="text-3xl font-black mb-8 text-bauhaus-red animate-pulse">Aufnahme läuft</h2>
           <div className="w-full max-w-xl">
             <Timer 
                duration={taskConfig.speakTimeSeconds} 
                label="Sprechzeit" 
                isActive={true}
                onComplete={() => {/* Recorder handles stop via ref or manual stop */}} 
             />
           </div>
           
           <div className="w-full max-w-xl mt-4">
              {/* The recorder will auto-start. We pass a callback to receive the data */}
              <AudioRecorder 
                autoStart={true} 
                onRecordingComplete={handleSpeakingComplete} 
              />
           </div>

           <div className="mt-8 p-4 border-2 border-gray-200 w-full max-w-xl text-center">
             <div className="font-bold mb-2">Kontext</div>
             <div className="text-xl">{taskConfig.interlocutor} ({taskConfig.context})</div>
           </div>
        </div>
      )}

      {/* --- Analysis Loading --- */}
      {stage === AppStage.ANALYSIS && (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <Loader2 className="w-16 h-16 text-bauhaus-black animate-spin" />
          <h2 className="text-2xl font-bold font-mono">Kuchendeutsch analysiert...</h2>
          <div className="flex flex-col gap-2 text-sm text-gray-500 font-mono">
             <p>Logik prüfen...</p>
             <p>Wortschatz scannen...</p>
             <p>Grammatik validieren...</p>
          </div>
        </div>
      )}

      {/* --- Feedback Phase --- */}
      {stage === AppStage.FEEDBACK && (
        <div className="flex flex-col gap-8">
          <div className="border-4 border-bauhaus-black bg-white shadow-bauhaus p-0 overflow-hidden">
             <div className="bg-bauhaus-black text-white p-4 flex justify-between items-center">
               <h3 className="font-bold text-xl uppercase">Analysebericht</h3>
               <span className="font-mono text-bauhaus-yellow">Gemini 2.5 Flash</span>
             </div>
             <div className="p-6 prose prose-headings:font-bold prose-a:text-bauhaus-blue max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {analysis}
                </ReactMarkdown>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={() => setStage(AppStage.TASK_CARD)} variant="secondary">
              <RotateCcw className="w-5 h-5" /> Aufgabe wiederholen
            </Button>
            <Button onClick={onExit} variant="outline">
              <Home className="w-5 h-5" /> Zurück zum Start
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};