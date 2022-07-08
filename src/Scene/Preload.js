import Phaser from "phaser";

class preload extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    // // 배경이미지
    // this.load.image("forest_world_map", "assets/forest_bg.png");

    // //유저캐릭터
    // this.load.spritesheet("User", "assets/user/Pink_Monster_Walk_6.png", {
    //   frameWidth: 32,
    //   frameHeight: 32,
    //   spacing: 32,
    // });

    //배경이미지
    this.load.image("forest_map", "assets/forest_bg.png");

    //유저캐릭터 이미지 로드
    this.load.spritesheet("User", "assets/user/Pink_Monster_Walk_6.png", {
      frameWidth: 32,
      frameHeight: 32,
      spacing: 32,
    });
    console.log("미리로딩");

    //불꽃무기 이미지 픽셀별로 잘라서 씀
    this.load.spritesheet("fireline", "assets/fireline-removebg-preview.png", {
      frameWidth: 32,
      frameHeight: 32,
      spacing: 32,
    });

    // this.anims.create({
    //   key: "fireline-anims",
    //   frames: this.anims.generateFrameNumbers("fireline", {
    //     start: 0,
    //     end: 5,
    //   }),
    //   frameRate: 5,
    //   repeat: -1,
    // });

    // this.anims.create({
    //   key: "User-walk",
    //   frames: this.anims.generateFrameNumbers("User", {
    //     start: 0,
    //     end: 6,
    //   }),
    //   frameRate: 6,
    //   repeat: -1, // -1로 주면 무한반복함
    // });
  }

  create() {
    //this.registry.set('level',1);
    this.scene.start("MainScene");
  }
}

export default preload;
