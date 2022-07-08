
class UserMove extends Phaser.Scene {
    constructor(USER_CONFIG) {
        super("UserMove");
        this.USER_CONFIG;
        this.data = {};
    }

    init() {
        this.data = {
            r: -0.05,
            s: -0.0012,
            sx: 0.25,
            x: 400,
            y: 100
        };

    }

    preload() {
        // gif 이미지 갖고오기
        this
            .load
            .setPath("assets/fireball-ver2-unscreen.gif");
    }

    create(){
        this.anims.create({
            key: 'swish',
            frames : frames,
            repeat: -1
        });

        this.group = this.add.group();

        this.group.createMultiple({})
    }

    update(){

    }

}

// const game = new Phaser.Game(UserMove);