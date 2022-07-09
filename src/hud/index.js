import Phaser from "phaser";

// 컨테이너는 한번에 하나의 scene에만 포함될수있으면 기본 위치가 0x0임 위치조절을 해주려면 MoveUp, MoveDown 같은 메서드로
// 해줘야하며 컨테이너에 포함된 모든 객체는 자식요소 취급한다 그래서 Container.x 같은걸로 위치를 조절하면 모든 자식요소에 영향을
// 미친다. origin 에 및 음수 배율 인수를 모두 설정해서는 안 됩니다. 그렇지 않으면 입력 영역이 잘못 정렬됩니다.

class Experience extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    scene.add.existing(this);

    const { middleBottom } = scene.config;

    this.ContainerWidth = 200;
    this.setPosition(this.containerWidth / 2, this.containerHeight / 2);
    this.setScrollFactor(0);
    this.setDepth(99);

    this.fontSize = 20;
    this.setupList();
  }

  setupList() {
    // 유저 경험치바
    const experienceBar = this.createExperienceBar();

    //몬스터의 경험치
    let monsterExperience = 30;

    this.add([experienceBar]);

    //let lineHeight = 0;

    this.list.forEach((experience) => {
      experience.setPosition(experience.x, experience.y + monsterExperience);
      lineHeight += monsterExperience;
    });
  }

  createExperienceBar() {
    const experienceText = this.scene.add.text(0, 0, "0", {
      fontSize: `${this.fontSize}px`,
      fill: "#fff",
    });
    const experienceImage = this.scene.add
      .image(experienceText.width + 5, 0, "item")
      .setOrigin(0)
      .setScale(1.3);

    const experienceBar = this.scene.add.container(0, 0, [
      experienceText,
      experienceImage,
    ]);
    experienceBar.setName("experienceBar");
    return experienceBar;
  }

  updateexperienceBar(experience) {
    const [experienceText, experienceImage] = this.getByName("experienceBar").list;
    experienceText.setText(experience);
    experienceImage.setX(this.containerWidth / 2);
  }
}

export default Experience;;