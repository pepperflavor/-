import Phaser from "phaser";
import firebase from "firebase/compat/app";
import PreloadScene from "./scenes/Preload";
import PlayScene from "./scenes/PlayScene";



let width = 1700;
let height = 850;

const SHARED_CONFIG = {
  width: width,
  height: height,
  debug: true,
};


const Scenes = [PreloadScene, PlayScene];
const createScene = (Scene) => new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map(createScene);

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixcelArt: true,
  zoom: 1.5,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 20 },
    },
  },
  scene: initScenes(),
};

new Phaser.Game(config);
