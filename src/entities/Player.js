import Phaser from 'phaser'



class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, 'player');

        this.init();
    }

    // 초기값 설정
    init(){
        this.gravity = 0;
        this.playerspeed = 1;

        // 체력 설정
        this.health = 50;
        this.hp = new HealthBar;

        // 마지막으로 누른 방향
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;;
    }

    create(){

        this.anims.create({
          key: "walk",
          frames: this.anims.generateFrameNumbers("User", {
            frames: [0, 1, 2 ,3 ,4 ,5 ,6],
          }),
          frameRate:8,
          repeat:-1,
        });


    }

    update(){
        if(this.inputKeys.up){
            this.User.velocity.y = 1;
        }
    }

}

export default Player;