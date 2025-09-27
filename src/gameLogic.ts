import { Difficulty, GridCell, GameState, CellType } from './types';

export class MathGridGame {
  private gridSize: number;
  private equations: string[];
  private solutions: number[];

  constructor(difficulty: Difficulty) {
    this.gridSize = this.getGridSize(difficulty);
    this.equations = [];
    this.solutions = [];
  }

  private getGridSize(difficulty: Difficulty): number {
    switch (difficulty) {
      case 'easy': return 3;
      case 'medium': return 4;
      case 'hard': return 5;
      default: return 3;
    }
  }

  private getMaxHints(difficulty: Difficulty): number {
    switch (difficulty) {
      case 'easy': return 3;
      case 'medium': return 2;
      case 'hard': return 1;
      default: return 3;
    }
  }

  private generateNumber(difficulty: Difficulty): number {
    switch (difficulty) {
      case 'easy': return Math.floor(Math.random() * 10) + 1; // 1-10
      case 'medium': return Math.floor(Math.random() * 20) + 1; // 1-20
      case 'hard': return Math.floor(Math.random() * 50) + 1; // 1-50
      default: return Math.floor(Math.random() * 10) + 1;
    }
  }

  private generateEquation(difficulty: Difficulty): { equation: string; answer: number } {
    const operations = ['+', '-'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1 = this.generateNumber(difficulty);
    let num2 = this.generateNumber(difficulty);
    
    // Ensure subtraction doesn't result in negative numbers
    if (operation === '-' && num1 < num2) {
      [num1, num2] = [num2, num1];
    }
    
    const answer = operation === '+' ? num1 + num2 : num1 - num2;
    const equation = `${num1} ${operation} ${num2}`;
    
    return { equation, answer };
  }

  public generateGrid(difficulty: Difficulty): GameState {
    const grid: GridCell[][] = [];
    const size = this.getGridSize(difficulty);
    
    // Initialize empty grid
    for (let row = 0; row < size; row++) {
      grid[row] = [];
      for (let col = 0; col < size; col++) {
        grid[row][col] = {
          type: 'empty',
          value: '',
          row,
          col
        };
      }
    }

    // Place equations and input cells strategically
    this.placeEquationsAndInputs(grid, size, difficulty);

    return {
      grid,
      difficulty,
      score: 0,
      timeElapsed: 0,
      isComplete: false,
      hintsUsed: 0,
      maxHints: this.getMaxHints(difficulty)
    };
  }

  private placeEquationsAndInputs(grid: GridCell[][], size: number, difficulty: Difficulty): void {
    const totalCells = size * size;
    const equationCount = Math.floor(totalCells * 0.4); // 40% equations
    const inputCount = Math.floor(totalCells * 0.3); // 30% inputs
    
    const positions: { row: number; col: number }[] = [];
    
    // Generate all possible positions
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        positions.push({ row, col });
      }
    }
    
    // Shuffle positions
    this.shuffleArray(positions);
    
    // Place equations
    for (let i = 0; i < equationCount; i++) {
      const pos = positions[i];
      const { equation, answer } = this.generateEquation(difficulty);
      
      grid[pos.row][pos.col] = {
        type: 'equation',
        value: equation,
        answer,
        row: pos.row,
        col: pos.col
      };
    }
    
    // Place input cells
    for (let i = equationCount; i < equationCount + inputCount; i++) {
      const pos = positions[i];
      const { answer } = this.generateEquation(difficulty);
      
      grid[pos.row][pos.col] = {
        type: 'input',
        value: '',
        answer,
        row: pos.row,
        col: pos.col
      };
    }
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  public checkAnswer(gameState: GameState, row: number, col: number, userAnswer: number): boolean {
    const cell = gameState.grid[row][col];
    if (cell.type !== 'input' || cell.answer === undefined) {
      return false;
    }
    
    const isCorrect = cell.answer === userAnswer;
    cell.isCorrect = isCorrect;
    cell.value = userAnswer.toString();
    
    if (isCorrect) {
      gameState.score += this.getPointsForDifficulty(gameState.difficulty);
    }
    
    return isCorrect;
  }

  private getPointsForDifficulty(difficulty: Difficulty): number {
    switch (difficulty) {
      case 'easy': return 10;
      case 'medium': return 20;
      case 'hard': return 30;
      default: return 10;
    }
  }

  public useHint(gameState: GameState): { row: number; col: number } | null {
    if (gameState.hintsUsed >= gameState.maxHints) {
      return null;
    }
    
    // Find an unfilled input cell
    const inputCells: { row: number; col: number }[] = [];
    
    for (let row = 0; row < gameState.grid.length; row++) {
      for (let col = 0; col < gameState.grid[row].length; col++) {
        const cell = gameState.grid[row][col];
        if (cell.type === 'input' && !cell.value && !cell.isHint) {
          inputCells.push({ row, col });
        }
      }
    }
    
    if (inputCells.length === 0) {
      return null;
    }
    
    // Select a random input cell for hint
    const randomIndex = Math.floor(Math.random() * inputCells.length);
    const { row, col } = inputCells[randomIndex];
    const cell = gameState.grid[row][col];
    
    if (cell.answer !== undefined) {
      cell.value = cell.answer.toString();
      cell.isCorrect = true;
      cell.isHint = true;
      gameState.hintsUsed++;
      
      // Deduct points for using hint
      gameState.score = Math.max(0, gameState.score - 5);
      
      return { row, col };
    }
    
    return null;
  }

  public isGameComplete(gameState: GameState): boolean {
    for (let row = 0; row < gameState.grid.length; row++) {
      for (let col = 0; col < gameState.grid[row].length; col++) {
        const cell = gameState.grid[row][col];
        if (cell.type === 'input' && (!cell.value || !cell.isCorrect)) {
          return false;
        }
      }
    }
    
    gameState.isComplete = true;
    return true;
  }

  public calculateFinalScore(gameState: GameState): number {
    let finalScore = gameState.score;
    
    // Time bonus (faster completion = more points)
    const timeBonus = Math.max(0, 300 - gameState.timeElapsed); // Max 5 minutes
    finalScore += Math.floor(timeBonus / 10);
    
    // Difficulty multiplier
    const multiplier = gameState.difficulty === 'easy' ? 1 : 
                     gameState.difficulty === 'medium' ? 1.5 : 2;
    
    finalScore = Math.floor(finalScore * multiplier);
    
    return Math.max(0, finalScore);
  }
}