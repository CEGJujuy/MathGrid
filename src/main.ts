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
    console.log('Game paused');
  } else {
    // Page is visible again
    console.log('Game resumed');
  }
});

// Handle beforeunload to save game state
window.addEventListener('beforeunload', () => {
  // Game state is automatically saved during gameplay
  console.log('Saving game state before page unload');
});