const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const img = new Image();
img.src = "asset/background1.jpg";

img.onload = function () {
  c.drawImage(img, 30, 30, 100, 100, 0, 0, canvas.width, canvas.height);
};

const missle_img = [];

//몬스터 이미지 로드
const MONSTER_IMG = {
  slime: {
    base: "./asset/normal_slime",
    walk: new Image(),
    src: {
      walk: "",
    },
  },
};

// 미사일 이미지 로드
for (let idx = 0; idx < 14; idx++) {
  missle_img.push(new Image());
  missle_img[idx].src = `./asset/comet${idx + 1}.png`;
}

let animationId;
const missles = [];
const enemies = [];
const particles = [];
const PARTICLE = 1;
const ENEMYSPEED = 2;
const ENEMYNUM = 88;
const SPWAN = 10;
const MAX = 130;
const MIN = 20;
const DAMAGE = 2;
const MISSILE_SPEED = 3.6;
const ATKSPEED = 1000;
canvas.width = innerWidth;
canvas.height = innerHeight;

//다중입력 이벤트 설정 키 눌렀을때 키 땟을때를 구분함
window.addEventListener("keydown", keysPressed, false);
window.addEventListener("keyup", keysReleased, false);

// 키의 상태를 담을 객체 선언
const keys = {
  ArrowLeft: false,
  ArrowDown: false,
  ArrowUp: false,
  ArrowRight: false,
};

//뒷배경을 움직일 수 있는 변수 생성
const backgroundPosition = {
  x: 0,
  y: 0,
};

// 왼쪽, 위쪽방향 변수
const playerKeyVelocityMinus = {
  x: 0,
  y: 0,
};

// 오른쪽, 아래쪽방향 변수
const playerKeyVelocityPlus = {
  x: 0,
  y: 0,
};

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

//hp바를 생성하는 함수
function setStateBar(id, pos) {
  //
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

//몬스터 마릿수대로 미리 생성
for (let idx = 0; idx < ENEMYNUM; idx++) {
  setStateBar(idx, { x: 0, y: 0 });
}

////위에 시계 관련함수////////////////////////////////////////////////
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

// 플레이어 클래스
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
    //이미지 랜더링
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

    // 프레임이 빨라서 늦춰줌
    if (this.img.framElapes % this.img.framHold === 0) {
      this.img.currFrame++;
      if (this.img.currFrame === this.img.maxFrame) {
        this.img.currFrame = 0;
        this.img.framElapes = 0;
      }
    }
  }
}

//미사일 클래스
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

  //재장전 (오류있음)
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
    this.framElapes++;
    this.pathProcess++;

    // 미사일 프레임을 느리게해줌
    if (this.framElapes % this.framHold === 0) {
      this.process++;
      if (this.process >= 5) this.process = 3;
    }
    this.velocity.x *= 1 + this.pathProcess * 0.001;
    // console.log(missile_moving)
    c.save();


    // 미사일의 궤적방향으로 이미지를 회전시킴
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


  update() {
    //업데이트 할때마다 궤적에 따라 미사일을 이동시킴
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
    // 적의 위치에 따라 hp바를 이동시킴
    this.stateBar.style.top = `${this.pos.y}px`;
    this.stateBar.style.left = `${this.pos.x}px`;

    // hp에 따른 바 계산
    this.stateBar.childNodes[1].childNodes[0].style.opacity = 1;
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


    //상태에 따라 애니메이션 정하기
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
    //업데이트마다 플레이어의 위치를 향해 가도록 각도를 계산
    const angle = Math.atan2(
      player.pos.y - this.pos.y,
      player.pos.x - this.pos.x
    );

    //구한 각도로 궤도 구함
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    this.draw();
    // 궤적에 따라 위치 이동
    this.pos.x +=
      velocity.x * this.speed +
      playerKeyVelocityMinus.x +
      playerKeyVelocityPlus.x;
    this.pos.y +=
      velocity.y * this.speed +
      playerKeyVelocityMinus.y +
      playerKeyVelocityPlus.y;
  }

  // 상태
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
        // console.log("끄앙 다침", this.state);
        setTimeout(() => {
          this.state = "walk";
          // this.velocity = temp;
          this.switchState("walk");
          // console.log("나음", this.state);
        }, 180);
        break;
      case "death":
        this.state = "death";
        this.radius = 0;
        this.img.src = this.img.death_src;
        this.velocity = { x: 0, y: 0 };
        this.stateBar.childNodes[1].childNodes[0].style.opacity = 0;
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

// 파편객체 생성
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
    //매 프레임마다 미사일 이미지를 그림
    this.framElapes++;

    //너무 빨리 바뀌어서 프레임을 7번 늦춰줌
    if (this.framElapes % this.framHold === 0) {
      this.process++;

      //파편 애니메이션이 끝났으면 상태를 끝남으로 지정
      //파편 객체 제거 판단용으로 씀
      if (this.process >= 7) this.done = true;
    }

    //이미지 불러옴
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

