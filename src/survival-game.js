import Phaser from "phaser";

const config = {
  width: innerWidth,
  height: innerHeight,
  backgroundColor: "#3333333",
  type: Phaser.AUTO,
  parent: "survival-game",
  scene: [],
  scale: {
    zoom: 6,
  },
  physics: {
    default: "arcade",
    matter: {
      debug: true,
      gravity: { y: 0 },
    },
  },
};

// 나중에 충돌 감지할때 써
/*  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: "matterCollision",
        mapping: "matterCollision",
      },
    ],
  },*/
//export default new Phaser.Game(config);
