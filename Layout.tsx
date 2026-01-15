import React from 'react';
import { Square, Circle, Triangle } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-bauhaus-white text-bauhaus-black">
      {/* Header */}
      <header className="border-b-4 border-bauhaus-black bg-white p-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <Square className="w-4 h-4 text-bauhaus-blue fill-current" />
              <Circle className="w-4 h-4 text-bauhaus-red fill-current" />
              <Triangle className="w-4 h-4 text-bauhaus-yellow fill-current" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">Kuchendeutsch</h1>
          </div>
          <div className="text-xs font-bold border border-bauhaus-black px-2 py-1 uppercase">
            TestDaF Simulation
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col max-w-5xl mx-auto w-full p-4 md:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-bauhaus-black bg-bauhaus-black text-white p-4 mt-auto">
        <div className="max-w-5xl mx-auto text-center md:text-left flex flex-col md:flex-row justify-between text-sm">
          <p className="font-bold">FORM FOLLOWS FUNCTION</p>
          <p className="opacity-70">© {new Date().getFullYear()} Kuchendeutsch. Powered by Gemini.</p>
        </div>
      </footer>
    </div>
  );
};