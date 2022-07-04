import Phaser from 'phaser';

class Play extends Phaser.Scene {
  constructor(config) {
    super('PlayScene');
    this.config = config;
  }

  create({ gameStatus }) {
    const map = {};
  }
}

export default Play;
