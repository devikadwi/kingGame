import StartScene from './scenes/StartScene.js';
import MainScene from './scenes/MainScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import TestimonialScene from './scenes/TestimonialScene.js';


const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720
  },
  render: { pixelArt: true },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  fontFamily: 'Iceberg',
  scene: [StartScene, MainScene, GameOverScene, TestimonialScene] // order matters
};

new Phaser.Game(config);
