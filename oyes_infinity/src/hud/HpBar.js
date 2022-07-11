import Phaser from "phaser";

class HpBar {
  constructor(scene, x, y, scale = 1, health) {
    this.bar = new Phaser.GameObjects.Graphics(scene);

    this.x = x / scale;
    this.y = y / scale;
    this.scale = scale;
    this.value = health;

    this.size = {
      width: 40,
      height: 8,
    };

    this.pixelPerHealth = this.size.width / this.value;

    scene.add.existing(this.bar);

    this.draw(this.x, this.y, this.scale);
  }

  decrease(amount) {
    if (amount <= 0) {
      this.value = 0;
    } else {
      this.value = amount;
    }

    this.draw(this.x, this.y, this.scale);
  }

  redraw(x, y, scale, hp) {
    this.value = hp;
    this.draw(x, y, scale);
  }

  playerMove(velocity) {
    console.log(velocity.x);
    this.x -= velocity.x;
    this.y -= velocity.y;
    this.draw(this.x, this.y, this.scale);
  }

  draw(x, y, scale) {
    this.bar.clear();
    const { width, height } = this.size;

    const margin = 2;

    this.bar.fillStyle(0x000);
    this.bar.fillRect(x, y, width + margin, height + margin);

    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(x + margin, y + margin, width - margin, height - margin);

    const healthWidth = Math.floor(this.pixelPerHealth * this.value);

    if (healthWidth <= this.size.width / 3) {
      this.bar.fillStyle(0xff0000);
    } else {
      this.bar.fillStyle(0x00ff00);
    }

    if (healthWidth > 0) {
      this.bar.fillRect(
        x + margin,
        y + margin,
        healthWidth - margin,
        height - margin
      );
    }

    return this.bar.setScrollFactor(0, 0).setScale(scale);
  }
}

export default HpBar;
