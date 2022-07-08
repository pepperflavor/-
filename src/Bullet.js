import Phaser from "phaser";

//불 속성 무기 나가는거
class Grannde extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene, x, y);
        this.dmg = 20;
        this.enemyHit = [];
        this.bounceCounter = 3;
    }

    // 발사
    fire(x, y, direction){
        this.body.reset(x, y);
        this.body.setGravityY(-1000);
        this.setBounce(1);
        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(WeaponConst);
    }
}