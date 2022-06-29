const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const img = new Image();
img.src = "asset/background.jpg";

img.onload = function () {
  c.drawImage(img, 30, 30, 100, 100, 0, 0, canvas.width, canvas.height);
};

const missle_img = [];

const MONSTER_IMG = {
  slime: {
    base: "./asset/normal_slime",
    walk: new Image(),
    src: {
      walk: "",
    },
  },
};

for (let idx = 0; idx < 14; idx++) {
  missle_img.push(new Image());
  missle_img[idx].src = `./asset/comet${idx + 1}.png`;
}

let animationId;
const missles = [];
const enemies = [];
const particles = [];
const PARTICLE = 1;
const ENEMYSPEED = 0.3;
const ENEMYNUM = 88;
const SPWAN = 10;
const MAX = 130;
const MIN = 20;
const DAMAGE = 2;
const MISSILE_SPEED = 3.6;
const ATKSPEED = 1000;
canvas.width = innerWidth;
canvas.height = innerHeight;

//다중입력 //////////////////////////////////////////////
window.addEventListener("keydown", keysPressed, false);
window.addEventListener("keyup", keysReleased, false);

const keys = {
  ArrowLeft: false,
  ArrowDown: false,
  ArrowUp: false,
  ArrowRight: false,
};
const backgroundPosition = {
  x: 0,
  y: 0,
};
const playerKeyVelocityMinus = {
  x: 0,
  y: 0,
};
const playerKeyVelocityPlus = {
  x: 0,
  y: 0,
};

function setStateBar(id, pos) {
  const monsterWrap = document.createElement("div");
  const barWrap = document.createElement("div");
  const hpBar = document.createElement("div");
  const damageText = document.createElement("span");
  monsterWrap.classList.add("monster_wrap");
  barWrap.classList.add("bar_wrap");
  hpBar.classList.add("hp_bar");
  damageText.classList.add("damage_text");
  barWrap.appendChild(hpBar);
  monsterWrap.appendChild(damageText);
  monsterWrap.appendChild(barWrap);
  hpBar.style.width = "100%";
  monsterWrap.id = `monster_${id}`;
  document.querySelector("body").appendChild(monsterWrap);
  monsterWrap.style.top = `${pos.y}px`;
  monsterWrap.style.left = `${pos.x}px`;
  return monsterWrap;
}
for (let idx = 0; idx < ENEMYNUM; idx++) {
  setStateBar(idx, { x: 0, y: 0 });
}

let h = 0; // 0 - 59
let m = 0; // 0 - 59
let s = 0; // 0 - 59
let ms = 0; // 0 - 99
let timerId;

function showTime() {
  if (h === 60) {
    h += 1;
    m = 0;
  }

  if (s === 60) {
    m += 1;
    s = 0;
  }

  if (ms === 99) {
    s += 1;
    ms = 0;
  }

  const string_h = h < 10 ? "0" + h : h;
  const string_m = m < 10 ? "0" + m : m;
  const string_s = s < 10 ? "0" + s : s;
  const string_ms = ms < 10 ? "0" + ms : ms;

  ms++;

  const time = string_h + ":" + string_m + ":" + string_s + ":" + string_ms;

  document.getElementById("MyClockDisplay").innerHTML = time;

  // document.getElementById("MyClockDisplay").textContent = time;

  timerId = setTimeout(showTime, 10);
}
function keyEvent() {
  playerKeyVelocityPlus.y = keys["ArrowUp"] ? 1 : 0;
  playerKeyVelocityMinus.y = keys["ArrowDown"] ? -1 : 0;
  playerKeyVelocityPlus.x = keys["ArrowLeft"] ? 1 : 0;
  playerKeyVelocityMinus.x = keys["ArrowRight"] ? -1 : 0;

  backgroundPosition.y -= playerKeyVelocityPlus.y;
  backgroundPosition.x -= playerKeyVelocityPlus.x;
  backgroundPosition.y -= playerKeyVelocityMinus.y;
  backgroundPosition.x -= playerKeyVelocityMinus.x;
}
function keysPressed(e) {
  keys[e.key] = true;
  keyEvent();
}
function keysReleased(e) {
  keys[e.key] = false;
  keyEvent();
}

//////////////////////////////////////////////////////////

const playerDirection = {};

