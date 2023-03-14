class preloadGame extends Phaser.Scene {
  constructor() {
    super("PreloadGame");
  }
  preload() {


    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.image("particle", "assets/particle.png");
    for (var i = 0; i < 125; i++) {
      this.load.image("particle", "assets/particle.png");
    }




    //this.load.image("particle", "assets/sprites/particle.png");
    this.load.bitmapFont('topaz', 'assets/fonts/topaz.png', 'assets/fonts/topaz.xml');


    this.load.spritesheet("particle_color", "assets/particles.png", {
      frameWidth: 6,
      frameHeight: 6
    });
    this.load.spritesheet("door", "assets/sprites/door.png", {
      frameWidth: 16,
      frameHeight: 32
    });

    this.load.spritesheet("player", "assets/sprites/player4.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet("spear", "assets/sprites/spear.png", {
      frameWidth: 16,
      frameHeight: 64
    });

    this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
      frameWidth: 16,
      frameHeight: 16,
      margin: 1,
      spacing: 1
    });
    this.load.spritesheet("key", "assets/sprites/keyM.png", {
      frameWidth: 16,
      frameHeight: 16,

    });
    this.load.spritesheet("shield", "assets/sprites/bigshield.png", {
      frameWidth: 36,
      frameHeight: 40,
      margin: 1,
      spacing: 1
    });
    this.load.spritesheet("torch", "assets/sprites/torchburn.png", {
      frameWidth: 16,
      frameHeight: 16,
      margin: 1,
      spacing: 1
    });
    this.load.spritesheet("potion", "assets/sprites/potion.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("bomb_anim", "assets/sprites/bomb_anim.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("chest", "assets/sprites/chest.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("player_icon", "assets/sprites/player_icon.png", {
      frameWidth: 30,
      frameHeight: 26,
      margin: 1,
      spacing: 1
    });
    this.load.spritesheet('explode', 'assets/sprites/explosion.png', {
      frameWidth: 48,
      frameHeight: 48
    });

    //enemies
    this.load.spritesheet('knight', 'assets/sprites/enemies/knight.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet('knighttan', 'assets/sprites/enemies/Knight_F.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet('knightgold', 'assets/sprites/enemies/Knight_G.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet('knightgrey', 'assets/sprites/enemies/Knight_H.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet('knightturtle', 'assets/sprites/enemies/Knight_T.png', {
      frameWidth: 48,
      frameHeight: 48
    });

    this.load.spritesheet('swordsman', 'assets/sprites/enemies/swordsman.png', {
      frameWidth: 80,
      frameHeight: 64
    });
    this.load.spritesheet('crow', 'assets/sprites/enemies/crow.png', {
      frameWidth: 16,
      frameHeight: 16
    });


    this.load.spritesheet('enemybullets', 'assets/sprites/enemies/enemybullets.png', {
      frameWidth: 8,
      frameHeight: 8
    });
    this.load.image('magicbullet', 'assets/sprites/magicbullet.png');
    this.load.image('shell', 'assets/sprites/enemies/shell.png');
    this.load.image('bomb', 'assets/sprites/bomb.png');
    this.load.image('hplatform', 'assets/sprites/hplatform.png');
    this.load.image('back1', 'assets/sprites/outsideback1.png');
    this.load.image('back3', 'assets/sprites/outsideback2.png');
    this.load.image('back2', 'assets/sprites/insideback1.png');
    this.load.image('startback', 'assets/sprites/startback.png');
    this.load.image('blank', 'assets/sprites/blank.png');
    this.load.image("touch-slider", "assets/sprites/touch-slider.png");
    this.load.image("touch-knob", "assets/sprites/touch-knob.png");

  }
  create() {
    this.scene.start("startGame");
    //this.scene.start("PlayGame");

  }
}








