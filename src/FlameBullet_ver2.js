import Phaser from "phaser";

class FlameBullet_ver2 extends Phaser.Scene {
  constructor(config) {
    super("FlameBullet_ver2");
    this.USER_CONFIG;
    this.config = config;
    this.data = {};
  }

  // 회전시키는 조건같아서뺌
  init() {
    this.data = {
      r: 0.05,
      s: 0.0012,
      sx: 0.25,
      x: 400,
      y: 100,
    };
  }

  preload() {
    // gif 이미지 갖고오기
    this.load.spritesheet({
      key: "fireball",
      url: "assets/fireline-removebg-preview.png",
      frameConfig: {
        frameWidth: 32,
        frameHeight: 32,
        startFrame: 0,
        endFrame: 8,
      },
    });
  }

  create() {
    this.anims.create({
      key: "swish",
      frames: frames,
      repeat: -1,
    });

    this.group = this.add.group({ key: "fireball", framQuantity: 65 });

    Phaser.Actions.PlaceOnCircle(this.group.getChildren(), "fireball");

    this.tween = this.tweens.addCounter({
      from: 260,
      to: 500,
      duration: 3000,
      delay: 2000,
      ease: "Sine.easeInOut",
      repeat: -1,
      yoyo: true,
    });

    this.group.createMultiple({});
  }

  update() {
    Phaser.Actions.RotateAroundDistance(
      this.group.getChildren(),
      { x: 400, y: 300 },
      0.02,
      this.tween.getValue()
    );
  }
}

export default FlameBullet_ver2;

// const game = new Phaser.Game(UserMove);
