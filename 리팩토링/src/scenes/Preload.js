// import Phaser from 'Phaser';

class Preload extends Phaser.Scene {
  constructor(config) {
    super('PreloadScene');
    this.config = config;
  }
  preload() {
    this.load.image('background', 'assets/background.png');
  }
  create() {
    this.add.image(0, 0, 'background').setOrigin(0);
  }
}

// this.add.sprite(this.config, this.config, 'player').setOrigin(0);
// this.scene.start('PlayScene');

export default Preload;
