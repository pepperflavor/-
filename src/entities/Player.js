import Phaser from 'phaser'
import HealthBar from "../hud/HealthBar";



class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, 'player');

        scene.add.existing(this);
        scene.physics.add.existing(this);

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
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;

        // 체력바 초기설정
        this.health = 30;
        this.hp = new HealthBar(
          this.scene,
          // 미들박스가 체력바 위치할 곳 게임화면 중앙
          this.scene.config.middleBox.x + 5,
          this.scene.config.middleBox.y + 5,
          2,
          this.health
        );
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