import Player from "../characters/Players";
import Phasher from "phaser";
import initAnimation from "../characters/anims/playerAnims";

class PlayScene extends Phasher.Scene {
  // new PlayScene(SHARED_CONFIG) 때 입력값을 config 으로 받음 (SHARED_CONFIG = config)
  constructor(config) {
    super("PlayScene");
    this.config = config;
  }
  preload() {
    this.anims.create({
      key:'walk',
      frames: this.anims.generateFrameNumbers('User', {start:0, end:5}),
      frameRate:8,
      repeat:-1
    })

    
  }
  create() {
    this.add
      .image(this.config.width / 2, this.config.height / 2, "background")
      .setOrigin(0.5);

    // 플레이어 선언
    this.player = this.physics.add.sprite(
      this.config.width / 2, this.config.height / 2, "User") //
      this.user.play('walk') 
      .setScale(0.4) // 크기 설정값
      .setOrigin(0.5); // 기준값 정중앙으로 변경

    this.player.body.velocity.x = this.VELOCITY; // 초기 속도 설정

    this.player.setBounce(1) .setCollideWorldBounds(true); //맵 가장자리에서 튕겨나오는 여부

    this.cameras.main.startFollow(this.player);

    // set camera center
    this.cameras.main.setFollowOffset(-180, -100);

    this.group = this.physics.add.group();

    const keycodes = Phaser.Input.Keyboard.KeyCodes;
    this.inputKeys = this.input.keyboard.addKeys({
      up : keycodes.W,
      down : keycodes.S,
      left : keycodes.A,
      right : keycodes.D,
    })
    }

  update() {
    const userSpeed = 200;
    let userVelocity = new Phaser.Math.Vector2(); // x,y값만 구해줌
    const inputkey = this.inputKeys;

    // 좌우 키조작
    if (inputkey.left.isDown) {
      userVelocity.x = -1;
      this.user.setFlipX(true)
    } else if (inputkey.right.isDown) {
      userVelocity.x = 1;
      this.user.setFlipX(false);

    }

    // 위아래 키조작
    if (inputkey.up.isDown) {
      userVelocity.y = -1;
      //this.user.setFlipY(true);
    } else if (inputkey.down.isDown) {
      userVelocity.y = 1;
      //this.user.setFlipY(false);
    }

    userVelocity.scale(userSpeed);
    this.user.setVelocity(userVelocity.x, userVelocity.y);
}
}
export default PlayScene;
