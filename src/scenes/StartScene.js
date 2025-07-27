export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  preload() {
    this.load.image('background', 'assets/startScene1.png');
  }

  create() {
  const { width, height } = this.scale;

  this.add.image(0, 0, 'background')
    .setOrigin(0, 0)
    .setDisplaySize(width, height);

  // City flicker setup
  this.cityNames = ['BELLEVUE', 'REDMOND', 'ISSAQUAH', 'SEATTLE'];
  this.titleBase = 'KING\nOF\n';
  this.currentCity = 'SAMMAMISH';

  this.titleText = this.add.text(width - 50, height / 2 - 75, this.titleBase + this.currentCity, {
    fontSize: '120px',
    color: '#582A2E',
    align: 'right',
    fontFamily: 'Iceberg',
    fontStyle: 'bold'
  }).setOrigin(1, 0.5);

  // Flicker function
  const flickerEffect = () => {
    const tempCity = Phaser.Utils.Array.GetRandom(this.cityNames);

    const flickerSequence = [
      '', 'SAMMAMISH', '', tempCity, '', 'SAMMAMISH', '', tempCity, 'SAMMAMISH'
    ];

    let i = 0;
    this.time.addEvent({
      delay: 100,
      repeat: flickerSequence.length - 1,
      callback: () => {
        this.titleText.setText(this.titleBase + flickerSequence[i]);
        i++;
      }
    });
  };

  // Repeat flicker every 6–10 seconds
  this.time.addEvent({
    delay: Phaser.Math.Between(6000, 10000),
    loop: true,
    callback: flickerEffect
  });

  // ENTER prompt animation
  this.basePrompt = 'Press ENTER to begin';
  this.dotCount = 0;

  this.promptText = this.add.text(width - 50, height - 80, this.basePrompt, {
    fontSize: '48px',
    color: '#FCAB80',
    fontFamily: 'Iceberg'
  }).setOrigin(1, 0.5);

  this.time.addEvent({
    delay: 400,
    callback: () => {
      this.dotCount = (this.dotCount + 1) % 4;
      this.promptText.setText('.'.repeat(this.dotCount) + this.basePrompt);
    },
    loop: true
  });

  // Start game
  this.input.keyboard.on('keydown-ENTER', () => {
    this.scene.start('MainScene');
  });
  // In StartScene.js - after promptText in create()
    const testimonialsButton = this.add.text(50, 75, 'Testimonials', {
    fontSize: '28px',
    color: '#ffffff',
    fontFamily: 'Iceberg',
    backgroundColor: '#00000099',
    padding: { x: 10, y: 5 }
    })
    .setOrigin(0, 1)
    .setInteractive({ useHandCursor: true });

    testimonialsButton.on('pointerdown', () => {
    this.scene.start('TestimonialScene');
    });

}

}
