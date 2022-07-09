import Phaser from "phaser";

class Monster extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, key){
        super(scene, x, y, key);

        this.config = scene.config;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.init();
    }

    init(){
        this.health = 30;
        this.damage = 10;
    }
}