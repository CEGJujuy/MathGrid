export type Difficulty = 'easy' | 'medium' | 'hard';

export type CellType = 'equation' | 'input' | 'empty';

export interface GridCell {
  type: CellType;
  value: string;
  answer?: number;
  isCorrect?: boolean;
  isHint?: boolean;
  row: number;
  col: number;
}

export interface GameState {
  grid: GridCell[][];
  difficulty: Difficulty;
  score: number;
  timeElapsed: number;
  isComplete: boolean;
  hintsUsed: number;
  maxHints: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  bestTime: number;
  averageTime: number;
  hintsUsed: number;
}

export interface SavedGame {
  gameState: GameState;
  timestamp: number;
}