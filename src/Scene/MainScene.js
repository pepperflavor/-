class MainScene extends Phaser.Scene {
  // new MainScene(SHARED_CONFIG{x:800, y:600})

  constructor(config) {
    //config = {width:800, height:600}
    super("MainScene");
    this.config = config;
  }

  preload() {
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("User", { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });

    //  this.anims.create({
    //    key: "fireline-a",
    //    frames: this.anims.generateFrameNumbers("fireline", {
    //      start: 0,
    //      end: 5,
    //    }),
    //    frameRate: 5,
    //    repeat: -1,
    //  });
  }

  create() {
    this.add.image(this.config.width / 2, this.config.height / 2, "forest_map");

    //유저의 처음 생성위치
    this.user = this.physics.add.sprite(
      this.config.width / 2,
      this.config.height / 2,
      "User"
    );
    this.user.play("walk");

    // 여기 속도값때문에 중심에서 어긋났었음
    this.user.body.velocity.x = 300;
    this.user.body.velocity.y = 300;
    this.user.setBounce(1).setCollideWorldBounds(true); // 충돌감지
    //   this.player = new Phaser.Physics.Arcade.Collider.World();

    this.cameras.main.startFollow(this.user);

    // 조종 키 설정
    const keycodes = Phaser.Input.Keyboard.KeyCodes;
    this.inputKeys = this.input.keyboard.addKeys({
      up: keycodes.W,
      down: keycodes.S,
      left: keycodes.A,
      right: keycodes.D,
    });

    console.log("객체 생성");

    ////////////////////무기 생성 코드 시작

    const fireWeapon = new Phaser.Geom.Circle(
      this.user.body.x,
      this.user.body.y,
      260
    );

    this.group = this.physics.add.group({
      key: "fireline",
      frameQuantity: 32,
    });

    Phaser.Actions.PlaceOnCircle(this.group.getChildren(), fireWeapon);

    this.tween = this.tweens.addCounter({
      from: 100,
      to: 0,
      duration: 1000,
      delay: 20000000000, // 발사체가 균등하게 거리를 유지하지 않아서 딜레이를 엄청줌ㅎㅎ
      ease: "Sine.easeInOut",
      repeat: -1,
      yoyo: true,
    });

    for (let idx = 0; idx < 25; idx++) {
      const tempChild = this.group.create(0, 0, "fireline");
      tempChild.setSize(32, 32);
    }

    this.group.children.each((child) => {
      child.setOrigin(0.5);
      //console.log(child);
    });
  }

  update() {
    console.log("animate");

    //=======유저 이동조작키 적용 코드 시작
    const userSpeed = 200;
    let userVelocity = new Phaser.Math.Vector2(); // x,y값만 구해줌
    const inputkey = this.inputKeys;

    // 좌우 키조작
    if (inputkey.left.isDown) {
      userVelocity.x = -1;
      this.user.setFlipX(true);
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
    this.group.setVelocity(userVelocity.x, userVelocity.y);
    // this.user.setVelocityY(userVelocity.y);

    let playerVelocity = new Phaser.Math.Vector2();

    // const fireWeapon = new Phaser.Geom.Circle(
    //   this.user.body.x,
    //   this.user.body.y,
    //   260
    // );
    // 불꽃무기 생성 위치 코드
      Phaser.Actions.RotateAroundDistance(
        this.group.getChildren(),
        {
          x: this.user.body.x,
          y: this.user.body.y,
        },
        0.02,
        this.tween.getValue()
      );
  

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
  }
}

// 이렇게 선언해도 survival-game에서 사용한다고 써줘야 화면에 나옴
// phaser를 import한 곳에서 써야함 나ㅓ는 npm으로 라이브러리들을 직접깔았기때문

export default MainScene;
