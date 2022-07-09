//import Phaser, { Scene } from "phaser";
import Phaser from "phaser";
import MainScene from "./Scene/MainScene.js";

import FlameBullet_ver2 from "./FlameBullet_ver2.js";
import PreloadScene from "./Scene/Preload.js";
import UserMove from "./UserMove.js"
// import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

const SHARED_CONFIG = {
  width: 1100 ,
  height: innerHeight,
  middleBox:{
    x: (width /2),
    y : ( height - 120)
  },
  startLevel : 1
};

//다중  Scene 초기화 하기
// const Scene = [PreloadScene, MainScene, FlameBullet_ver2];
const Scene = [PreloadScene, MainScene];

// 클래스 선언 함수
const createScene = (Scene) => new Scene(SHARED_CONFIG);

//Scene 배열에 담겨있는 scene마다 createScenes 함수 실행하기
const initScenes = () => Scene.map(createScene);

// 다른 scene들과 config 공유해야함
const config = {
  ...SHARED_CONFIG,
  backgroundColor: "none",
  type: Phaser.AUTO,
  parent: "survival-game",
  pixelArt: true,
  
  scale: {
    zoom: 1,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 0},
    },
  },

  //scene 배열에 담긴 값들에  config
  scene : initScenes(),
};



// 나중에 충돌 감지할때 써
//   plugins: {
//     scene: [
//       {
//         plugin: PhaserMatterCollisionPlugin,
//         key: "matterCollision",
//         mapping: "matterCollision",
//       },
//     ],
//   },
//export default new Phaser.Game(config);
new Phaser.Game(config)