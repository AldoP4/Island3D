export interface IslandLore {
  name: string;
  description: string;
  element: string;
  dangerLevel: string;
  inhabitants: string[];
}

export interface SceneState {
  image: string | null;
  isAnalyzing: boolean;
  lore: IslandLore | null;
}
