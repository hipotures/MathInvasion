import Phaser from 'phaser';
import { GameScene } from './phaser/scenes/GameScene';

// Phaser Game Configuration
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // Automatically choose WebGL or Canvas
  width: window.innerWidth, // Use window width
  height: window.innerHeight, // Use window height
  parent: 'app', // ID of the div to contain the game canvas
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 200 }, // No gravity needed for this game
      debug: false, // Set to true for physics debugging visuals
    },
  },
  scene: [GameScene], // Add our scene here
  scale: {
    mode: Phaser.Scale.RESIZE, // Resize game canvas to fill the window
    autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game canvas
  },
  backgroundColor: '#1a1a1a', // A dark background color
};

// Initialize the Phaser Game instance
const game = new Phaser.Game(config);

console.log('Phaser game initialized:', game);

// Handle window resize events to update game size
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
