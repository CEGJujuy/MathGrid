useHint(): boolean {
    if (this.hintsRemaining <= 0) {
      this.ui?.showMessage?.('¡No quedan pistas!', 'error');
      return false;
    }

    const emptyCells: { row: number; col: number }[] = [];
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.grid[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      this.ui?.showMessage?.('¡No hay celdas vacías para dar pista!', 'info');
      return false;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const hintCell = emptyCells[randomIndex];
    
    this.grid[hintCell.row][hintCell.col] = this.solution[hintCell.row][hintCell.col];
    this.hintsRemaining--;
    this.ui?.updateHintCount?.(this.hintsRemaining);
    this.ui?.updateDisplay?.();
    this.ui?.showMessage?.(`¡Pista usada! La respuesta para fila ${hintCell.row + 1}, columna ${hintCell.col + 1} es ${this.solution[hintCell.row][hintCell.col]}`, 'info');
    
    return true;
  }