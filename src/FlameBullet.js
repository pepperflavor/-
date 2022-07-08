import Phaser from "phaser";


//토순이 중심으로 불꽃 뽑아내기
// phaser 상속클래스 밖에서는 js코드 사용가능

// const FireConfig ={
//   type: Phaser.AUTO,
//   width: 800,
//   height : 600,
//   parent: 'phaser-example',
//   scene:[]
// }

class FlameBullet extends Phaser.Scene {
  constructor(config) {
    super("FlameBullet");
    this.config = config;
  }
  preload() {
    // // 무기 이펙트 이미지 미리 로드
    // this.load.image("rollingFire1", "asset/fire1.png", {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // });
    // this.load.image("rollingFire2", "asset/fire2.png", {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // });
    // this.load.image("rollingFire3", "asset/fire3.png", {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // });
    // this.load.image("rollingFire4", "asset/fire4.png", {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // });
    // this.load.image("rollingFire5", "asset/fire5.png", {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // });
    // //this.load.spritesheet

    // 회전하는 불꽃속성무기
    this.load.spritesheet("fireline", "asset/fireline.png",{frameWidth : 32, frameHeight: 32, spacing:32});
  }


  create() {

    const flameCircle = new Phaser.Geom.Circle(400, 300, 220);

    this.group = this.add.group({
      key: "fireline",
      frame: [0, 1, 5],
      repeat: 10,
    });

    Phaser.Actions.PlaceOnCircle(this.group.getChildren(), flameCircle);

    this.tween = this.tweens.addCounter({
      from: 220,
      to: 100,
      duration: 3000,
      delay: 2000,
      ease: "Sine.easeInOut",
      repeat: -1,
      yoyo: true, // 오호!!!
    });
  }

  update() {
    Phaser.Actions.RotateAroundDistance(
      this.group.getChildren(),
      {
        x: 400,
        y: 300,
      },
      0.02,
      this.tween.getValue()
    );
  }
}

export default FlameBullet;