class Player {
  constructor(position, radius, color, damage = DAMAGE) {
    this.pos = position;
    this.radius = radius;
    this.color = color;
    this.damage = damage;
    this.img = new Image();
    this.img.src = "./asset/player.png";
    this.img.maxFrame = 8;
    this.img.pixel = 32;
    this.img.currFrame = 0;
    this.img.framElapes = 0;
    this.img.framHold = 10;
  }

  draw() {
    c.drawImage(
      this.img,
      this.img.currFrame * 32,
      0,
      32,
      32,
      canvas.width / 2 - 50,
      canvas.height / 2 - 50,
      100,
      100
    );

    this.img.framElapes++;

    if (this.img.framElapes % this.img.framHold === 0) {
      this.img.currFrame++;
      if (this.img.currFrame === this.img.maxFrame) {
        this.img.currFrame = 0;
        this.img.framElapes = 0;
      }
    }
  }
}

class Missile {
  constructor(position, radius, color, velocity, angle) {
    this.pos = position;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.angle = angle;
    this.speed = 2;
    this.maxFrame = 4;
    this.pixel = 38;
    this.currFrame = 0;
    this.framElapes = 0;
    this.framHold = 10;
    this.process = 0;
    this.pathProcess = 0;
    this.state = "fire";
  }

  setReload(position) {
    this.state = "reload";
    this.pos = position;
    this.speed = 2;
    this.maxFrame = 4;
    this.pixel = 38;
    this.currFrame = 0;
    this.framElapes = 0;
    this.framHold = 10;
    this.process = 0;
    this.pathProcess = 0;
  }
  setFire(velocity, angle) {
    this.state = "fire";
    this.velocity = velocity;
    this.angle = angle;
  }

  draw() {
    if (this.state === "fire") {
      this.framElapes++;
      this.pathProcess++;
      if (this.framElapes % this.framHold === 0) {
        this.process++;
        if (this.process >= 5) this.process = 3;
      }
      this.velocity.x *= 1 + this.pathProcess * 0.001;
      // console.log(missile_moving)
      c.save();
      c.translate(this.pos.x, this.pos.y);
      c.rotate(this.angle);
      c.translate(-this.pos.x, -this.pos.y);

      c.drawImage(
        missle_img[this.process + 1],
        this.pos.x - 80 / 2,
        this.pos.y - 80 / 2,
        80,
        80
      );
      c.restore();
    }
  }
  update() {
    this.draw();
    this.pos.x += this.velocity.x * this.speed;
    this.pos.y += this.velocity.y * this.speed;
  }
}

class Enemy {
  constructor(
    id = 0,
    position,
    radius,
    color,
    velocity,
    speed = 1,
    hp = 25,
    state = "walk" // "hurt" or ""
  ) {
    this.id = id;
    this.pos = position;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.speed = speed;
    this.hp = hp;
    this.maxHp = hp;
    this.state = state;

    this.stateBar = document.getElementById(`monster_${this.id}`);

    this.monsterName = "slime";
    this.img = new Image();
    this.img.src = `./asset/normal_${this.monsterName}/Walk.png`;
    this.img.hurt_src = `./asset/normal_${this.monsterName}/Hurt.png`;
    this.img.walk_src = `./asset/normal_${this.monsterName}/Walk.png`;
    this.img.death_src = `./asset/normal_${this.monsterName}/Death.png`;

    this.img.maxFrame = 4;
    this.img.pixel = 38;
    this.img.currFrame = 0;
    this.img.framElapes = 0;
    this.img.framHold = 20;
  }

  updateStateBar() {
    this.stateBar.style.top = `${this.pos.y}px`;
    this.stateBar.style.left = `${this.pos.x}px`;
    // console.log(this.stateBar.childNodes[1]);
    this.stateBar.childNodes[1].childNodes[0].style.opacity = 1
    this.stateBar.childNodes[1].childNodes[0].style.width = `${
      (this.hp / this.maxHp) * 100
    }%`;
  }

