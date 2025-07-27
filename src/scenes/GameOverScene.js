export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2, 'Game Over', {
      fontSize: '48px',
      color: '#ff0000'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 60, 'Press R to Restart', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-R', () => {
      this.scene.start('MainScene');
    });
  }
}
