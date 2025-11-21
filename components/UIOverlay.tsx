
import React from 'react';
import { IslandLore } from '../types';

interface OverlayProps {
  onAnalyze: () => void;
  isAnalyzing: boolean;
  lore: IslandLore | null;
  hasImage: boolean;
}

export const UIOverlay: React.FC<OverlayProps> = ({ onAnalyze, isAnalyzing, lore, hasImage }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-8 z-10 select-none">
      {/* Header - Kept minimal branding */}
      <header className="pointer-events-auto flex justify-between items-start">
        <div className="bg-[#020617]/40 backdrop-blur-md px-4 py-3 rounded-xl border border-white/5 inline-block">
          <div className="w-12 h-1 bg-cyan-400 mb-2 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
          <p className="text-cyan-100/80 text-[10px] font-bold uppercase tracking-[0.2em]">Aether Visualizer</p>
        </div>
      </header>

      {/* Footer area - Empty now as requested */}
      <footer className="h-10"></footer>
    </div>
  );
};