  draw() {
    this.updateStateBar();
    c.save();
    if (this.pos.x <= canvas.width / 2) {
      c.scale(-1, 1);
      c.drawImage(
        this.img,
        this.img.currFrame * 38 + 1,
        0,
        38,
        38,
        -(this.pos.x - 35),
        this.pos.y - 35,
        -80,
        80
      );
    } else {
      c.drawImage(
        this.img,
        this.img.currFrame * 38 + 1,
        0,
        38,
        38,
        this.pos.x - 35,
        this.pos.y - 35,
        80,
        80
      );
    }
    c.restore();
    this.img.framElapes++;
    if (this.img.framElapes % this.img.framHold === 0) {
      this.img.currFrame++;
      if (this.img.currFrame === this.img.maxFrame) {
        this.img.currFrame = 0;
      }
    }
  }

  getVelocity() {
    const angle = Math.atan2(
      player.pos.y - this.pos.y,
      player.pos.x - this.pos.x
    );

    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    switch (this.state) {
      case "walk":
        this.velocity = velocity;
        return this.velocity;
        break;
      case "hurt":
        this.velocity = { x: 0, y: 0 };
        return this.velocity;
        break;
      case "death":
        this.velocity = { x: 0, y: 0 };
        return this.velocity;
        break;

      case "respawn":
        this.velocity = velocity;
        return this.velocity;
        break;
      default:
        this.velocity = velocity;
        return this.velocity;
        break;
    }
  }

  update() {
    this.velocity = this.getVelocity();
    this.draw();
    this.pos.x +=
      this.velocity.x * this.speed +
      playerKeyVelocityMinus.x +
      playerKeyVelocityPlus.x;
    this.pos.y +=
      this.velocity.y * this.speed +
      playerKeyVelocityMinus.y +
      playerKeyVelocityPlus.y;
  }

  switchState(inputState) {
    const temp = this.velocity;
    this.currFrame = 0;
    this.framElapes = 0;
    switch (inputState) {
      case "walk":
        this.state = "walk";
        this.img.src = this.img.walk_src;
        break;
      case "hurt":
        this.state = "hurt";
        this.img.src = this.img.hurt_src;
        this.velocity = { x: 0, y: 0 };
        // console.log("끄앙 다침", this.state);
        setTimeout(() => {
          this.state = "walk";
          this.velocity = temp;
          this.switchState("walk");
          // console.log("나음", this.state);
        }, 180);
        break;
      case "death":
        this.state = "death";
        this.radius = 0;
        this.img.src = this.img.death_src;
        this.velocity = { x: 0, y: 0 };
        this.stateBar.childNodes[1].childNodes[0].style.opacity = 0
        this.stateBar.childNodes[1].childNodes[0].style.width =
          0 %
          // console.log("끄앙 쥬금", this.state);
          setTimeout(() => {
            this.state = "respawn";
            this.velocity = temp;
            this.switchState("respawn");
            // console.log("리스폰", this.state);
          }, 180);
        break;

      case "respawn":
        this.state = "walk";
        this.radius = 35;
        const position = randomPosition(100);
        this.pos = position;
        this.img.src = this.img.walk_src;
        this.hp = 25;

        break;
      default:
        this.img.src = this.img.walk_src;

        break;
    }
  }
}

class Particle {
  constructor(position) {
    this.pos = position;
    this.maxFrame = 4;
    this.pixel = 38;
    this.currFrame = 0;
    this.framElapes = 0;
    this.framHold = 2;
    this.process = 0;
    this.done = false;
  }
  draw() {
    this.framElapes++;

    if (this.framElapes % this.framHold === 0) {
      this.process++;
      if (this.process >= 7) this.done = true;
    }

    // console.log(missile_moving)

    c.drawImage(
      missle_img[this.process + 6],
      this.pos.x - 80 / 2,
      this.pos.y - 80 / 2,
      80,
      80
    );
  }
  update() {
    this.draw();
  }
}

const player = new Player(
  { x: innerWidth / 2, y: innerHeight / 2 },
  35,
  "blue"
);

function autoAtk() {
  let angle;
  enemies.forEach((enemy) => {
    angle = Math.atan2(
      enemy.pos.y - canvas.height / 2,
      enemy.pos.x - canvas.width / 2
    );
    const velocity = {
      x: Math.cos(angle) * MISSILE_SPEED,
      y: Math.sin(angle) * MISSILE_SPEED,
    };

    missles.push(
      new Missile(
        {
          x: canvas.width / 2,
          y: canvas.height / 2,
        },
        5,
        "white",
        velocity,
        angle
      )
    );
    // console.log(missles);
  });
}

