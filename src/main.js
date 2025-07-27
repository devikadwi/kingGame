import StartScene from './scenes/StartScene.js';
import MainScene from './scenes/MainScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import TestimonialScene from './scenes/TestimonialScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800, // or whatever fixed width you want
  height: 600, // fixed height
  scale: {
    mode: Phaser.Scale.NONE, // Prevents resizing
    autoCenter: Phaser.Scale.CENTER_BOTH // Center on screen
  },
  scene: [StartScene, MainScene, GameOverScene], // your scenes
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false
    }
  }
};

const game = new Phaser.Game(config);
