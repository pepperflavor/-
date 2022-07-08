import Phaser from "phaser";

class FlameBullet_ver2 extends Phaser.Scene {
  constructor(config) {
    super("FlameBullet_ver2");
    this.USER_CONFIG;
    this.config = config;
    // this.data = {};
  }

  // 회전시키는 조건같아서뺌
  //   init() {
  //     this.data = {
  //       r: -0.05,
  //       s: -0.0012,
  //       sx: 0.25,
  //       x: 400,
  //       y: 100,
  //     };
  //   }

  preload() {
    // gif 이미지 갖고오기
    this.load.setPath("assets/fireball_ver3.png");
  }

  create() {
    this.anims.create({
      key: "swish",
      frames: frames,
      repeat: -1,
    });

    this.group = this.add.group();

    this.group.createMultiple({});
  }

  update() {}
}

export default FlameBullet_ver2;
// const game = new Phaser.Game(UserMove);