const autoATkId = setInterval(() => {
  autoAtk();
}, ATKSPEED);

onclick = (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };

  missles.push(
    new Missile(
      {
        x: canvas.width / 2,
        y: canvas.height / 2,
      },
      5,
      "white",
      velocity
    )
  );
};

function randomPosition(gap) {
  let randomX;
  let randomY;
  const selectXY = Math.random() < 0.5 ? false : true;

  if (selectXY) {
    randomX = Math.random() < 0.5 ? 0 - gap : canvas.width + gap;
    randomY = Math.random() * canvas.height;
  } else {
    randomX = Math.random() * canvas.width;
    randomY = Math.random() < 0.5 ? 0 - gap : canvas.height + gap;
  }

  return { x: randomX, y: randomY };
}

function randomRadius() {
  return Math.random() * (MAX - MIN) + MIN;
}

function spawnEnemies() {
  let id = 0;
  setInterval(() => {
    const position = randomPosition(100);
    const enemyRadius = 35;
    const color = `red`;

    const angle = Math.atan2(
      player.pos.y - position.y,
      player.pos.x / 2 - position.x
    );

    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    // const speed = (Math.random() + ENEMYSPEED) * 0.1;

    if (enemies.length < ENEMYNUM)
      enemies.push(
        new Enemy(id, position, enemyRadius, color, velocity, ENEMYSPEED)
      );
    id++;
  }, SPWAN);
}

function animate() {
  // console.log(enemies);
  // console.log(enemies.length);
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.4)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  // c.drawImage(img, 0, 0);
  // this.img.maxFrame = 8;
  // this.img.pixel = 32;
  // console.log("몬스터수: ", enemies.length);
  c.drawImage(
    img,
    backgroundPosition.x,
    backgroundPosition.y,
    backgroundPosition.x + 800,
    backgroundPosition.y + 500,
    0,
    0,
    canvas.width,
    canvas.height
  );
  // c.drawImage(img, 20, 20, 100, 100);

  // console.log(player.img.pixel * player.img.currFrame);

  player.draw();

  enemies.forEach((enemy, enemyIdx) => {
    enemy.update();
    const playerEnemyDist = Math.hypot(
      player.pos.x - enemy.pos.x,
      player.pos.y - enemy.pos.y
    );
    if (playerEnemyDist - player.radius - enemy.radius === 0) {
      cancelAnimationFrame(animationId);
      clearTimeout(timerId);
      clearInterval(autoATkId);
      document.getElementById("MyClockDisplay").classList.add("gameover");
    }

    missles.forEach((missle, missleIdx) => {
      const missleEnemyDist = Math.hypot(
        missle.pos.x - enemy.pos.x,
        missle.pos.y - enemy.pos.y
      );
      if (missleEnemyDist - enemy.radius - missle.radius <= 0) {
        if (enemy.hp - player.damage > player.damage) {
          enemy.hp -= player.damage;

          particles.push(
            new Particle({
              x: missle.pos.x,
              y: missle.pos.y,
            })
          );
          enemy.switchState("hurt");
          setTimeout(() => {
            missles.splice(missleIdx, 1);
          }, 0);
        } else {
          setTimeout(() => {
            particles.push(
              new Particle({
                x: missle.pos.x,
                y: missle.pos.y,
              })
            );
            enemy.switchState("death");
            missle.setReload(player.pos);
            // missles.splice(missleIdx, 1);
            // enemies.splice(enemyIdx, 1);
          }, 0);
        }
      } else {
        if (
          missle.pos.x >= canvas.width ||
          missle.pos.x < 0 ||
          missle.pos.y >= canvas.height ||
          missle.pos.y < 0
        ) {
          missles.splice(missleIdx, 1);
        }
      }
    });
  });

  missles.forEach((missle, idx) => {
    missle.velocity.x *= 1 + idx * 0.00005;
    missle.velocity.y *= 1 + idx * 0.00005;
    missle.update();
  });

  particles.forEach((particle, idx) => {
    if (particle.done) {
      setTimeout(() => {
        particles.splice(idx, 1);
      }, 0);
    } else {
      particle.update();
    }
  });
}

animate();
spawnEnemies();
showTime();
