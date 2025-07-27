export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('mountains', 'assets/mountains2.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('rock', 'assets/rock.png');
    this.load.spritesheet('hero', 'assets/hero-sheet.png', {
      frameWidth: 256,
      frameHeight: 256
    });
    this.load.image('bear', 'assets/bear.png');
    this.load.image('log', 'assets/log.png');
    this.groundSpeed = 5;
    this.bgSpeed = 0.5;
    this.playerAlive = true;
  }

  handlePlayerDeath() {
    this.playerAlive = false;
    this.physics.pause();
    this.bgPaused = true;
    this.player.setVelocity(0);
    this.player.play('die');
    this.groundSpeed = 0;
    this.bgSpeed = 0;
    this.time.delayedCall(1100, () => {
      this.scene.start('GameOverScene');
    });
  }

  create() {
    this.width = this.scale.width;
    this.height = this.scale.height;
    const groundY = this.height - (this.height * 0.3);

    this.createBackground();
    this.createAnimations();

    this.player = this.physics.add.sprite(100, groundY, 'hero')
      .setDisplaySize(250, 250)
      .setCollideWorldBounds(true)
      .play('run');
    this.player.body.setSize(45, 100);

    this.physics.add.collider(this.player, this.groundCollider);

    this.obstacles = this.physics.add.group();

    this.nextSpawnTime = 0;
    this.spawnDelay = 2000;
    this.lastObstacleType = null;

    this.physics.add.overlap(this.player, this.obstacles, (player, obstacle) => {
      const needsAttack = obstacle.getData('needsAttack');

      if (needsAttack) {
        if (this.isAttacking) {
          obstacle.destroy();
          this.incrementScore(10);
        } else {
          this.handlePlayerDeath();
        }
      } else {
        this.handlePlayerDeath();
      }
    });

    this.isAttacking = false;
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.player.body.blocked.down || this.player.body.touching.down) {
        this.player.setVelocityY(-400);
      }
    });

    this.attackListener = this.input.keyboard.on('keydown-ENTER', () => {
      if (!this.playerAlive || this.isAttacking) return;

      this.isAttacking = true;
      this.player.play('attack');
      this.time.delayedCall(800, () => {
        this.player.play('run');
        this.isAttacking = false;
      });
    });

    this.score = 0;
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '32px',
      fill: '#fff',
      fontFamily: 'Arial'
    });

    window.addEventListener('resize', () => {
      this.scale.resize(window.innerWidth, window.innerHeight);
    });
  }

  createBackground() {
    const { width, height } = this.scale;
    const groundY = height - (height * 0.07);

    this.sky = this.add.image(0, 0, 'sky').setOrigin(0, 0).setDisplaySize(width, height);

    this.bg1 = this.add.image(0, height * 0.5, 'mountains').setOrigin(0, 0.5).setDisplaySize(width, height);
    this.bg2 = this.add.image(width, height * 0.5, 'mountains').setOrigin(0, 0.5).setFlipX(true).setDisplaySize(width, height);

    this.ground1 = this.add.image(0, height, 'ground').setOrigin(0, 1).setDisplaySize(width, height);
    this.ground2 = this.add.image(width, height, 'ground').setOrigin(0, 1).setFlipX(true).setDisplaySize(width, height);

    this.groundCollider = this.physics.add.staticImage(width / 2, groundY - 10, 'ground')
      .setDisplaySize(width, 10)
      .refreshBody();
  }

  createAnimations() {
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('hero', { start: 9, end: 15 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'attack',
      frames: this.anims.generateFrameNumbers('hero', { start: 16, end: 24 }),
      frameRate: 8,
      repeat: 0
    });
    this.anims.create({
      key: 'die',
      frames: this.anims.generateFrameNumbers('hero', { start: 34, end: 48 }),
      frameRate: 15,
      repeat: 0
    });
  }

  spawnObstaclePair() {
    const groundY = this.height - (this.height * 0.07);
    const possiblePairs = [
      ['log', 'bear'],
      ['bear', 'log'],
      ['bear', 'rock'],
      ['rock', 'bear']
    ];
    const pair = Phaser.Utils.Array.GetRandom(possiblePairs);

    pair.forEach((typeKey, index) => {
      const typeData = {
        log: {
          displaySize: { width: 100, height: 80 },
          canBeJumped: true,
          needsAttack: false,
          hitboxSize: { width: 100, height: 40 },
          position: { width: this.width, height: groundY - 30 }
        },
        bear: {
          displaySize: { width: 150, height: 150 },
          canBeJumped: false,
          needsAttack: true,
          hitboxSize: { width: 150, height: 150 },
          position: { width: this.width, height: groundY - 70 }
        },
        rock: {
          displaySize: { width: 100, height: 80 },
          canBeJumped: true,
          needsAttack: false,
          hitboxSize: { width: 110, height: 100 },
          position: { width: this.width, height: groundY - 30 }
        },
      }[typeKey];

      const delay = index * 200; // staggered spawn delay
      this.time.delayedCall(delay, () => {
        const obstacle = this.obstacles.create(this.width + index * 120, typeData.position.height, typeKey);
        obstacle.setDisplaySize(typeData.displaySize.width, typeData.displaySize.height);
        obstacle.body.setSize(typeData.hitboxSize.width, typeData.hitboxSize.height);
        obstacle.setVelocityX(-this.groundSpeed * 60);
        obstacle.body.allowGravity = false;

        obstacle.setData('type', typeKey);
        obstacle.setData('needsAttack', typeData.needsAttack);
        obstacle.setData('canBeJumped', typeData.canBeJumped);
      });
    });
  }

  spawnSingleObstacle() {
    const groundY = this.height - (this.height * 0.07);
    const types = ['log', 'bear', 'rock'].filter(t => t !== this.lastObstacleType);
    const typeKey = Phaser.Utils.Array.GetRandom(types);
    this.lastObstacleType = typeKey;

    const typeData = {
      log: {
          displaySize: { width: 100, height: 80 },
          canBeJumped: true,
          needsAttack: false,
          hitboxSize: { width: 100, height: 40 },
          position: { width: this.width, height: groundY - 30 }
        },
        bear: {
          displaySize: { width: 150, height: 150 },
          canBeJumped: false,
          needsAttack: true,
          hitboxSize: { width: 150, height: 150 },
          position: { width: this.width, height: groundY - 70 }
        },
        rock: {
          displaySize: { width: 100, height: 80 },
          canBeJumped: true,
          needsAttack: false,
          hitboxSize: { width: 110, height: 100 },
          position: { width: this.width, height: groundY - 30 }
        },
    }[typeKey];

    const obstacle = this.obstacles.create(this.width, typeData.position.height, typeKey);

    obstacle.setDisplaySize(typeData.displaySize.width, typeData.displaySize.height);
    obstacle.body.setSize(typeData.hitboxSize.width, typeData.hitboxSize.height);
    obstacle.setVelocityX(-this.groundSpeed * 60);
    obstacle.body.allowGravity = false;

    obstacle.setData('type', typeKey);
    obstacle.setData('needsAttack', typeData.needsAttack);
    obstacle.setData('canBeJumped', typeData.canBeJumped);
  }

  incrementScore(amount) {
    this.score += amount;
    this.scoreText.setText(`Score: ${Math.floor(this.score)}`);
  }

  update(time, delta) {
    if (!this.playerAlive) return;

    this.score += 0.05;
    this.scoreText.setText(`Score: ${Math.floor(this.score)}`);

    this.groundSpeed += 0.001;
    this.bgSpeed += 0.0008;

    this.bg1.x -= this.bgSpeed;
    this.bg2.x -= this.bgSpeed;
    if (this.bg1.x <= -this.width) this.bg1.x = this.bg2.x + this.width;
    if (this.bg2.x <= -this.width) this.bg2.x = this.bg1.x + this.width;

    this.ground1.x -= this.groundSpeed;
    this.ground2.x -= this.groundSpeed;
    if (this.ground1.x <= -this.width) this.ground1.x = this.ground2.x + this.width;
    if (this.ground2.x <= -this.width) this.ground2.x = this.ground1.x + this.width;

    if (time > this.nextSpawnTime) {
      const useCombo = this.score >= 50 && Phaser.Math.Between(0, 100) < 40;
      if (useCombo) {
        this.spawnObstaclePair();
      } else {
        this.spawnSingleObstacle();
      }
      this.spawnDelay = Phaser.Math.Between(1000, 3000);
      this.nextSpawnTime = time + this.spawnDelay;
    }
  }
}
