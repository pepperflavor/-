// import Phaser from "phaser";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    // scene.Physics.add.existing(this);
    // Mixins 재활용함수
    // Object.assign(this, collidable);
    // Object.assign(this, anims);
    this.init();
    // this.initEvents();
    console.log(this);
  }

  init() {
    this.gravity = 100;
    this.health = 30;
    console.log("@player Scene@@@@@@@@@@@");
    // this.cursors = this.scene.input.keyboard.createCursorKeys();
    // this.body.setGravityY(this.gravity);
    // this.scene.time.addEvent({
    //   delay: 350,
    //   repeat: -1,
    //   callbackScope: this,
    //   callback: () => {
    //     if (this.isPlayingAnims("run")) {
    //       this.stepSound.play();
    //     }
    //   },
    // });
  }

  // initEvents() {
  //   this.scene.events.on(Phaser.Scene.Events.UPDATE, this.update(), this);
  // }
  create() {
    console.log("@@@@@@@@@@@@");
  }

  //매 프레임마다 업데이트되는 함수
  update() {
    console.log("@@@@@@@@@@@@");
  }
}

export default Player;
