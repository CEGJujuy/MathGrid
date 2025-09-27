import { GameState, GameStats, SavedGame } from './types';

export class GameStorage {
  private static readonly GAME_STATE_KEY = 'mathgrid_game_state';
  private static readonly GAME_STATS_KEY = 'mathgrid_game_stats';
  private static readonly SAVED_GAMES_KEY = 'mathgrid_saved_games';

  public static saveGameState(gameState: GameState): void {
    try {
      localStorage.setItem(this.GAME_STATE_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }

  public static loadGameState(): GameState | null {
    try {
      const saved = localStorage.getItem(this.GAME_STATE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  }

  public static clearGameState(): void {
    try {
      localStorage.removeItem(this.GAME_STATE_KEY);
    } catch (error) {
      console.error('Failed to clear game state:', error);
    }
  }

  public static saveGameStats(stats: GameStats): void {
    try {
      localStorage.setItem(this.GAME_STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to save game stats:', error);
    }
  }

  public static loadGameStats(): GameStats {
    try {
      const saved = localStorage.getItem(this.GAME_STATS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load game stats:', error);
    }

    // Return default stats if none exist
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      totalScore: 0,
      bestTime: 0,
      averageTime: 0,
      hintsUsed: 0
    };
  }

  public static updateGameStats(gameState: GameState, finalScore: number): void {
    const stats = this.loadGameStats();
    
    stats.gamesPlayed++;
    stats.totalScore += finalScore;
    
    if (gameState.isComplete) {
      stats.gamesWon++;
      
      // Update best time (only for completed games)
      if (stats.bestTime === 0 || gameState.timeElapsed < stats.bestTime) {
        stats.bestTime = gameState.timeElapsed;
      }
      
      // Update average time
      stats.averageTime = Math.floor(
        (stats.averageTime * (stats.gamesWon - 1) + gameState.timeElapsed) / stats.gamesWon
      );
    }
    
    stats.hintsUsed += gameState.hintsUsed;
    
    this.saveGameStats(stats);
  }

  public static saveGame(gameState: GameState, name?: string): void {
    try {
      const savedGames = this.loadSavedGames();
      const savedGame: SavedGame = {
        gameState: { ...gameState },
        timestamp: Date.now()
      };
      
      // Keep only the 5 most recent saved games
      savedGames.unshift(savedGame);
      if (savedGames.length > 5) {
        savedGames.splice(5);
      }
      
      localStorage.setItem(this.SAVED_GAMES_KEY, JSON.stringify(savedGames));
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  }

  public static loadSavedGames(): SavedGame[] {
    try {
      const saved = localStorage.getItem(this.SAVED_GAMES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load saved games:', error);
      return [];
    }
  }

  public static deleteSavedGame(timestamp: number): void {
    try {
      const savedGames = this.loadSavedGames();
      const filtered = savedGames.filter(game => game.timestamp !== timestamp);
      localStorage.setItem(this.SAVED_GAMES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete saved game:', error);
    }
  }

  public static exportData(): string {
    try {
      const data = {
        gameState: this.loadGameState(),
        gameStats: this.loadGameStats(),
        savedGames: this.loadSavedGames()
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return '';
    }
  }

  public static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.gameState) {
        this.saveGameState(data.gameState);
      }
      
      if (data.gameStats) {
        this.saveGameStats(data.gameStats);
      }
      
      if (data.savedGames && Array.isArray(data.savedGames)) {
        localStorage.setItem(this.SAVED_GAMES_KEY, JSON.stringify(data.savedGames));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}