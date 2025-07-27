import StartScene from './scenes/StartScene.js';
import MainScene from './scenes/MainScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import TestimonialScene from './scenes/TestimonialScene.js';


const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
  },
  render: { pixelArt: true },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: true
    }
  },
  fontFamily: 'Iceberg',
  scene: [StartScene, MainScene, GameOverScene, TestimonialScene] // order matters
};

new Phaser.Game(config);
