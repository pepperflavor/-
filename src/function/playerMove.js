if (inputkey.up.isDown) {
  // 상하키조작
  playerVelocity.x = -100;
} else if (inputkey.right.isDown) {
  playerVelocity.x = 1;
}

// 좌우 키조작
if (inputkey.left.isDown) {
  playerVelocity.y = -1;
} else if (inputkey.right.isDown) {
  playerVelocity.y = 1;
}


 this.add.image(this.config.width / 2, this.config.height / 2, "forest_map");
 //움직임 생성
 this.user = this.physics.add.sprite(
   this.config.width / 2,
   this.config.height / 2,
   "User"
 );

 // 여기 속도값때문에 중심에서 어긋났었음
 this.user.body.velocity.x = 300;
 this.user.body.velocity.y = 300;
 this.user.setBounce(1).setCollideWorldBounds(true); // 충돌감지
 //   this.player = new Phaser.Physics.Arcade.Collider.World();

 this.cameras.main.startFollow(this.user);

 const keycodes = Phaser.Input.Keyboard.KeyCodes;
 this.inputKeys = this.input.keyboard.addKeys({
   up: keycodes.W,
   down: keycodes.S,
   left: keycodes.A,
   right: keycodes.D,
 });
 console.log("객체 생성");
