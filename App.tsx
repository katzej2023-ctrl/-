import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Button } from './components/Button';
import { PracticeSession } from './components/PracticeSession';
import { TASK_CONFIGS } from './constants';
import { AppStage, TaskConfig } from './types';
import { Mic, CheckCircle2, BarChart2, MessageSquare, Scale } from 'lucide-react';

const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<AppStage>(AppStage.WELCOME);
  const [selectedTask, setSelectedTask] = useState<TaskConfig | null>(null);

  const startSelection = () => setCurrentStage(AppStage.SELECTION);
  
  const startTask = (taskId: number) => {
    setSelectedTask(TASK_CONFIGS[taskId]);
    setCurrentStage(AppStage.TASK_CARD);
  };

  const resetApp = () => {
    setSelectedTask(null);
    setCurrentStage(AppStage.SELECTION);
  };

  // Welcome Screen
  if (currentStage === AppStage.WELCOME) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center space-y-8 animate-in slide-in-from-bottom-4 duration-700">
          <div className="w-32 h-32 border-8 border-bauhaus-black flex items-center justify-center bg-bauhaus-yellow mb-4 shadow-[8px_8px_0px_0px_#1A1A1A]">
             <span className="text-6xl font-black text-bauhaus-black">K</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
            KUCHEN<br/><span className="text-bauhaus-red">DEUTSCH</span>
          </h1>
          
          <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
            Der <span className="bg-bauhaus-black text-white px-1">TestDaF</span> Simulator. 
            Funktional. Streng. Effektiv.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl w-full mt-8">
             <div className="border-2 border-bauhaus-black p-4 bg-white">
                <BarChart2 className="w-8 h-8 text-bauhaus-blue mb-2" />
                <h3 className="font-bold text-lg mb-1">Strukturierte Logik</h3>
                <p className="text-sm text-gray-600">Training von Redemitteln und logischem Aufbau.</p>
             </div>
             <div className="border-2 border-bauhaus-black p-4 bg-white">
                <CheckCircle2 className="w-8 h-8 text-bauhaus-red mb-2" />
                <h3 className="font-bold text-lg mb-1">Echtzeit-Analyse</h3>
                <p className="text-sm text-gray-600">KI-Bewertung nach offiziellen Kriterien.</p>
             </div>
             <div className="border-2 border-bauhaus-black p-4 bg-white">
                <Scale className="w-8 h-8 text-bauhaus-yellow mb-2" />
                <h3 className="font-bold text-lg mb-1">Prüfungssimulation</h3>
                <p className="text-sm text-gray-600">Strikte Zeitlimits und realistische Szenarien.</p>
             </div>
          </div>

          <Button onClick={startSelection} className="mt-8 text-xl px-12 py-4">
            TRAINING STARTEN
          </Button>
        </div>
      </Layout>
    );
  }

  // Selection Screen
  if (currentStage === AppStage.SELECTION) {
    return (
      <Layout>
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between border-b-2 border-bauhaus-black pb-4">
            <h2 className="text-3xl font-black uppercase">Wählen Sie eine Aufgabe</h2>
            <span className="font-mono text-sm">7 Module Verfügbar</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(TASK_CONFIGS).map((task) => (
              <button
                key={task.id}
                onClick={() => startTask(task.id)}
                className="group relative border-2 border-bauhaus-black bg-white p-6 text-left hover:bg-bauhaus-black hover:text-white transition-colors duration-200 shadow-bauhaus-sm hover:shadow-bauhaus h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-black text-4xl opacity-20 group-hover:opacity-100 group-hover:text-bauhaus-yellow transition-all">0{task.id}</span>
                    {task.id === 3 || task.id === 6 ? <BarChart2 className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{task.title}</h3>
                  <p className="text-sm opacity-80 mb-4">{task.description}</p>
                </div>
                <div className="flex gap-2 text-xs font-mono border-t border-current pt-2 mt-2 opacity-60">
                   <span>⏳ Prep: {task.prepTimeSeconds}s</span>
                   <span>🎤 Speak: {task.speakTimeSeconds}s</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-8 text-center">
             <button onClick={() => setCurrentStage(AppStage.WELCOME)} className="underline text-gray-500 hover:text-bauhaus-black">
               Zurück zur Startseite
             </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Practice Session
  if (selectedTask) {
    return (
      <Layout>
        <PracticeSession 
          taskConfig={selectedTask} 
          onExit={resetApp} 
        />
      </Layout>
    );
  }

  return null;
};

export default App;