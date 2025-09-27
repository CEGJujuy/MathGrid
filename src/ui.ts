import { GameState, Difficulty, GridCell } from './types';
import { MathGridGame } from './gameLogic';
import { GameStorage } from './storage';

export class GameUI {
  private game: MathGridGame;
  private gameState: GameState | null = null;
  private timerInterval: number | null = null;
  private currentInputCell: { row: number; col: number } | null = null;

  constructor() {
    this.game = new MathGridGame('easy');
    this.init();
  }

  private init(): void {
    this.createUI();
    this.bindEvents();
    this.loadSavedGame();
  }

  private createUI(): void {
    const app = document.getElementById('app')!;
    app.innerHTML = `
      <header class="header">
        <h1>MathGrid</h1>
        <p>Complete the number grid by solving simple math equations!</p>
      </header>

      <div class="game-controls">
        <div class="difficulty-selector">
          <span class="stat-label">Difficulty:</span>
          <button class="difficulty-btn active" data-difficulty="easy">Easy</button>
          <button class="difficulty-btn" data-difficulty="medium">Medium</button>
          <button class="difficulty-btn" data-difficulty="hard">Hard</button>
        </div>

        <div class="game-stats">
          <div class="stat-item">
            <span class="stat-label">Time</span>
            <span class="stat-value timer" id="timer">00:00</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Score</span>
            <span class="stat-value score" id="score">0</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Hints</span>
            <span class="stat-value" id="hints">3/3</span>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn btn-primary" id="new-game">🎮 New Game</button>
          <button class="btn btn-secondary" id="hint-btn">💡 Hint</button>
          <button class="btn btn-success" id="save-game">💾 Save</button>
        </div>
      </div>

      <div class="game-container">
        <div class="grid-container">
          <div class="math-grid" id="math-grid">
            <div class="loading">
              <div class="spinner"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-overlay" id="input-modal" style="display: none;">
        <div class="modal">
          <h3>Enter your answer</h3>
          <input type="number" class="number-input" id="number-input" placeholder="?" min="0" max="999">
          <div class="modal-buttons">
            <button class="btn btn-success" id="submit-answer">✓ Submit</button>
            <button class="btn btn-secondary" id="cancel-input">✗ Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    // Difficulty selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        const difficulty = target.dataset.difficulty as Difficulty;
        this.changeDifficulty(difficulty);
      });
    });

    // Action buttons
    document.getElementById('new-game')!.addEventListener('click', () => {
      this.startNewGame();
    });

    document.getElementById('hint-btn')!.addEventListener('click', () => {
      this.useHint();
    });

    document.getElementById('save-game')!.addEventListener('click', () => {
      this.saveGame();
    });

    // Input modal
    document.getElementById('submit-answer')!.addEventListener('click', () => {
      this.submitAnswer();
    });

    document.getElementById('cancel-input')!.addEventListener('click', () => {
      this.hideInputModal();
    });

    document.getElementById('number-input')!.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.submitAnswer();
      } else if (e.key === 'Escape') {
        this.hideInputModal();
      }
    });

    // Close modal on overlay click
    document.getElementById('input-modal')!.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        this.hideInputModal();
      }
    });
  }

  private changeDifficulty(difficulty: Difficulty): void {
    // Update active button
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-difficulty="${difficulty}"]`)!.classList.add('active');

