import React, { useState } from 'react';
import { IslandScene } from './components/IslandScene';
import { UIOverlay } from './components/UIOverlay';
import { IslandLore } from './types';

// Default lore matching the user's screenshot
const INITIAL_LORE: IslandLore = {
  name: "Celestia Falls",
  description: "A verdant isle adrift in the azure expanse, where crystalline waters cascade from lofty heights into the boundless sky. Whispers of ancient magic weave through its emerald canopy, cradled softly by the clouds.",
  element: "Air",
  dangerLevel: "Moderate",
  inhabitants: ["Sky-Serpents", "Mist Wraiths", "Verdant Keepers"]
};

export default function App() {
  // We keep lore in state in case we want to regenerate it later, but for now it's static
  const [lore, setLore] = useState<IslandLore | null>(INITIAL_LORE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Future functionality for regenerating lore could go here
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden text-white">
      {/* 3D Scene Layer - Now handling the background */}
      <IslandScene />

      {/* UI Layer */}
      <UIOverlay 
        onAnalyze={handleAnalyze} 
        isAnalyzing={isAnalyzing} 
        lore={lore}
        hasImage={true}
      />
    </div>
  );
}