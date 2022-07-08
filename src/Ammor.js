import Phaser from "phaser";

class AmmorGroup extends Phaser.Physics.Arcade.Group {
        constructor(scene) {
            super(scene.physics.world, scene);
        }

        fire(x, y, direction) {
            const projectile = this.getFirstDead(false);
            if (projectile) {
                projectile.fire(x, y, direction);
            }
        }


    // 무기타입 인베토리에 정해두기
    loadAmmor(ammoIndex) {
        this.clear();
        if (ammoIndex == 1) {
            this.classtype = Flame;
        } else if (ammoIndex == 2) {
            this.classtype = Water;
        }
        this.creatMuliple(
            {classtype: this.classtype, framQuantity: 20, active: false, visible: false, key: []}
        )
    }
}