    // Create new game with selected difficulty
    this.game = new MathGridGame(difficulty);
    this.startNewGame();
  }

  private startNewGame(): void {
    const difficulty = document.querySelector('.difficulty-btn.active')!.getAttribute('data-difficulty') as Difficulty;
    this.gameState = this.game.generateGrid(difficulty);
    this.renderGrid();
    this.updateUI();
    this.startTimer();
    GameStorage.clearGameState(); // Clear any saved state when starting new game
  }

  private loadSavedGame(): void {
    const savedState = GameStorage.loadGameState();
    if (savedState && !savedState.isComplete) {
      this.gameState = savedState;
      this.game = new MathGridGame(savedState.difficulty);
      
      // Update difficulty button
      document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelector(`[data-difficulty="${savedState.difficulty}"]`)!.classList.add('active');
      
      this.renderGrid();
      this.updateUI();
      this.startTimer();
    } else {
      this.startNewGame();
    }
  }

  private renderGrid(): void {
    if (!this.gameState) return;

    const gridContainer = document.getElementById('math-grid')!;
    const size = this.gameState.grid.length;
    
    gridContainer.className = `math-grid grid-${size}x${size}`;
    gridContainer.innerHTML = '';

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cell = this.gameState.grid[row][col];
        const cellElement = this.createCellElement(cell);
        gridContainer.appendChild(cellElement);
      }
    }
  }

  private createCellElement(cell: GridCell): HTMLElement {
    const cellElement = document.createElement('div');
    cellElement.className = 'grid-cell';
    
    if (cell.type === 'equation') {
      cellElement.classList.add('equation');
      cellElement.textContent = cell.value;
    } else if (cell.type === 'input') {
      cellElement.classList.add('input');
      
      if (cell.value) {
        cellElement.textContent = cell.value;
        if (cell.isCorrect) {
          cellElement.classList.add('filled');
        } else {
          cellElement.classList.add('error');
        }
      } else {
        cellElement.textContent = '?';
      }
      
      if (cell.isHint) {
        cellElement.classList.add('hint');
      }
      
      cellElement.addEventListener('click', () => {
        if (!cell.value || !cell.isCorrect) {
          this.showInputModal(cell.row, cell.col);
        }
      });
    }
    
    return cellElement;
  }

  private showInputModal(row: number, col: number): void {
    this.currentInputCell = { row, col };
    const modal = document.getElementById('input-modal')!;
    const input = document.getElementById('number-input') as HTMLInputElement;
    
    modal.style.display = 'flex';
    input.value = '';
    input.focus();
  }

  private hideInputModal(): void {
    document.getElementById('input-modal')!.style.display = 'none';
    this.currentInputCell = null;
  }

  private submitAnswer(): void {
    if (!this.gameState || !this.currentInputCell) return;

    const input = document.getElementById('number-input') as HTMLInputElement;
    const userAnswer = parseInt(input.value);
    
    if (isNaN(userAnswer)) {
      input.focus();
      return;
    }

    const { row, col } = this.currentInputCell;
    const isCorrect = this.game.checkAnswer(this.gameState, row, col, userAnswer);
    
    this.hideInputModal();
    this.renderGrid();
    this.updateUI();
    
    if (!isCorrect) {
      // Show error animation
      setTimeout(() => {
        this.renderGrid();
      }, 500);
    }
    
    // Check if game is complete
    if (this.game.isGameComplete(this.gameState)) {
      this.completeGame();
    } else {
      // Auto-save progress
      GameStorage.saveGameState(this.gameState);
    }
  }

  private useHint(): void {
    if (!this.gameState) return;

    const hintResult = this.game.useHint(this.gameState);
    if (hintResult) {
      this.renderGrid();
      this.updateUI();
      
      // Check if game is complete after hint
      if (this.game.isGameComplete(this.gameState)) {
        this.completeGame();
      } else {
        GameStorage.saveGameState(this.gameState);
      }
    }
  }

  private saveGame(): void {
    if (!this.gameState) return;
    
    GameStorage.saveGame(this.gameState);
    this.showSuccessMessage('Game saved successfully!');
  }

  private completeGame(): void {
    if (!this.gameState) return;

    this.stopTimer();
    const finalScore = this.game.calculateFinalScore(this.gameState);
    this.gameState.score = finalScore;
    
    GameStorage.updateGameStats(this.gameState, finalScore);
    GameStorage.clearGameState(); // Clear saved state after completion
    
    this.showSuccessMessage(`🎉 Congratulations! Final Score: ${finalScore}`);
    this.updateUI();
  }

  private showSuccessMessage(message: string): void {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      document.body.removeChild(successDiv);
    }, 3000);
  }

  private startTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    this.timerInterval = window.setInterval(() => {
      if (this.gameState && !this.gameState.isComplete) {
        this.gameState.timeElapsed++;
        this.updateTimer();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private updateTimer(): void {
    if (!this.gameState) return;
    
    const minutes = Math.floor(this.gameState.timeElapsed / 60);
    const seconds = this.gameState.timeElapsed % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timer')!.textContent = timeString;
  }

  private updateUI(): void {
    if (!this.gameState) return;

    document.getElementById('score')!.textContent = this.gameState.score.toString();
    
    const hintsRemaining = this.gameState.maxHints - this.gameState.hintsUsed;
    document.getElementById('hints')!.textContent = `${hintsRemaining}/${this.gameState.maxHints}`;
    
    // Disable hint button if no hints remaining
    const hintBtn = document.getElementById('hint-btn') as HTMLButtonElement;
    hintBtn.disabled = hintsRemaining <= 0;
    
    this.updateTimer();
  }
}