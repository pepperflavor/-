class MainScene extends Phaser.Scene {
  // new MainScene(SHARED_CONFIG{x:800, y:600})

  constructor(config) {
    //config = {width:800, height:600}
    super("MainScene");
    this.config = config;
  }

  preload() {
    this.load.image("bono", "assets/forest_bg.png");
    this.load.image("tosun", "assets/tosun.png");
    console.log("미리로딩");
  }

  create() {
    this.add
      .image(this.config.width / 2, this.config.height / 2, "bono")
      .setOrigin(0.5, 0.5);
    this.tosun = this.physics.add.sprite(
      this.config.width / 2,
      this.config.height / 2,
      "tosun"
    );
    this.tosun.setCollideWorldBounds(true); // 충돌감지
    this.tosun.body.velocity.x = 400;
    //   this.player = new Phaser.Physics.Arcade.Collider.World();

    const keycodes = Phaser.Input.Keyboard.KeyCodes;
    this.inputKeys = this.input.keyboard.addKeys({
      up: keycodes.W,
      down: keycodes.S,
      left: keycodes.A,
      right: keycodes.D,
    });
    console.log("객체 생성");
  }

  update() {
    console.log("animate");
    const speed = 2.5;
    const inputkey = this.inputKeys;

    let playerVelocity = new Phaser.Math.Vector2();

    // if (this.tosun.x < 0) {
    //     this.tosun.body.velocity.x =400;
    // }else if (this.tosun.x >this.config.width) {
    //     this.tosun.body.velocity.x = -400;
    // }

    // if (this.tosun.y < 0) {
    //   this.tosun.body.velocity.y = 400;
    // } else if (this.tosun.y > this.config.height) {
    //   this.tosun.body.velocity.y = -400;
    // }

    if (inputkey.up.isDown) {
      // 상하키조작
      playerVelocity.x = -1;
    } else if (inputkey.right.isDown) {
      playerVelocity.x = 1;
    }

    // 좌우 키조작
    if (inputkey.left.isDown) {
      playerVelocity.y = -1;
    } else if (inputkey.right.isDown) {
      playerVelocity.y = 1;
    }
  }
}

// 이렇게 선언해도 survival-game에서 사용한다고 써줘야 화면에 나옴
// phaser를 import한 곳에서 써야함 나ㅓ는 npm으로 라이브러리들을 직접깔았기때문

export default MainScene;
