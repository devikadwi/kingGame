export default class TestimonialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TestimonialScene' });
  }

  preload() {
    this.load.image('bg1', 'assets/bg1.png');
    this.load.image('bg2', 'assets/bg2.png');
  }

  create() {
    this.testimonials = [
    { 
        image: 'bg1', 
        text: "Dearest Papa, \n Happy 51st Birthday! You are the best dad anyone could ever ask for. It is such a privilege to have you in our lives. You see the potential in all of us and challenge us to grow constantly. I really like talking to you about my day, things that stress me out, things that I find funny. I hope you like this project :) If you find bugs, please create a work item on ADO and tag my alias. \n Devika Dwivedi",
        position: { x: 160, y: 150 }
    },
    { 
        image: 'bg2', 
        text: "Dear Papa,\nHappy birthday! Thank you for all the guidance you have given me throughout my life—from dancing to academics. It is your advice and persistence that has been the backbone in getting me to where I am now.\nI truly appreciated talking to you about the day’s experience in the car rides back home from Transition School—it was a time both to talk and sing with you in the car but also to reflect on the day and decompress. I’m excited to spend the next year collaborating with you on my college plan and having fun experiences on vacation! \nVidita Dwivedi",
        position: { x: (this.scale.width/2) - 80, y: 50 }
    }
    ];
    this.currentIndex = 0;
    this.textSpeed = 40; // ms per character

    this.createSlide(this.testimonials[this.currentIndex]);
    // Handle ENTER key to advance
    this.input.keyboard.on('keydown-ENTER', () => {
      if (this.typingTimer?.getProgress() < 1) {
        // Skip to full text if still typing
        this.typingTimer.remove();
        this.messageText.setText(this.fullMessage);
      } else {
        // Advance to next or go home
        this.nextSlide();
      }
    });
  }

  createSlide({ image, text, position }) {
    if (this.bg) this.bg.destroy();
    if (this.messageText) this.messageText.destroy();

    this.bg = this.add.image(0, 0, image).setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);
    
    this.messageText = this.add.text(position.x, position.y, '', {
      fontSize: '28px',
      color: '#000000',
      fontFamily: 'Iceberg',
      wordWrap: { width: 650 }
    });
    this.messageText.setPosition(position.x, position.y);
    this.fullMessage = text;
    this.displayedText = '';
    this.currentChar = 0;

    if (this.typingTimer) this.typingTimer.remove();

    this.typingTimer = this.time.addEvent({
      delay: this.textSpeed,
      callback: () => {
        if (this.currentChar < this.fullMessage.length) {
          this.displayedText += this.fullMessage[this.currentChar++];
          this.messageText.setText(this.displayedText);
        } else {
          this.typingTimer.remove();
        }
      },
      repeat: this.fullMessage.length - 1
    });
  }

  nextSlide() {
    this.currentIndex++;
    if (this.currentIndex >= this.testimonials.length) {
      this.scene.start('StartScene'); // Go back to start
    } else {
      this.createSlide(this.testimonials[this.currentIndex]);
    }
  }
}
