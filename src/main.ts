import './style.css';
import { GameUI } from './ui';

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GameUI();
});

// Handle page visibility changes to pause/resume timer
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, could pause timer here if needed
    console.log('Juego pausado');
  } else {
    // Page is visible again
    console.log('Juego reanudado');
  }
});

// Handle beforeunload to save game state
window.addEventListener('beforeunload', () => {
  // Game state is automatically saved during gameplay
  console.log('Guardando estado del juego antes de cerrar la página');
});