// 플레이어 생성
const player = new Player(
  { x: innerWidth / 2, y: innerHeight / 2 },
  35,
  "blue"
);

// 자동공격함수
function autoAtk() {
  let angle;

  // 생성되어있는 적을 조회
  enemies.forEach((enemy) => {
    //플레이어와 적의 각도를 계산
    angle = Math.atan2(
      enemy.pos.y - canvas.height / 2,
      enemy.pos.x - canvas.width / 2
    );

    //계산된 각도를 이용해 궤적을 만듦 미사일 속도 적용
    const velocity = {
      x: Math.cos(angle) * MISSILE_SPEED,
      y: Math.sin(angle) * MISSILE_SPEED,
    };

    //미사일 객체 생성 및 발사
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

// 자동공격함수를 주기적으로 호출
const autoATkId = setInterval(() => {
  autoAtk();
}, ATKSPEED);

// 클릭 이벤트 함수
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

// 적의 생성 좌표
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

//적 생성함수
function spawnEnemies() {
  let id = 0;

  //일정 주기마다 호출
  setInterval(() => {
    // 상하좌우 4곳에서 랜덤으로 생성
    const position = randomPosition(100);
    const enemyRadius = 35;
    const color = `red`;

    // 몹이 랜덤생성된 자리와 플레이어와의 각도를 구함
    const angle = Math.atan2(
      player.pos.y / 2 - position.y,
      player.pos.x / 2 - position.x
    );

    //플레이어를 향한 궤적 생성
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    // const speed = (Math.random() + ENEMYSPEED) * 0.1;

    // 적객체의 생성량을 제한함
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

  //
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.4)";
  c.fillRect(0, 0, canvas.width, canvas.height);
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

  console.log(missles.length);

  //1. 토순이 업데이트
  player.draw();

  //2. 생성된 적들 업데이트
  enemies.forEach((enemy, enemyIdx) => {
    //업데이트
    enemy.update();

    // 나와 적의 거리계산
    const playerEnemyDist = Math.hypot(
      player.pos.x - enemy.pos.x,
      player.pos.y - enemy.pos.y
    );

    //나와 적의 접촉여부를 확인
    if (playerEnemyDist - player.radius - enemy.radius === 0) {
      //게임오버 처리 부분
      //매 프레임마다 랜더링하는 코어함수 제거
      cancelAnimationFrame(animationId);

      //상단에 타이머 함수 제거
      clearTimeout(timerId);

      //자동 공격하는 함수 제거
      clearInterval(autoATkId);

      //상단 시계 게임오버 상태 적용
      document.getElementById("MyClockDisplay").classList.add("gameover");
    }

    //3. 미사일 업데이트
    missles.forEach((missle, missleIdx) => {
      //미사일과 적의 거리 계산
      const missleEnemyDist = Math.hypot(
        missle.pos.x - enemy.pos.x,
        missle.pos.y - enemy.pos.y
      );

      //미사일과 적의 접촉여부 확인
      if (missleEnemyDist - enemy.radius - missle.radius <= 0) {
        // 적의 hp가 아직 있음을 확인하는 조건문
        if (enemy.hp - player.damage > player.damage) {
          // 적 객체 hp값을 데미지에 따라 깎음
          enemy.hp -= player.damage;

          //파편 효과 파편객체 생성
          particles.push(
            new Particle({
              x: missle.pos.x,
              y: missle.pos.y,
            })
          );

          //적 상태를 으앙 다침으로 변경
          enemy.switchState("hurt");

          //적중한 미사일을 제거
          setTimeout(() => {
            missles.splice(missleIdx, 1);
          }, 0);
        } else {
          //적이 으앙쥬금
          setTimeout(() => {
            particles.push(
              new Particle({
                x: missle.pos.x,
                y: missle.pos.y,
              })
            );
            //적 상태를 으앙 쥬금으로 변경
            enemy.switchState("death");

            //미사일을
            // missle.setReload(player.pos);
            missles.splice(missleIdx, 1);
            enemies.splice(enemyIdx, 1);
          }, 0);
        }
      } else {
        //화면을 나간 미사일 객체를 제거
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

  //미사일의 궤적을 바꿈 missle.velocity.x, -.y 궤적의 x 성분 y성분
  missles.forEach((missle, idx) => {
    missle.velocity.x *= 1 + idx * 0.00005;
    missle.velocity.y *= 1 + idx * 0.00005;
    missle.update();
  });

  //파편 궤적, 삭제하는 부분
  particles.forEach((particle, idx) => {
    if (particle.done) {
      //파편 궤적, 삭제하는 부분
      setTimeout(() => {
        particles.splice(idx, 1);
      }, 0);

      //파편 궤적 업데이트
    } else {
      particle.update();
    }
  });
}



// function animate() {
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
//   checkMissleEnemy()
// }

animate();
spawnEnemies();
showTime();
