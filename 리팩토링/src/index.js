import Phaser, { Scene } from 'phaser';
import firebase from 'firebase/compat/app';
import Preload from './scenes/Preload';
import Play from './scenes/Play';

const MAP_WIDTH = 1600;

let width = innerWidth;
let height = innerHeight;

const SHARED_CONFIG = {
  width: 800,
  height: 600,
  debug: true,
};

const scenes = [Preload, Play];
const createScene = (Scene) => new Scene(SHARED_CONFIG);
const initScenes = () => scenes.map(createScene);

const config = {
  //webGL : Phaser.AUTO
  type: Phaser.AUTO,
  ...SHARED_CONFIG,

  pixcelArt: true,

  physics: {
    //경량 물리엔진 arcade
    default: 'arcade',
    arcade: {
      debug: SHARED_CONFIG.debug,
    },
  },
  scene: initScenes(),
  // scene: {
  //   preload,
  //   create,
  // },
};

function preload() {
  this.load.image('background', '../assets/background.png');
}
function create() {
  this.add.image(0, 0, 'background').setOrigin(0);
  this.add.sprite(config.width / 2, config.height / 2, 'player').setOrigin(0);
}

window.game = new Phaser.Game(config);
