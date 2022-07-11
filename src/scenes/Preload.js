import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {

  // new PreloadScene(SHARED_CONFIG) 때 입력값을 config 으로 받음 (SHARED_CONFIG = config) 
  constructor(config) {

    //Phaser.Scene 클래스를 기본설정값 선언함
    super("PreloadScene");

    //PreloadScene 안에 에 저장함 (PreloadScene.config = this.config)
    this.config = config;
  }

  // 맨처음 시작되는 함수
  preload() {

    this.load.image("background", "assets/background.png");

    this.load.spritesheet("player_character", "assets/player_1/Pink_Monster_Walk_6.png",{
      frameWidth:32,
      frameHeight:32,
      spacing:32,
    });

  }

  // 두번째 실행되는 함수
  create() {
    this.add
      .image(this.config.width / 2, this.config.height / 2, "background")
      .setOrigin(0.5);
    // this.add
    //   .image(this.config.width / 2, this.config.height / 2, "player_character")
    //   .setOrigin(0.5);



    // 주 게임 씬을 호출하여 시작 (@@중요@@)
    this.scene.start("PlayScene");
  }
  update() {}
}

// this.add.sprite(this.config, this.config, 'player').setOrigin(0);
// this.scene.start('PlayScene');


    
// 다른 자바스크립트 파일에서 import 접근할 수 있게 선언
export default PreloadScene;
