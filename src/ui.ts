updateStats() {
    const stats = getGameStats();
    
    document.getElementById('games-played')!.textContent = stats.gamesPlayed.toString();
    document.getElementById('games-won')!.textContent = stats.gamesWon.toString();
    document.getElementById('win-rate')!.textContent = `${stats.winRate}%`;
    document.getElementById('high-score')!.textContent = stats.highScore.toString();
    document.getElementById('best-time-easy')!.textContent = stats.bestTimes.easy || '--:--';
    document.getElementById('best-time-medium')!.textContent = stats.bestTimes.medium || '--:--';
    document.getElementById('best-time-hard')!.textContent = stats.bestTimes.hard || '--:--';
    document.getElementById('avg-score')!.textContent = Math.round(stats.averageScore).toString();
    document.getElementById('total-time')!.textContent = this.formatTotalTime(stats.totalPlayTime);
  }

  private formatTotalTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info' = 'info') {
    // Remover mensajes existentes
    const existingMessage = document.querySelector('.game-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `game-message ${type}`;
    messageDiv.textContent = message;
    
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
      gameContainer.insertBefore(messageDiv, gameContainer.firstChild);
    }

    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }

  private showGameComplete() {
    this.showMessage('🎉 ¡Felicitaciones! ¡Completaste el rompecabezas!', 'success');
  }

  private setupEventListeners() {
    document.getElementById('new-game')?.addEventListener('click', () => {
      this.game.startNewGame();
    });

    // Botón de pista
    document.getElementById('hint-btn')?.addEventListener('click', () => {
      this.game.useHint();
    });

    document.getElementById('difficulty')?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.game.setDifficulty(target.value as Difficulty);
      this.showMessage('¡Dificultad cambiada! Inicia un nuevo juego para aplicar.', 'info');
    });

    document.getElementById('save-game')?.addEventListener('click', () => {
      const saved = this.game.canSave();
      if (saved) {
        this.game.saveGame();
        saveGameState(this.game.getGameState());
        this.showMessage('¡Juego guardado exitosamente!', 'success');
      }
    });

    document.getElementById('load-game')?.addEventListener('click', () => {
      const loaded = this.game.loadGame();
      if (loaded) {
        this.updateDisplay();
        this.showMessage('¡Juego cargado exitosamente!', 'success');
      } else {
        this.showMessage('¡No se encontró juego guardado!', 'error');
      }
    });

    document.getElementById('export-data')?.addEventListener('click', () => {
      const data = exportGameData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mathgrid-data.json';
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById('import-data')?.addEventListener('click', () => {
      document.getElementById('import-file')?.click();
    });

    document.getElementById('import-file')?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          try {
            const success = importGameData(content);
            if (success) {
              this.showMessage('¡Datos importados exitosamente!', 'success');
              this.updateStats();
            } else {
              this.showMessage('¡Error al importar datos!', 'error');
            }
          } catch (error) {
            this.showMessage('¡Formato de archivo inválido!', 'error');
          }
        };
        reader.readAsText(file);
      }
    });

    document.getElementById('reset-stats')?.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que quieres reiniciar todas las estadísticas? Esto no se puede deshacer.')) {
        resetGameStats();
        this.updateStats();
        this.showMessage('¡Estadísticas reiniciadas exitosamente!', 'success');
      }
    });
  }